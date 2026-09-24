"""
Public Whitelisted API Entrypoint for Dhanada App.
Re-exports modularized APIs from dhanada.APIs for complete backward compatibility.
"""

# Chatbot ke user question ka response generate karta hai.
# Chatbot configuration return karta hai.
from dhanada.APIs.chatbot import chatbot_response, get_chatbot_config

# Selected funds ka comparison data laata hai.
from dhanada.APIs.comparison import get_comparison_data

# Chatbot conversation message persistence.
# Chatbot conversation context updater.
# Chatbot conversation lead association.
from dhanada.APIs.conversation import (
	associate_lead_to_conversation,
	save_chat_message,
	update_chatbot_context,
)

# Heatmap ke liye available scheme types aur categories laata hai.
# Heatmap UI component ke liye grouped schemes aur monthly returns laata hai.
# Heatmap ke liye monthly return data laata hai.
from dhanada.APIs.heatMap import get_heatmap_data, get_heatmap_filters, get_scheme_heatmap_performance

# Regular plans me se primary default plan (Growth) select karta hai.
# SIF code ke basis par directly performance metrics laata hai.
# Insufficient history wale returns ko None karta hai taaki galat data na dikhe.
from dhanada.APIs.helpers import get_default_plan, get_performance_for_sif, mask_invalid_returns

# Chatbot se aayi lead ko save karta hai.
# Website form se aayi lead ko save karta hai.
from dhanada.APIs.leads import create_chatbot_lead, create_website_lead

# Investor Risk Profiler se aayi lead save karta hai aur Brevo se personalized email bhejta hai.
from dhanada.APIs.risk_profiler import submit_risk_profile


# Ek specific SIF ki complete required details laata hai.
# Fund selector ke liye minimal funds list (id, name, category, risk) laata hai.
# SIF page ke liye required funds ka paginated data laata hai.
# SIF ka historical NAV data laata hai.
# SIF code ke liye database se historical NAV time-series data laata hai.
from dhanada.APIs.scheme_details import (
	get_fund_details,
	get_funds_list,
	get_funds_selector_list,
	get_historical_nav,
	get_historical_nav_for_sif,
)

__all__ = [
	"associate_lead_to_conversation",
	"chatbot_response",
	"create_chatbot_lead",
	"create_website_lead",
	"get_chatbot_config",
	"get_comparison_data",
	"get_default_plan",
	"get_fund_details",
	"get_funds_list",
	"get_funds_selector_list",
	"get_heatmap_data",
	"get_heatmap_filters",
	"get_historical_nav",
	"get_historical_nav_for_sif",
	"get_performance_for_sif",
	"get_scheme_heatmap_performance",
	"mask_invalid_returns",
	"save_chat_message",
	"submit_risk_profile",
	"update_chatbot_context",
]
