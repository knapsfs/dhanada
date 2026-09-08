import unittest
from datetime import date
from unittest.mock import MagicMock, patch

from dhanada.sif.sync.importer import DataImporter
from dhanada.sif.sync.mapper import DataMapper
from dhanada.sif.sync.models import NavUpdate, SchemePlan, SyncDataset


class TestSIFAUMSync(unittest.TestCase):

	def setUp(self):
		self.mapper = DataMapper(isin_sif_map={})

	def test_mapper_nav_with_aum(self):
		"""Test mapping a daily NAV row containing AUM column."""
		raw_data = {
			"nav_daily": [
				{
					"sif_code": "SIF-122",
					"nav_date": "13-Jul-2026",
					"nav": "10.9249",
					"AUM": "6138.22",
				}
			]
		}
		dataset = self.mapper.map_dataset(raw_data)
		self.assertEqual(len(dataset.nav_updates), 1)
		nav_up = dataset.nav_updates[0]
		self.assertEqual(nav_up.sif_code, "SIF-122")
		self.assertEqual(nav_up.nav, 10.9249)
		self.assertEqual(nav_up.nav_date, date(2026, 7, 13))
		self.assertEqual(nav_up.aum, 6138.22)

	def test_mapper_nav_with_comma_formatted_aum(self):
		"""Test mapping a daily NAV row containing comma-formatted AUM."""
		raw_data = {
			"nav_daily": [
				{
					"sif_code": "SIF-11",
					"nav_date": "13-Jul-2026",
					"nav": "10.8206",
					"AUM": "146,725.84",
				}
			]
		}
		dataset = self.mapper.map_dataset(raw_data)
		self.assertEqual(len(dataset.nav_updates), 1)
		nav_up = dataset.nav_updates[0]
		self.assertEqual(nav_up.aum, 146725.84)

	def test_mapper_nav_with_blank_aum(self):
		"""Test mapping a daily NAV row with blank/empty AUM."""
		raw_data = {
			"nav_daily": [
				{
					"sif_code": "SIF-61",
					"nav_date": "13-Jul-2026",
					"nav": "10.5020",
					"AUM": "",
				}
			]
		}
		dataset = self.mapper.map_dataset(raw_data)
		self.assertEqual(len(dataset.nav_updates), 1)
		nav_up = dataset.nav_updates[0]
		self.assertEqual(nav_up.sif_code, "SIF-61")
		self.assertEqual(nav_up.nav, 10.5020)
		self.assertIsNone(nav_up.aum)

	def test_mapper_older_csv_without_aum_column(self):
		"""Test backward compatibility when raw CSV row lacks the AUM key entirely."""
		raw_data = {
			"nav_daily": [
				{
					"sif_code": "SIF-120",
					"nav_date": "09-Jul-2026",
					"nav": "10.8032",
				}
			]
		}
		dataset = self.mapper.map_dataset(raw_data)
		self.assertEqual(len(dataset.nav_updates), 1)
		nav_up = dataset.nav_updates[0]
		self.assertEqual(nav_up.sif_code, "SIF-120")
		self.assertEqual(nav_up.nav, 10.8032)
		self.assertIsNone(nav_up.aum)

	@patch("frappe.db.commit")
	@patch("frappe.get_doc")
	@patch("frappe.get_all")
	def test_importer_update_nav_with_aum(self, mock_get_all, mock_get_doc, mock_commit):
		"""Test that SIFDataImporter updates nav, nav_date, and aum on matching SIF Scheme Plan."""
		mock_get_all.return_value = ["INF754K30136"]
		mock_plan = MagicMock()
		mock_plan.nav_date = "2026-07-10"
		mock_plan.nav = 10.7875
		mock_plan.aum = None
		mock_get_doc.return_value = mock_plan

		importer = DataImporter(dry_run=False)
		nav_up = NavUpdate(sif_code="SIF-122", nav_date=date(2026, 7, 13), nav=10.9249, aum=6138.22)

		importer._update_nav(nav_up)

		self.assertEqual(mock_plan.nav, 10.9249)
		self.assertEqual(mock_plan.nav_date, date(2026, 7, 13))
		self.assertEqual(mock_plan.aum, 6138.22)
		mock_plan.save.assert_called_once_with(ignore_permissions=True)

	@patch("frappe.db.commit")
	@patch("frappe.get_doc")
	@patch("frappe.get_all")
	def test_importer_missing_aum_does_not_overwrite_existing(
		self, mock_get_all, mock_get_doc, mock_commit
	):
		"""Test that a blank/None AUM update does not overwrite an existing valid AUM."""
		mock_get_all.return_value = ["INF754K30136"]
		mock_plan = MagicMock()
		mock_plan.nav_date = "2026-07-10"
		mock_plan.nav = 10.7875
		mock_plan.aum = 6138.22  # Existing AUM
		mock_get_doc.return_value = mock_plan

		importer = DataImporter(dry_run=False)
		# Update with newer date and nav, but aum=None
		nav_up = NavUpdate(sif_code="SIF-122", nav_date=date(2026, 7, 14), nav=10.9500, aum=None)

		importer._update_nav(nav_up)

		self.assertEqual(mock_plan.nav, 10.9500)
		self.assertEqual(mock_plan.nav_date, date(2026, 7, 14))
		# Existing AUM must remain untouched
		self.assertEqual(mock_plan.aum, 6138.22)
		mock_plan.save.assert_called_once_with(ignore_permissions=True)


if __name__ == "__main__":
	unittest.main()
