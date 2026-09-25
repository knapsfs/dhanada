"""
Risk Profiler API & Brevo Email Dispatcher for Dhanada App.
Handles lead capture and personalized risk profile report delivery via Brevo.
All SMTP credentials and configuration are fetched dynamically at runtime from 'Dhanada Settings'.
Zero sensitive credentials are hardcoded.
"""

import json
import re
import smtplib
import urllib.parse
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr

import frappe
from frappe.rate_limiter import rate_limit


def get_brevo_config():
	"""
	Fetches Brevo SMTP configuration dynamically from Frappe 'Dhanada Settings' Single DocType.
	No sensitive data is hardcoded; all credentials reside safely in the database.
	"""
	try:
		if not frappe.db.exists("DocType", "Dhanada Settings"):
			frappe.log_error(title="Brevo Settings Error", message="DocType 'Dhanada Settings' does not exist.")
			return None

		settings = frappe.get_single("Dhanada Settings")

		server = (getattr(settings, "brevo_smtp_server", None) or "").strip()
		port = getattr(settings, "brevo_smtp_port", None)
		user = (getattr(settings, "brevo_smtp_user", None) or "").strip()

		# Decrypt password securely from Frappe Password field
		password = None
		if hasattr(settings, "get_password"):
			password = settings.get_password("brevo_smtp_password")
		if not password:
			password = getattr(settings, "brevo_smtp_password", None)

		sender_email = (getattr(settings, "sender_email", None) or "").strip()
		sender_name = (getattr(settings, "sender_name", None) or "").strip() or "KNAPS Financial Services"
		admin_email = (getattr(settings, "admin_notification_email", None) or "").strip() or sender_email

		if not server or not user or not password:
			frappe.log_error(
				title="Brevo Credentials Missing",
				message="Brevo SMTP Server, User, or Password is missing in Dhanada Settings. Please configure it in the desk.",
			)
			return None

		return {
			"smtp_server": server,
			"smtp_port": int(port) if port else 587,
			"smtp_user": user,
			"smtp_password": password,
			"sender_email": sender_email,
			"sender_name": sender_name,
			"admin_email": admin_email,
		}
	except Exception as err:
		frappe.log_error(title="Failed to fetch Dhanada Settings for Brevo", message=str(err))
		return None


BAND_CONFIG = {
	"Balanced": {
		"title": "Balanced Investor Profile",
		"badge_bg": "#ccfbf1",
		"badge_color": "#0f766e",
		"badge_border": "#5eead4",
		"summary": "Your responses reflect a balanced approach—seeking steady wealth accumulation while maintaining a dependable cushion against sharp market pullbacks.",
		"allocations": [
			{"label": "Debt & Fixed Income", "pct": 50, "color": "#2563eb"},
			{"label": "Equities (Large & Flexi-Cap)", "pct": 40, "color": "#0ea5e9"},
			{"label": "Gold / Liquid Cash", "pct": 10, "color": "#f59e0b"},
		],
		"products": [
			{
				"name": "Balanced Advantage & Dynamic Asset Allocation Funds",
				"desc": "Automatically rebalances equity and debt to protect capital in dips and capture upside in rallies.",
			},
			{
				"name": "High Quality Short-Term & Corporate Bond Funds",
				"desc": "Provides steady yield with minimal credit and interest rate risk.",
			},
			{
				"name": "Large-Cap & Flexi-Cap Mutual Funds",
				"desc": "Disciplined exposure to India's top industry leaders for long-term compounding.",
			},
		],
		"advice": "Focus on consistent asset allocation. Maintain a balanced mix of debt for liquidity and high-quality equity for beating inflation.",
	},
	"Moderate": {
		"title": "Moderate Investor Profile",
		"badge_bg": "#fef3c7",
		"badge_color": "#b45309",
		"badge_border": "#fde68a",
		"summary": "Your responses indicate that you are comfortable accepting moderate market fluctuations in pursuit of healthy, inflation-beating long-term growth.",
		"allocations": [
			{"label": "Equities (Large, Mid & Multi-Cap)", "pct": 65, "color": "#0d9488"},
			{"label": "Debt & Fixed Income", "pct": 25, "color": "#3b82f6"},
			{"label": "SIF / Alternative Multi-Asset", "pct": 10, "color": "#f59e0b"},
		],
		"products": [
			{
				"name": "Multi-Cap & Large & Mid-Cap Funds",
				"desc": "Balanced growth engine across market capitalizations for superior risk-adjusted returns.",
			},
			{
				"name": "SIF - Long-Short Derivative Strategies",
				"desc": "Access innovative hedging strategies designed to generate alpha while dampening equity drawdowns.",
			},
			{
				"name": "Dynamic Bond & Banking Debt Funds",
				"desc": "Active duration management for safety, liquidity, and periodic rebalancing ammunition.",
			},
		],
		"advice": "Hold an investment horizon of 3-5+ years. Tactical asset allocation and hedging allow you to ride out volatility without panic.",
	},
	"Aggressive": {
		"title": "Aggressive Investor Profile",
		"badge_bg": "#f3e8ff",
		"badge_color": "#6b21a8",
		"badge_border": "#d8b4fe",
		"summary": "Your responses indicate high risk tolerance and a primary focus on substantial long-term capital compounding and specialized alpha strategies.",
		"allocations": [
			{"label": "Equities (Mid, Small & High-Growth)", "pct": 75, "color": "#7e22ce"},
			{"label": "SIF (Long-Short Derivative Funds)", "pct": 20, "color": "#3b82f6"},
			{"label": "Cash / Tactical Buffer", "pct": 5, "color": "#64748b"},
		],
		"products": [
			{
				"name": "Mid-Cap & Small-Cap Mutual Funds",
				"desc": "Rapid earnings growth potential in emerging market leaders.",
			},
			{
				"name": "SIF - Equity Long-Short & Sector Rotation",
				"desc": "Uses long and short derivative positions to generate alpha in bull, bear, and sideways regimes.",
			},
			{
				"name": "SIF - Ex-Top 100 Long-Short Strategies",
				"desc": "Unlocks high-conviction opportunities outside mega-caps with institutional hedging.",
			},
		],
		"advice": "Maintain a minimum 5 to 7 year horizon. Advanced derivative strategies in SIFs help manage drawdowns while maximizing long-term upside.",
	},
}

# Compatibility aliases
BAND_CONFIG["Conservative"] = BAND_CONFIG["Balanced"]
BAND_CONFIG["Moderately Aggressive"] = BAND_CONFIG["Moderate"]
BAND_CONFIG["Very Aggressive"] = BAND_CONFIG["Aggressive"]


def generate_risk_email_html(name, profile, score, max_score, metrics):
	band = BAND_CONFIG.get(profile, BAND_CONFIG["Moderate"])
	clean_name = (name or "Investor").strip().title()
	pct_score = int(round((score / max_score) * 100)) if max_score else 70

	wa_text = f"Hi KNAPS Team, I completed my Investor Risk Profiler assessment. My indicative profile is {profile} (Score: {score}/{max_score}). I would like to consult with an advisor regarding my portfolio."
	wa_url = f"https://wa.me/+919990243143?text={urllib.parse.quote(wa_text)}"

	alloc_bars = ""
	for item in band["allocations"]:
		alloc_bars += f"""
        <tr>
          <td style="padding: 6px 0; font-size: 13px; color: #334155; font-weight: 600;">{item["label"]}</td>
          <td style="padding: 6px 0; font-size: 13px; color: #0a192f; font-weight: 700; text-align: right; width: 60px;">{item["pct"]}%</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-bottom: 10px;">
            <div style="background-color: #f1f5f9; border-radius: 999px; height: 8px; overflow: hidden; width: 100%;">
              <div style="background-color: {item['color']}; height: 8px; width: {item['pct']}%; border-radius: 999px;"></div>
            </div>
          </td>
        </tr>
        """

	product_cards = ""
	for p in band["products"]:
		product_cards += f"""
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;">
          <div style="font-size: 14px; font-weight: 700; color: #0a192f; margin-bottom: 4px;">{p["name"]}</div>
          <div style="font-size: 12px; color: #64748b; line-height: 1.5;">{p["desc"]}</div>
        </div>
        """

	risk_comfort = (metrics or {}).get("riskComfort", "Moderate to High")
	flexibility = (metrics or {}).get("financialFlexibility", "High")
	experience = (metrics or {}).get("experience", "Intermediate")
	horizon = (metrics or {}).get("horizon", "Long-term (5+ Years)")

	return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Investor Risk Profile - KNAPS Financial Services</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7fb; padding: 30px 10px;">
    <tr>
      <td align="center">
        <!-- Container -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(3, 46, 146, 0.08); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #021d63 0%, #032e92 100%); padding: 32px 30px; text-align: center;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; background-color: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 999px; padding: 5px 16px; margin-bottom: 12px;">
                      <span style="color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">KNAPS FINANCIAL SERVICES</span>
                    </div>
                    <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.5px;">Investor Risk Profile Report</h1>
                    <p style="color: #bfdbfe; font-size: 13px; margin: 0;">Comprehensive diagnostic assessment prepared for {clean_name}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 30px 20px 30px;">
              
              <!-- Greeting -->
              <p style="font-size: 16px; color: #0a192f; margin: 0 0 16px 0; font-weight: 600;">Dear {clean_name},</p>
              <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 24px 0;">
                Thank you for completing the <strong>KNAPS Investor Risk Profiler</strong>. Understanding your comfort with market fluctuations is fundamental to building an enduring, goal-aligned wealth strategy.
              </p>

              <!-- Profile Result Card -->
              <div style="background-color: #f8fafc; border: 2px solid {band['badge_border']}; border-radius: 16px; padding: 24px; margin-bottom: 26px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td>
                      <span style="display: inline-block; background-color: {band['badge_bg']}; color: {band['badge_color']}; border: 1px solid {band['badge_border']}; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 999px; margin-bottom: 8px;">
                        YOUR INDICATIVE PROFILE
                      </span>
                      <h2 style="font-size: 26px; font-weight: 900; color: #0a192f; margin: 6px 0 10px 0; letter-spacing: -0.5px;">
                        {profile}
                      </h2>
                      <p style="font-size: 13px; color: #334155; line-height: 1.6; margin: 0 0 16px 0;">
                        {band['summary']}
                      </p>
                      
                      <!-- Score Badge -->
                      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px;">
                        <tr>
                          <td style="font-size: 12px; color: #64748b; font-weight: 600;">Assessment Score</td>
                          <td style="font-size: 13px; color: #032e92; font-weight: 800; text-align: right;">{score} / {max_score} points ({pct_score}%)</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Diagnostic Metrics Grid -->
              <h3 style="font-size: 15px; font-weight: 800; color: #0a192f; margin: 0 0 14px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                Key Profile Diagnostics
              </h3>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 26px;">
                <tr>
                  <td width="48%" style="vertical-align: top; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px;">
                    <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">Risk Comfort</div>
                    <div style="font-size: 14px; color: #0a192f; font-weight: 800;">{risk_comfort}</div>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="vertical-align: top; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px;">
                    <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">Financial Flexibility</div>
                    <div style="font-size: 14px; color: #0a192f; font-weight: 800;">{flexibility}</div>
                  </td>
                </tr>
                <tr><td colspan="3" height="10"></td></tr>
                <tr>
                  <td width="48%" style="vertical-align: top; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px;">
                    <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">Investment Horizon</div>
                    <div style="font-size: 14px; color: #0a192f; font-weight: 800;">{horizon}</div>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="vertical-align: top; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px;">
                    <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; margin-bottom: 4px;">Experience Level</div>
                    <div style="font-size: 14px; color: #0a192f; font-weight: 800;">{experience}</div>
                  </td>
                </tr>
              </table>

              <!-- Suggested Asset Allocation -->
              <h3 style="font-size: 15px; font-weight: 800; color: #0a192f; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                Indicative Strategic Asset Allocation
              </h3>
              
              <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px 20px; margin-bottom: 26px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  {alloc_bars}
                </table>
              </div>

              <!-- Recommended Instruments & Strategies -->
              <h3 style="font-size: 15px; font-weight: 800; color: #0a192f; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px;">
                Tailored Strategies for Your Profile
              </h3>
              
              <div style="margin-bottom: 26px;">
                {product_cards}
              </div>

              <!-- Advisor Guidance Box -->
              <div style="background-color: #eff6ff; border-left: 4px solid #032e92; border-radius: 8px; padding: 14px 18px; margin-bottom: 28px;">
                <div style="font-size: 13px; font-weight: 800; color: #032e92; margin-bottom: 4px;">Advisory Note</div>
                <div style="font-size: 12px; color: #1e3a8a; line-height: 1.6;">
                  {band['advice']}
                </div>
              </div>

              <!-- CTA Buttons Section -->
              <div style="background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%); border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <h4 style="font-size: 18px; font-weight: 800; color: #0a192f; margin: 0 0 8px 0;">
                  Ready to align your portfolio with this profile?
                </h4>
                <p style="font-size: 13px; color: #64748b; margin: 0 0 18px 0; line-height: 1.5;">
                  Speak with our certified financial planners at KNAPS to build a custom-crafted portfolio combining Mutual Funds, Specialized Investment Funds (SIFs), and retirement solutions.
                </p>
                
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center">
                      <a href="{wa_url}" target="_blank" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 10px; margin-bottom: 8px; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);">
                        Chat with Advisor on WhatsApp &rarr;
                      </a>
                    </td>
                  </tr>
                </table>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0a192f; padding: 24px 30px; text-align: center;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0 0 10px 0;">
                <strong>KNAPS Financial Services</strong> &bull; Wealth Management &bull; Specialized Investment Funds &bull; Mutual Funds
              </p>
              <p style="color: #64748b; font-size: 11px; line-height: 1.6; margin: 0 0 12px 0;">
                Need assistance? Call us at <strong>+91 99902 43143</strong> or email <a href="mailto:contact@knaps.com" style="color: #60a5fa; text-decoration: none;">contact@knaps.com</a>
              </p>
              <p style="color: #475569; font-size: 10px; line-height: 1.5; margin: 0; border-top: 1px solid #1e293b; padding-top: 12px;">
                Disclaimer: This report provides an indicative risk profile based on self-reported inputs and is strictly for educational purposes. It does not constitute formal financial, tax, or investment advice. Mutual fund and specialized investment fund investments are subject to market risks. Past performance does not guarantee future results.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


def send_brevo_smtp_email(to_email, subject, html_content, reply_to=None):
	"""Sends an HTML email via Brevo SMTP relay dynamically using Dhanada Settings."""
	cfg = get_brevo_config()
	if not cfg or not cfg.get("smtp_password"):
		raise ValueError("Brevo SMTP credentials are not configured in Dhanada Settings.")

	sender_name = cfg["sender_name"]
	sender_email = cfg["sender_email"]

	msg = MIMEMultipart("alternative")
	msg["Subject"] = subject
	msg["From"] = formataddr((sender_name, sender_email))
	msg["To"] = to_email
	msg["Reply-To"] = reply_to or sender_email

	msg.attach(MIMEText(html_content, "html", "utf-8"))

	server = smtplib.SMTP(cfg["smtp_server"], cfg["smtp_port"], timeout=25)
	server.starttls()
	server.login(cfg["smtp_user"], cfg["smtp_password"])
	server.sendmail(sender_email, [to_email], msg.as_string())
	server.quit()
	return True


def send_admin_alert(name, email, phone, profile, score, max_score, metrics, answers_summary):
	"""Sends internal alert to admin about new risk profile submission."""
	cfg = get_brevo_config()
	if not cfg or not cfg.get("admin_email"):
		return

	admin_email = cfg["admin_email"]
	subject = f"[New Lead] Investor Risk Profile: {name} ({profile})"
	html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h3 style="color: #032e92; margin-top: 0;">New Investor Risk Profile Lead Captured</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Name:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{name}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Email:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:{email}">{email}</a></td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Phone:</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:{phone}">{phone}</a></td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Risk Band:</td><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; color: #032e92;">{profile}</td></tr>
        <tr><td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #eee;">Score:</td><td style="padding: 8px; border-bottom: 1px solid #eee;">{score} / {max_score}</td></tr>
      </table>
      <h4 style="color: #0a192f; margin-top: 20px;">Assessment Summary:</h4>
      <pre style="background: #f8fafc; padding: 12px; border-radius: 8px; font-size: 12px; white-space: pre-wrap;">{answers_summary}</pre>
    </div>
    """
	try:
		send_brevo_smtp_email(admin_email, subject, html)
	except Exception as err:
		frappe.log_error(title="Admin Alert Email Failed", message=str(err))


@frappe.whitelist(allow_guest=True, methods=["POST"])
@rate_limit(limit=10, seconds=60, ip_based=True, methods="POST")
def submit_risk_profile():
	"""
	Whitelisted endpoint to capture Risk Profiler lead, create CRM Lead,
	and send customized Risk Profile Report email via Brevo SMTP using Dhanada Settings.
	"""
	try:
		# 1. Parse payload
		payload = {}
		req = getattr(frappe.local, "request", None)
		if req and hasattr(req, "data") and req.data:
			try:
				payload = json.loads(req.data)
			except Exception:
				payload = frappe.form_dict or {}
		else:
			payload = frappe.form_dict or {}

		if not payload and hasattr(frappe, "form_dict") and frappe.form_dict:
			payload = frappe.form_dict

		# 2. Extract and validate fields
		full_name = (payload.get("full_name") or payload.get("name") or "").strip()
		email = (payload.get("email") or "").strip().lower()
		phone = (payload.get("phone") or payload.get("mobile") or "").strip()

		if not full_name:
			frappe.throw(frappe._("Full Name is required."))

		if not email or not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
			frappe.throw(frappe._("A valid Email Address is required."))

		clean_phone = re.sub(r"[^0-9+]", "", phone)
		if not clean_phone or (
			len(clean_phone) != 10 and not (clean_phone.startswith("+91") and len(clean_phone) == 13)
		):
			frappe.throw(frappe._("A valid 10-digit Mobile Number is required."))

		profile = (payload.get("profile") or "Moderately Aggressive").strip()
		score = int(payload.get("score") or 18)
		max_score = int(payload.get("max_score") or 25)
		metrics = payload.get("metrics") or {}
		answers = payload.get("answers") or []

		# Partition names
		first_name = full_name
		last_name = ""
		if " " in full_name:
			parts = full_name.split(" ", 1)
			first_name = parts[0].strip()
			last_name = parts[1].strip()

		# Build summary context for CRM lead
		answers_summary_lines = [
			f"Investor Risk Profile: {profile}",
			f"Score: {score}/{max_score}",
			f"Diagnostics: Comfort={metrics.get('riskComfort', 'N/A')}, Flexibility={metrics.get('financialFlexibility', 'N/A')}, Horizon={metrics.get('horizon', 'N/A')}, Experience={metrics.get('experience', 'N/A')}",
		]
		if isinstance(answers, list) and answers:
			answers_summary_lines.append("\nAnswers:")
			for ans in answers:
				if isinstance(ans, dict):
					q_title = ans.get("questionTitle") or f"Question {ans.get('questionId')}"
					a_text = ans.get("selectedOptionText") or f"Score {ans.get('score')}"
					answers_summary_lines.append(f"- {q_title}: {a_text}")

		lead_context = "\n".join(answers_summary_lines)

		# 3. Create or Update CRM Lead
		created_lead_name = None
		try:
			# Determine source
			source = "Website Form"
			if frappe.db.exists("CRM Lead Source", "Investor Risk Profiler"):
				source = "Investor Risk Profiler"
			else:
				try:
					src_doc = frappe.get_doc({
						"doctype": "CRM Lead Source",
						"source_name": "Investor Risk Profiler",
					})
					src_doc.insert(ignore_permissions=True)
					frappe.db.commit()
					source = "Investor Risk Profiler"
				except Exception:
					source = "Website Form"

			existing_leads = frappe.get_all(
				"CRM Lead",
				filters={"email": email},
				fields=["name"],
				limit=1,
			)

			if existing_leads:
				lead_doc = frappe.get_doc("CRM Lead", existing_leads[0].name)
				lead_doc.first_name = first_name
				lead_doc.last_name = last_name
				lead_doc.lead_name = full_name
				lead_doc.mobile_no = clean_phone
				lead_doc.phone = clean_phone
				lead_doc.source = source
				if frappe.db.has_column("CRM Lead", "chat_summary"):
					lead_doc.chat_summary = lead_context
				if frappe.db.has_column("CRM Lead", "custom_chat_context"):
					lead_doc.custom_chat_context = lead_context
				lead_doc.save(ignore_permissions=True)
				frappe.db.commit()
				created_lead_name = lead_doc.name
			else:
				doc_data = {
					"doctype": "CRM Lead",
					"first_name": first_name,
					"last_name": last_name,
					"lead_name": full_name,
					"email": email,
					"mobile_no": clean_phone,
					"phone": clean_phone,
					"source": source,
				}
				if frappe.db.has_column("CRM Lead", "chat_summary"):
					doc_data["chat_summary"] = lead_context
				if frappe.db.has_column("CRM Lead", "custom_chat_context"):
					doc_data["custom_chat_context"] = lead_context

				lead = frappe.get_doc(doc_data)
				lead.insert(ignore_permissions=True)
				frappe.db.commit()
				created_lead_name = lead.name
		except Exception as lead_err:
			frappe.log_error(title="CRM Lead Save Failed in Risk Profiler", message=str(lead_err))

		# 4. Send Brevo SMTP Email to the User using Dhanada Settings
		email_sent = False
		try:
			html_body = generate_risk_email_html(full_name, profile, score, max_score, metrics)
			email_subject = f"Your Investor Risk Profile: {profile} | KNAPS Financial Services"
			send_brevo_smtp_email(email, email_subject, html_body)
			email_sent = True
		except Exception as mail_err:
			frappe.log_error(
				title="Brevo Email Dispatch Failed",
				message=f"Error sending to {email}: {mail_err!s}\n{frappe.get_traceback()}",
			)

		# 5. Send Admin Notification using Dhanada Settings
		try:
			send_admin_alert(
				full_name,
				email,
				clean_phone,
				profile,
				score,
				max_score,
				metrics,
				lead_context,
			)
		except Exception:
			pass

		if not email_sent:
			return {
				"success": True,
				"lead_name": created_lead_name,
				"warning": "Lead saved, but email could not be delivered. Please verify Brevo credentials in Dhanada Settings.",
			}

		return {
			"success": True,
			"lead_name": created_lead_name,
			"profile": profile,
			"score": score,
			"message": f"Risk profile email successfully sent to {email}",
		}

	except Exception as e:
		frappe.log_error(message=frappe.get_traceback(), title="Risk Profiler Submission Failed")
		frappe.local.response["http_status_code"] = 400
		return {"success": False, "message": str(e)}
