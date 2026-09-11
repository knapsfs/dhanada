import * as knowledgeService from "./knowledgeService.js";
import * as leadManager from "./leadManager.js";

let cachedCsrfToken = null;

async function getCsrfToken() {
	if (cachedCsrfToken !== null) return cachedCsrfToken;

	// First check if it's injected in the window (e.g. Frappe Web Pages)
	if (typeof window !== "undefined" && window.frappe && window.frappe.csrf_token) {
		cachedCsrfToken = window.frappe.csrf_token;
		return cachedCsrfToken;
	}

	// Fallback for decoupled Vite app: fetch from our config endpoint
	try {
		const res = await fetch("/api/method/dhanada.api.get_chatbot_config");
		if (res.ok) {
			const data = await res.json();
			cachedCsrfToken = data.message?.csrf_token || "";
		} else {
			cachedCsrfToken = "";
		}
	} catch (e) {
		console.warn("Failed to fetch CSRF token", e);
		cachedCsrfToken = "";
	}
	return cachedCsrfToken;
}

async function generateContentWithFallback(params) {
	const csrfToken = await getCsrfToken();

	const response = await fetch("/api/method/dhanada.api.chatbot_response", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Frappe-CSRF-Token": csrfToken,
		},
		body: JSON.stringify({
			conversation_history: params.contents,
			system_instruction: params.systemInstruction,
			is_json: params.isJson || false,
		}),
	});

	if (!response.ok) {
		throw new Error("Failed to reach Frappe API");
	}

	const data = await response.json();

	if (data.message && data.message.success) {
		if (params.isJson) {
			try {
				// The backend returns a raw JSON string from Gemini
				const parsed = JSON.parse(data.message.message);
				return {
					text: parsed.message || "",
					suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
					leadOpportunity: parsed.leadOpportunity || {
						isAppropriateNow: false,
						offerMessage: null,
					},
					contextSummary: parsed.contextSummary || "",
				};
			} catch (e) {
				console.warn("Failed to parse Gemini JSON:", e);
				return {
					text: data.message.message,
					suggestions: [],
					leadOpportunity: { isAppropriateNow: false, offerMessage: null },
					contextSummary: "",
				};
			}
		}
		return { text: data.message.message };
	} else {
		throw new Error(data.message?.message || "Gemini processing failed on server");
	}
}

async function analyzeContextForSuggestionsAndLeads(state, latestBotReply) {
	try {
		const systemInstruction = `You are an AI assistant evaluating the current conversational context. 
Your task is to generate highly relevant quick-reply suggestions for the user, evaluate if this is an appropriate time to offer an advisor connection, and provide a concise 1-sentence factual summary synthesizing the user's overall actual intent across the entire conversation.

Respond in valid JSON format ONLY, exactly matching this schema:
{
  "suggestions": ["suggestion 1", "suggestion 2"],
  "leadOpportunity": {
    "isAppropriateNow": boolean,
    "offerMessage": "string or null"
  },
  "contextSummary": "concise 1-sentence summary expressing the user's actual intent"
}

Rules for contextSummary:
1. Provide a fresh, concise 1-2 sentence summary strictly describing the USER'S current overall meaningful intent, questions, goals, preferences, amounts, and investment requirements synthesized across the complete conversation.
2. Filter out and NEVER include lead-capture / advisor workflow messages or personal contact data in the summary (e.g., "Connect with an advisor", names, mobile numbers, email addresses, "Skip", share preferences). If the user's name is known, use it naturally as the subject (e.g. "Satyam Raj wants to..."), but do not make lead-capture or contact information the subject or content of the summary.
3. Combine separate meaningful intents across the conversation into a single, cohesive, natural summary (e.g., if user asks about differences between SIF, MF, AIF and also wants to invest ₹30,00,000 in SIF, summarize: "Satyam Raj wants to understand the differences between Specialized Investment Funds (SIF), Mutual Funds (MF), and Alternative Investment Funds (AIF) and wants to invest ₹30,00,000 in SIF.").
4. Do NOT concatenate raw user messages; formulate proper grammatical sentences expressing what the USER wants/needs/asked.
5. Preserve key user-provided numbers/amounts formatted in Indian currency style (e.g., ₹30,00,000, ₹4 crore, ₹20 Lakhs) and link them to their investment targets.
6. Preserve all specific entities and topics explicitly mentioned (e.g., SIF, Mutual Funds/MF, AIF, SIP, PMS, Equity). Do not omit any explicitly mentioned entities.
7. Ignore trivial greetings and filler when meaningful intent is present. If the entire conversation consists only of greetings/filler, keep the summary minimal: "User greeted the assistant."
8. Summarize the USER'S intent, NOT what the assistant replied or explained.
9. NEVER invent information the user never mentioned.
10. NEVER include the word "Dhanada" in the summary.

Rules for suggestions:
1. Suggestions MUST directly correspond to the assistant's immediately preceding response.
2. If the assistant asked a question, suggestions MUST be realistic answers to it.
3. Keep suggestions concise, unique, and actionable. Generate 1 to 4 options (do not pad to 4). If no natural replies exist, return [].

Rules for leadOpportunity:
1. Do NOT use the presence of a financial amount (e.g., ₹, lakhs, crores) as a reason to offer an advisor.
2. Set isAppropriateNow = true ONLY IF the CURRENT conversation context naturally creates a useful opportunity for personalized advisory assistance (e.g., portfolio construction, asset allocation, retirement planning, tax planning, wealth preservation, choosing between multiple options).
3. Set isAppropriateNow = false if the user is asking simple factual questions (like NAV, SIP definition, etc.) or just continuing conversation.
4. Evaluate ONLY the LATEST intent/question. Do NOT reuse an old reason or previous context to justify a new offer. The offer MUST feel natural and relevant to what the user is discussing RIGHT NOW.
5. If true, provide a unique contextual offerMessage. Do not reuse generic boilerplate.`;

		const contents = state.history.map((msg) => ({
			role: msg.role === "user" ? "user" : "model",
			parts: [{ text: msg.text }],
		}));

		contents.push({
			role: "model",
			parts: [{ text: latestBotReply }],
		});

		const response = await generateContentWithFallback({
			systemInstruction,
			contents,
			isJson: true,
		});

		if (
			response.contextSummary &&
			typeof response.contextSummary === "string" &&
			response.contextSummary.trim()
		) {
			state.aiContextSummary = response.contextSummary.trim();
		}

		return {
			suggestions: response.suggestions || [],
			leadOpportunity: response.leadOpportunity || {
				isAppropriateNow: false,
				offerMessage: null,
			},
		};
	} catch (e) {
		console.warn("Failed to generate dynamic suggestions/lead", e);
		return {
			suggestions: [],
			leadOpportunity: { isAppropriateNow: false, offerMessage: null },
		};
	}
}

const LEAD_STEPS = {
	NONE: "none",
	PENDING_OFFER: "pending_offer",
	CHOOSE_SHARE: "choose_share",
	PHONE_ONLY: "phone_only",
	EMAIL_ONLY: "email_only",
	ASK_OPTIONAL_EMAIL: "ask_optional_email",
	ASK_OPTIONAL_PHONE: "ask_optional_phone",
	PHONE_THEN_EMAIL_MODE_1: "phone_then_email_mode_1",
	PHONE_THEN_EMAIL_MODE_2: "phone_then_email_mode_2",
	NAME: "name",
	DONE: "done",
};

export function isGreeting(message) {
	const clean = normalizeText(message)
		.replace(/[^a-z0-9\s]+/g, " ")
		.trim();
	if (!clean) return false;
	const greetingRegex =
		/^(h+i+|h+e+y+|h+e+l+l+o+|h+e+y+a+|howdy|hola|namaste|greetings|good\s+(morning|afternoon|evening|day))$/i;
	return greetingRegex.test(clean);
}

const GREETINGS = [
	"hi",
	"hello",
	"hey",
	"good morning",
	"good evening",
	"good afternoon",
	"namaste",
];
const THANKS = ["thanks", "thank you", "thx", "appreciate it"];
const AFFIRMATIVE = [
	"yes",
	"yeah",
	"sure",
	"okay",
	"ok",
	"please do",
	"go ahead",
	"sounds good",
	"yes please",
	"connect with an advisor",
];
const NEGATIVE = [
	"no",
	"not now",
	"no thanks",
	"maybe later",
	"not interested",
	"continue chatting",
];

const TOPIC_PATTERNS = [
	{
		type: "recommendation",
		patterns: ["recommend", "suggest", "best fund", "which fund", "where should i invest"],
	},
	{ type: "comparison", patterns: ["compare", "vs", "difference between", "better"] },
	{ type: "nav", patterns: ["nav", "net asset value"] },
	{ type: "performance", patterns: ["performance", "return", "returns", "cagr"] },
	{ type: "marketNews", patterns: ["market news", "market update", "market today", "news"] },
	{ type: "fundDetails", patterns: ["fund details", "scheme details"] },
	{ type: "amc", patterns: ["amc", "fund house", "asset management company"] },
	{ type: "risk", patterns: ["risk", "risky", "riskometer", "volatility"] },
	{
		type: "category",
		patterns: [
			"category",
			"categories",
			"large cap",
			"flexi cap",
			"hybrid",
			"debt fund",
			"elss",
		],
	},
	{
		type: "sif",
		patterns: ["sif", "specialised investment fund", "specialized investment fund"],
	},
	{ type: "sip", patterns: ["sip", "systematic investment"] },
	{ type: "lumpsum", patterns: ["lumpsum", "lump sum", "one time investment"] },
	{ type: "taxation", patterns: ["tax", "taxation", "capital gains"] },
	{ type: "assetAllocation", patterns: ["asset allocation", "allocation"] },
	{ type: "portfolio", patterns: ["portfolio", "holdings"] },
	{ type: "exitLoad", patterns: ["exit load"] },
	{ type: "expenseRatio", patterns: ["expense ratio", "fund fee"] },
	{ type: "kyc", patterns: ["kyc", "know your customer"] },
	{ type: "distributors", patterns: ["distributor", "advisor near me", "agent near me"] },
	{
		type: "dhanadaServices",
		patterns: ["dhanada", "your services", "what do you offer", "services"],
	},
	{ type: "mutualFunds", patterns: ["mutual fund", "mutual funds"] },
	{
		type: "advisorRequest",
		patterns: ["call me", "contact me", "advisor", "reach out", "connect me"],
	},
];

const CONTEXTUAL_QUICK_REPLIES = {
	mutualFunds: [
		"How do mutual funds work?",
		"What are the different types?",
		"What are the risks?",
		"How do I start investing?",
	],
	sip: [
		"How does SIP work?",
		"SIP vs lump sum",
		"What SIP amount should I choose?",
		"Calculate SIP returns",
	],
	lumpsum: [
		"SIP vs lump sum",
		"How should I invest a lump sum?",
		"What are the risks?",
		"Calculate expected returns",
	],
	fundDetails: [
		"Show fund details",
		"Compare with another fund",
		"Show latest NAV",
		"What are the risks?",
	],
	nav: ["What is NAV?", "Show latest NAV", "How is NAV calculated?", "Compare fund performance"],
	taxation: [
		"How is mutual fund taxation calculated?",
		"What is LTCG?",
		"What is STCG?",
		"Show a tax example",
	],
	risk: [
		"Explain low-risk options",
		"Explain moderate-risk options",
		"Explain high-risk options",
		"How should I choose my risk level?",
	],
	recommendation: [
		"Help me choose an investment",
		"SIP or lump sum?",
		"What investment horizon should I choose?",
		"How should I diversify?",
	],
};

const DEFAULT_QUICK_REPLIES = [
	"Help me choose an investment",
	"Explain SIP vs lumpsum",
	"Compare two funds",
	"What is NAV?",
];

function normalizeText(value) {
	return String(value || "")
		.toLowerCase()
		.trim();
}

function matchesShortReply(text, phrases) {
	const cleanText = text.replace(/[^a-z0-9]+/g, " ").trim();
	return phrases.some((phrase) => cleanText === phrase);
}

function extractProfile(state, message) {
	const userContext = state.history
		.filter((msg) => msg.role === "user")
		.map((msg) => msg.text)
		.join(" ");
	const text = normalizeText(`${userContext} ${message}`);
	const profile = { ...state.profile };

	if (text.includes("retirement")) profile.goal = "retirement";
	if (text.includes("education")) profile.goal = "education";
	if (text.includes("tax")) profile.goal = "tax saving";
	if (text.includes("wealth")) profile.goal = "wealth creation";
	if (text.includes("house")) profile.goal = "house purchase";

	if (text.includes("conservative") || text.includes("low risk")) profile.risk = "conservative";
	if (text.includes("moderate") || text.includes("balanced")) profile.risk = "moderate";
	if (text.includes("aggressive") || text.includes("high risk")) profile.risk = "aggressive";

	if (text.includes("sip")) profile.mode = "sip";
	if (text.includes("lumpsum") || text.includes("lump sum")) profile.mode = "lumpsum";

	const yearsMatch = text.match(/(\d+)\s*(year|years|yr|yrs)/);
	if (yearsMatch) {
		profile.horizonYears = Number(yearsMatch[1]);
	}

	const hasAmountCue =
		/(?:rs\.?|inr|₹|crore|crores|cr|lakh|lakhs|thousand|k|amount|invest|investment|monthly|month|bank|balance|have|got)/i.test(
			text
		);
	const amountMatch = text.match(
		/(?:rs\.?|inr|₹)?\s*([0-9]+(?:\.[0-9]+)?)\s*(crore|crores|cr|lakh|lakhs|k|thousand)?/i
	);
	if (hasAmountCue && amountMatch) {
		const base = Number(amountMatch[1]);
		const unit = (amountMatch[2] || "").toLowerCase();

		if (unit.startsWith("cr")) profile.amount = base * 10000000;
		else if (unit.startsWith("lakh")) profile.amount = base * 100000;
		else if (unit.startsWith("k") || unit.startsWith("thous")) profile.amount = base * 1000;
		else if (base >= 500) profile.amount = base;
	}

	state.profile = profile;
}

function formatComparison(result) {
	const [first, second] = result.funds;

	return [
		`${first.name} vs ${second.name}:`,
		`Category: ${first.category} vs ${second.category}`,
		`Risk: ${first.risk} vs ${second.risk}`,
		`Expense ratio: ${first.expenseRatio} vs ${second.expenseRatio}`,
		`1Y return: ${first.performance.oneYear} vs ${second.performance.oneYear}`,
		`Exit load: ${first.exitLoad} vs ${second.exitLoad}`,
		result.summary,
	].join("\n");
}

function formatRecommendation(result, profile) {
	const profileLineParts = [];

	if (profile.goal) profileLineParts.push(`goal: ${profile.goal}`);
	if (profile.risk) profileLineParts.push(`risk: ${profile.risk}`);
	if (profile.horizonYears) profileLineParts.push(`horizon: ${profile.horizonYears} years`);
	if (profile.mode) profileLineParts.push(`mode: ${profile.mode}`);

	const heading = profileLineParts.length
		? `Based on your ${profileLineParts.join(", ")}, here is a good starting point:`
		: "Here is a good sample starting point:";

	const fundLines = result.suggestions
		.map(
			(fund) =>
				`• ${fund.name} - ${fund.category}, ${
					fund.risk
				} risk, suitable for ${fund.suitableFor.toLowerCase()}`
		)
		.join("\n");

	const rationale = result.rationale.map((item) => `• ${item}`).join("\n");

	return [heading, fundLines, "", rationale, "", result.summary].join("\n");
}

function chooseOffer(state) {
	return null;
}

function getQuickReplies(state) {
	if (state.leadStep === LEAD_STEPS.PENDING_OFFER) {
		return ["Connect with an advisor", "Continue chatting"];
	}

	if (state.leadStep === LEAD_STEPS.CHOOSE_SHARE) {
		return ["📱 Mobile Number", "✉️ Email Address", "📱+✉️ Both"];
	}

	if (
		state.leadStep === LEAD_STEPS.ASK_OPTIONAL_EMAIL ||
		state.leadStep === LEAD_STEPS.ASK_OPTIONAL_PHONE
	) {
		return ["Yes", "Skip"];
	}

	if (
		state.leadStep === LEAD_STEPS.NAME ||
		state.leadStep === LEAD_STEPS.PHONE_ONLY ||
		state.leadStep === LEAD_STEPS.EMAIL_ONLY ||
		state.leadStep === LEAD_STEPS.PHONE_THEN_EMAIL_MODE_1 ||
		state.leadStep === LEAD_STEPS.PHONE_THEN_EMAIL_MODE_2
	) {
		return [];
	}

	if (state.awaitingRecommendationDetails) {
		return ["Moderate risk", "5 year horizon", "Monthly SIP"];
	}

	let contextTopic = state.currentTopic;

	if (!contextTopic && state.history && state.history.length > 0) {
		const lastBotMessage = state.history[state.history.length - 1];
		if (lastBotMessage && lastBotMessage.role === "bot") {
			const text = lastBotMessage.text.toLowerCase();
			if (text.includes("mutual fund") || text.includes("mutual funds"))
				contextTopic = "mutualFunds";
			else if (text.includes("sip") || text.includes("systematic investment"))
				contextTopic = "sip";
			else if (text.includes("lump sum") || text.includes("lumpsum"))
				contextTopic = "lumpsum";
			else if (
				text.includes("tax") ||
				text.includes("stcg") ||
				text.includes("ltcg") ||
				text.includes("capital gains")
			)
				contextTopic = "taxation";
			else if (text.includes("nav") || text.includes("net asset value"))
				contextTopic = "nav";
			else if (
				text.includes("risk") ||
				text.includes("riskometer") ||
				text.includes("volatility")
			)
				contextTopic = "risk";
		}
	}

	if (contextTopic && CONTEXTUAL_QUICK_REPLIES[contextTopic]) {
		return CONTEXTUAL_QUICK_REPLIES[contextTopic];
	}

	if (state.currentTopic === "comparison") {
		return ["Compare Horizon vs Cedar", "Compare Zenith vs Prism", "Show sample NAV"];
	}

	return DEFAULT_QUICK_REPLIES;
}

class SessionStore {
	constructor() {
		this.sessions = new Map();
	}

	get(sessionId) {
		if (!this.sessions.has(sessionId)) {
			this.sessions.set(sessionId, {
				history: [],
				turnCount: 0,
				currentTopic: null,
				helpfulTurns: 0,
				advisorOffered: false,
				advisorDeclined: false,
				lastOfferTurn: 0,
				leadStep: LEAD_STEPS.NONE,
				pendingOffer: false,
				leadCaptured: false,
				crmLeadName: null,
				collected: {
					name: null,
					phone: null,
					email: null,
				},
				profile: {
					goal: null,
					risk: null,
					horizonYears: null,
					amount: null,
					mode: null,
				},
				awaitingRecommendationDetails: false,
				aiContextSummary: null,
			});
		}

		return this.sessions.get(sessionId);
	}
}

function formatTopicName(topic) {
	if (!topic) return "mutual funds";
	return topic.replace(/([A-Z])/g, " $1").toLowerCase();
}

function formatFinancialEntity(raw) {
	if (!raw) return "";
	const trimmed = raw
		.trim()
		.replace(/^(?:the|an|a)\s+/i, "")
		.replace(/[?.!]+$/, "")
		.trim();
	const lower = trimmed.toLowerCase();
	if (
		lower === "sif" ||
		lower === "sifs" ||
		lower === "specialized investment fund" ||
		lower === "specialized investment funds"
	) {
		return "Specialized Investment Funds (SIF)";
	}
	if (lower === "mf" || lower === "mfs" || lower === "mutual fund" || lower === "mutual funds") {
		return "Mutual Funds (MF)";
	}
	if (
		lower === "aif" ||
		lower === "aifs" ||
		lower === "alternative investment fund" ||
		lower === "alternative investment funds"
	) {
		return "Alternative Investment Funds (AIF)";
	}
	if (
		lower === "sip" ||
		lower === "sips" ||
		lower === "systematic investment plan" ||
		lower === "systematic investment plans"
	) {
		return "Systematic Investment Plans (SIP)";
	}
	if (lower === "pms" || lower === "portfolio management services") {
		return "Portfolio Management Services (PMS)";
	}
	if (
		lower === "fd" ||
		lower === "fds" ||
		lower === "fixed deposit" ||
		lower === "fixed deposits"
	) {
		return "Fixed Deposits (FD)";
	}
	if (lower === "etf" || lower === "etfs") {
		return "Exchange Traded Funds (ETF)";
	}
	if (lower === "lumpsum" || lower === "lump sum") {
		return "Lumpsum investing";
	}
	if (lower.length <= 4) {
		return trimmed.toUpperCase();
	}
	return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

export function isLeadCaptureOrTrivialMessage(msg, state = {}) {
	if (!msg || typeof msg !== "string") return true;
	const text = msg.trim();
	const lower = text.toLowerCase();

	// Greetings
	if (isGreeting(text)) return true;

	// Acknowledgements and short affirmative/negative replies
	if (
		matchesShortReply(lower, AFFIRMATIVE) ||
		matchesShortReply(lower, NEGATIVE) ||
		matchesShortReply(lower, THANKS)
	) {
		return true;
	}

	// Lead flow options & commands
	if (
		/^(connect with an advisor|talk to advisor|speak to advisor|advisor|connect with advisor|yes please|no thanks)$/i.test(
			lower
		)
	) {
		return true;
	}
	if (
		/^(?:📱|✉️|\s)*(mobile number|phone number|phone|email|email address|both|phone only|email only|phone then email)$/i.test(
			lower
		)
	) {
		return true;
	}
	if (/^(skip|cancel|later|stop|exit|done)$/i.test(lower)) {
		return true;
	}

	// Phone number pattern
	const digitsOnly = text.replace(/[\s-+()]/g, "");
	if (/^\d{7,15}$/.test(digitsOnly)) {
		return true;
	}

	// Email pattern
	if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
		return true;
	}

	// If it matches collected name or contact info
	if (state.collected?.name && lower === state.collected.name.toLowerCase().trim()) {
		return true;
	}
	if (state.collected?.phone && digitsOnly === state.collected.phone.replace(/[\s-+()]/g, "")) {
		return true;
	}
	if (state.collected?.email && lower === state.collected.email.toLowerCase().trim()) {
		return true;
	}

	return false;
}

function extractAmountFromText(text) {
	if (!text) return "";
	const lower = text.toLowerCase();
	const croreMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)/i);
	const lakhMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lakhs)/i);
	const thousandMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:k|thousand|thousands)/i);
	const rawNumberMatch = lower.match(/(?:₹|rs\.?|inr)?\s*([1-9][0-9]{4,})/);

	if (croreMatch) return `₹${croreMatch[1]} crore`;
	if (lakhMatch) return `₹${lakhMatch[1]} Lakhs`;
	if (thousandMatch) return `₹${thousandMatch[1]} Thousand`;
	if (rawNumberMatch) {
		const num = Number(rawNumberMatch[1]);
		return `₹${num.toLocaleString("en-IN")}`;
	}
	return "";
}

function extractVehiclesFromText(text) {
	if (!text) return [];
	const lower = text.toLowerCase();
	const detected = [];
	if (/\bsifs?\b/i.test(lower) || /\bspecialized investment funds?\b/i.test(lower)) {
		detected.push("SIF");
	}
	if (/\bmfs?\b/i.test(lower) || /\bmutual\s*funds?\b/i.test(lower)) {
		detected.push("Mutual Funds");
	}
	if (/\baifs?\b/i.test(lower) || /\balternative investment funds?\b/i.test(lower)) {
		detected.push("AIF");
	}
	if (/\bsips?\b/i.test(lower) || /\bsystematic investment plans?\b/i.test(lower)) {
		detected.push("SIP");
	}
	if (/\bpms\b/i.test(lower) || /\bportfolio management\b/i.test(lower)) {
		detected.push("PMS");
	}
	if (/\bfds?\b/i.test(lower) || /\bfixed deposits?\b/i.test(lower)) {
		detected.push("Fixed Deposits");
	}
	return detected;
}

export function generateChatSummary(state) {
	const name = state.collected?.name || "User";

	// 1. If AI generated a context summary based on actual conversation, use it
	if (
		state.aiContextSummary &&
		typeof state.aiContextSummary === "string" &&
		state.aiContextSummary.trim()
	) {
		let summary = state.aiContextSummary.trim();
		summary = summary.replace(/dhanada/gi, "Investment");
		return summary;
	}

	// 2. Extract all user messages in chronological order
	const rawUserMessages = (state.history || [])
		.filter((msg) => msg.role === "user" || msg.role === "user_message")
		.map((msg) => (typeof msg.text === "string" ? msg.text : msg.message || "").trim())
		.filter(Boolean);

	if (rawUserMessages.length === 0) {
		return `${name} initiated a chat session.`;
	}

	// 3. Filter out lead-capture, greetings, and trivial messages
	const meaningfulMessages = rawUserMessages.filter(
		(msg) => !isLeadCaptureOrTrivialMessage(msg, state)
	);

	// If no meaningful messages remain, it was a greeting / trivial session
	if (meaningfulMessages.length === 0) {
		return `${name} greeted the assistant.`;
	}

	const combinedMeaningful = meaningfulMessages.join(" ");
	const lowerCombined = combinedMeaningful.toLowerCase();

	// Check if user asked about assistant identity
	if (
		/\b(who are you|what are you|who r u|what is your name|tell me about yourself|introduce yourself)\b/i.test(
			lowerCombined
		)
	) {
		return `${name} wants to know who the assistant is.`;
	}

	// 4. Extract distinct semantic intents from meaningful user messages
	const intents = [];

	// Intent A: Comparison / Difference questions
	for (const msg of meaningfulMessages) {
		const compMatch = msg.match(
			/\b(?:difference between|compare|comparison between|comparison of|versus|diff between)\s+([^?.!]+)/i
		);
		if (compMatch) {
			const rawEntitiesStr = compMatch[1].trim();
			const rawParts = rawEntitiesStr
				.split(/(?:,\s*|\s+(?:and|&|vs\.?|versus|or)\s+)/i)
				.map((p) => p.trim())
				.filter((p) => p && !/^(?:the|an|a|between|of|in|to)\b/i.test(p));

			const formatted = rawParts.map(formatFinancialEntity);
			let compIntent = "";
			if (formatted.length > 2) {
				const listStr =
					formatted.slice(0, -1).join(", ") + ", and " + formatted[formatted.length - 1];
				compIntent = `wants to understand the differences between ${listStr}`;
			} else if (formatted.length === 2) {
				compIntent = `wants to understand the difference between ${formatted[0]} and ${formatted[1]}`;
			} else if (formatted.length === 1) {
				compIntent = `wants to understand ${formatted[0]}`;
			}
			if (compIntent && !intents.includes(compIntent)) {
				intents.push(compIntent);
			}
		}
	}

	// Intent B: Investment with Amount and/or Vehicle
	let overallAmount = extractAmountFromText(combinedMeaningful);
	if (!overallAmount && state.profile?.amount) {
		overallAmount = `₹${Number(state.profile.amount).toLocaleString("en-IN")}`;
	}

	const overallVehicles = extractVehiclesFromText(combinedMeaningful);
	let overallVehicleText = "";
	if (overallVehicles.length > 2) {
		overallVehicleText =
			overallVehicles.slice(0, -1).join(", ") +
			" and " +
			overallVehicles[overallVehicles.length - 1];
	} else if (overallVehicles.length === 2) {
		overallVehicleText = `${overallVehicles[0]} and ${overallVehicles[1]}`;
	} else if (overallVehicles.length === 1) {
		overallVehicleText = overallVehicles[0];
	}

	for (const msg of meaningfulMessages) {
		const msgAmount = extractAmountFromText(msg) || overallAmount;
		const msgVehicles = extractVehiclesFromText(msg);
		let msgVehicleText = "";
		if (msgVehicles.length > 2) {
			msgVehicleText =
				msgVehicles.slice(0, -1).join(", ") +
				" and " +
				msgVehicles[msgVehicles.length - 1];
		} else if (msgVehicles.length === 2) {
			msgVehicleText = `${msgVehicles[0]} and ${msgVehicles[1]}`;
		} else if (msgVehicles.length === 1) {
			msgVehicleText = msgVehicles[0];
		}

		const hasInvest =
			/\b(invest|investment|allocate|allocation|put|deposit|buy|start|grow|have|bank|portfolio)\b/i.test(
				msg
			);

		if (hasInvest && msgAmount && msgVehicleText) {
			const genericIntent = `wants to invest ${msgAmount}`;
			const genericIdx = intents.indexOf(genericIntent);
			if (genericIdx !== -1) {
				intents.splice(genericIdx, 1);
			}
			const invIntent = `wants to invest ${msgAmount} in ${msgVehicleText}`;
			if (!intents.includes(invIntent)) intents.push(invIntent);
		} else if (hasInvest && msgAmount && !msgVehicleText) {
			const alreadyHasSpecific = intents.some((it) =>
				it.startsWith(`wants to invest ${msgAmount} in`)
			);
			if (!alreadyHasSpecific) {
				const invIntent = `wants to invest ${msgAmount}`;
				if (!intents.includes(invIntent)) intents.push(invIntent);
			}
		} else if (hasInvest && msgVehicleText && !msgAmount && intents.length === 0) {
			const invIntent = `wants to invest in ${msgVehicleText}`;
			if (!intents.includes(invIntent)) intents.push(invIntent);
		}
	}

	// Intent C: General questions like "what is SIF?"
	if (intents.length === 0) {
		for (const msg of meaningfulMessages) {
			const whatIsMatch = msg.match(
				/\b(?:what is|what are|explain|tell me about|meaning of|what does)\s+(?:a|an|the)?\s*([^?.!]+)/i
			);
			if (whatIsMatch) {
				const entity = formatFinancialEntity(whatIsMatch[1]);
				if (entity) {
					intents.push(`wants to understand ${entity}`);
					break;
				}
			}
		}
	}

	// Intent D: Topics (Tax, Retirement, KYC, NAV)
	if (intents.length === 0) {
		if (/\btax\b/i.test(lowerCombined)) {
			intents.push("is exploring tax-saving investments");
		} else if (/\bretirement\b/i.test(lowerCombined)) {
			intents.push("is planning for retirement");
		} else if (/\bkyc\b/i.test(lowerCombined)) {
			intents.push("inquired about KYC requirements");
		} else if (/\b(nav|net asset value)\b/i.test(lowerCombined)) {
			intents.push("inquired about NAV");
		} else if (overallVehicleText) {
			intents.push(
				`is interested in ${
					overallVehicleText === "SIF"
						? "Specialized Investment Funds (SIF)"
						: overallVehicleText
				}`
			);
		}
	}

	// 5. Combine intents into a cohesive natural summary sentence
	let summary = "";
	if (intents.length === 1) {
		summary = `${name} ${intents[0]}.`;
	} else if (intents.length === 2) {
		summary = `${name} ${intents[0]} and ${intents[1]}.`;
	} else if (intents.length > 2) {
		summary = `${name} ${intents.slice(0, -1).join(", ")}, and ${
			intents[intents.length - 1]
		}.`;
	} else {
		const latestSubstantive = meaningfulMessages[meaningfulMessages.length - 1];
		const cleanSnippet = latestSubstantive.replace(/[?.!]+$/, "").trim();
		const snippet =
			cleanSnippet.length > 60 ? cleanSnippet.substring(0, 57) + "..." : cleanSnippet;
		summary = `${name} inquired about "${snippet}".`;
	}

	// Append non-redundant financial profile constraints if present
	const extraDetails = [];
	if (state.profile?.mode && !summary.toLowerCase().includes(state.profile.mode.toLowerCase())) {
		extraDetails.push(`via ${state.profile.mode}`);
	}
	if (state.profile?.horizonYears && !summary.includes(`${state.profile.horizonYears} year`)) {
		extraDetails.push(`for ${state.profile.horizonYears} years`);
	}
	if (state.profile?.goal && !summary.toLowerCase().includes(state.profile.goal.toLowerCase())) {
		extraDetails.push(`for ${state.profile.goal}`);
	}
	if (extraDetails.length > 0) {
		summary += ` (${extraDetails.join(", ")})`;
	}
	if (state.profile?.risk && !summary.toLowerCase().includes(state.profile.risk.toLowerCase())) {
		summary += ` Risk preference: ${state.profile.risk}.`;
	}

	summary = summary.replace(/dhanada/gi, "Investment");
	return summary.trim();
}

export class Chatbot {
	constructor({ sessionStore = new SessionStore() } = {}) {
		this.sessionStore = sessionStore;
		this.sessionQueue = new Map();
	}

	async processMessage(sessionId, message, options = {}) {
		const previousTask = this.sessionQueue.get(sessionId) || Promise.resolve();
		const currentTask = previousTask
			.catch(() => {})
			.then(() => this.processMessageInternal(sessionId, message, options));

		this.sessionQueue.set(sessionId, currentTask);

		try {
			return await currentTask;
		} finally {
			if (this.sessionQueue.get(sessionId) === currentTask) {
				this.sessionQueue.delete(sessionId);
			}
		}
	}

	async processMessageInternal(sessionId, message, options = {}) {
		const state = this.sessionStore.get(sessionId);
		const cleanMessage = String(message || "").trim();

		state.sessionId = sessionId;
		state.aiContextSummary = null; // Reset each turn so fresh AI summary is generated
		if (options.conversationId) {
			state.conversationId = options.conversationId;
		} else if (!state.conversationId && typeof localStorage !== "undefined") {
			state.conversationId = localStorage.getItem("dhanada_conversation_id") || null;
		}

		state.leadEvaluationCooldown =
			state.leadEvaluationCooldown === undefined ? 3 : state.leadEvaluationCooldown;

		// 1. Scan for explicit financial entity
		const explicitEntity = this.extractExplicitEntity(cleanMessage);

		// 2. If found and different from current topic, update current topic
		if (explicitEntity && explicitEntity !== state.currentTopic) {
			state.currentTopic = explicitEntity;
		}

		state.turnCount += 1;
		if (state.leadEvaluationCooldown > 0) {
			state.leadEvaluationCooldown -= 1;
		}

		state.history.push({
			role: "user",
			text: cleanMessage,
			at: new Date().toISOString(),
		});

		const intent = this.detectIntent(cleanMessage);
		const isNewTopic = !["unknown", "affirmative", "negative", "thanks"].includes(intent);

		let reply;

		if (state.leadStep !== LEAD_STEPS.NONE && state.leadStep !== LEAD_STEPS.DONE) {
			if (state.leadStep === LEAD_STEPS.PENDING_OFFER && intent === "negative") {
				state.leadStep = LEAD_STEPS.NONE;
				// Reset so the LLM can naturally offer it again much later, but the conversation history will prevent it from spamming immediately.
				state.advisorOffered = false;
				state.leadEvaluationCooldown = 4;
				reply = "Alright! What else would you like to know about investing?";
			} else if (state.leadStep === LEAD_STEPS.PENDING_OFFER && intent === "affirmative") {
				if (!state.collected.name) {
					state.leadStep = LEAD_STEPS.NAME;
					reply = "Great! To start, what name should I tell our advisor?";
				} else {
					state.leadStep = LEAD_STEPS.CHOOSE_SHARE;
					if (!state.collected.phone && !state.collected.email) {
						reply =
							"Great! To help our advisor connect with you, what would you like to share?";
					} else if (state.collected.phone && !state.collected.email) {
						state.leadStep = LEAD_STEPS.ASK_OPTIONAL_EMAIL;
						reply = `Great! Since we already have your phone number, would you also like to share your email address?`;
					} else if (state.collected.email && !state.collected.phone) {
						state.leadStep = LEAD_STEPS.ASK_OPTIONAL_PHONE;
						reply = `Great! Since we already have your email address, would you also like to share your mobile number?`;
					} else {
						// Should not happen since we don't offer if both are known, but just in case
						reply = await this.saveCompletedLead(state);
					}
				}
			}
		}

		if (state.awaitingRecommendationDetails && isNewTopic) {
			state.awaitingRecommendationDetails = false;
		}

		if (!reply) {
			if (!cleanMessage) {
				reply = "Please type your question and I will help.";
			} else if (state.leadStep !== LEAD_STEPS.NONE && state.leadStep !== LEAD_STEPS.DONE) {
				const isInterruption = this.isLeadInterruption(
					state,
					cleanMessage,
					intent,
					explicitEntity
				);
				if (isInterruption) {
					reply = await this.handleIntent(state, cleanMessage);

					state.leadInterruptionTurns = (state.leadInterruptionTurns || 0) + 1;
					if (
						state.leadInterruptionTurns === 1 ||
						state.leadInterruptionTurns % 3 === 0
					) {
						const reminder = this.getLeadReminder(state);
						if (!reply.includes(reminder)) {
							reply += "\n\n" + reminder;
						}
					}
				} else {
					state.leadInterruptionTurns = 0;
					reply = await this.continueLeadFlow(state, cleanMessage, intent);
				}
			} else if (state.awaitingRecommendationDetails) {
				extractProfile(state, cleanMessage);
				reply = this.handleRecommendation(state);
				if (state.leadCaptured && state.crmLeadName) {
					this.updateLeadSummary(state).catch((e) => console.error(e));
				}
			} else {
				extractProfile(state, cleanMessage);
				reply = await this.handleIntent(state, cleanMessage);
				if (state.leadCaptured && state.crmLeadName) {
					this.updateLeadSummary(state).catch((e) => console.error(e));
				}
			}
		}

		state.history.push({
			role: "bot",
			text: reply,
			at: new Date().toISOString(),
		});

		if (state.history.length > 40) {
			state.history = state.history.slice(-40);
		}

		let quickReplies = [];
		let leadOpportunity = null;

		if (state.leadStep !== LEAD_STEPS.NONE && state.leadStep !== LEAD_STEPS.DONE) {
			quickReplies = getQuickReplies(state);
		} else {
			if (state.latestSuggestions) {
				quickReplies = state.latestSuggestions;
				leadOpportunity = state.latestLeadOpportunity;
				state.latestSuggestions = null;
				state.latestLeadOpportunity = null;
			} else {
				// Local rule-based responses
				const analysis = await analyzeContextForSuggestionsAndLeads(state, reply);
				quickReplies = analysis.suggestions;
				leadOpportunity = analysis.leadOpportunity;
			}

			// If Gemini completely failed to provide suggestions, keep them as []
			if (!Array.isArray(quickReplies)) {
				quickReplies = [];
			}

			// Process proactive lead opportunity
			if (
				!state.advisorOffered &&
				!state.leadCaptured &&
				state.leadEvaluationCooldown <= 0 &&
				leadOpportunity &&
				leadOpportunity.isAppropriateNow &&
				leadOpportunity.offerMessage
			) {
				reply = `${reply}\n\n${leadOpportunity.offerMessage}`;

				// Update history to include the appended offer text
				if (
					state.history.length > 0 &&
					state.history[state.history.length - 1].role === "bot"
				) {
					state.history[state.history.length - 1].text = reply;
				}

				state.advisorOffered = true; // Prevents spamming offers
				state.lastOfferTurn = state.turnCount;
				state.leadStep = LEAD_STEPS.PENDING_OFFER;
				quickReplies = getQuickReplies(state);
			}
		}

		const chatSummary = generateChatSummary(state);

		return {
			reply,
			history: state.history,
			state: this.publicState(state),
			quickReplies: quickReplies,
			summary: chatSummary,
		};
	}

	publicState(state) {
		return {
			helpfulTurns: state.helpfulTurns,
			currentTopic: state.currentTopic,
			leadStep: state.leadStep,
			leadCaptured: state.leadCaptured,
			collected: {
				name: state.collected.name,
				phone: state.collected.phone,
				email: state.collected.email,
			},
			profile: state.profile,
			pendingOffer: state.pendingOffer ? state.pendingOffer.id : null,
			summary: generateChatSummary(state),
		};
	}

	detectIntent(message) {
		const text = normalizeText(message);

		if (isGreeting(text) || matchesShortReply(text, GREETINGS)) return "greeting";
		if (matchesShortReply(text, THANKS)) return "thanks";
		if (matchesShortReply(text, AFFIRMATIVE)) return "affirmative";
		if (matchesShortReply(text, NEGATIVE)) return "negative";

		// Classify user intent before routing
		const words = text.split(/\s+/);
		const isShortQuery = words.length <= 2;
		const isInformational =
			/^(please\s+)?(can you\s+)?(could you\s+)?(just\s+)?(what is|what are|define|explain|tell me about|meaning of|what does|details of|information about|what's)\b/i.test(
				text
			);

		// If it's asking for guidance, recommendations, actions, comparisons, etc., route to Gemini
		if (!isInformational && !isShortQuery) {
			return "unknown";
		}

		// If it's a purely informational definition or a short keyword lookup, use the local knowledge base
		const lowerText = text.toLowerCase();
		for (const item of TOPIC_PATTERNS) {
			for (const pattern of item.patterns) {
				if (pattern.length <= 3) {
					if (new RegExp(`\\b${pattern}\\b`, "i").test(text)) return item.type;
				} else {
					if (lowerText.includes(pattern)) return item.type;
				}
			}
		}

		if (knowledgeService.getFundDetails(message).status === "ok") {
			return "fundDetails";
		}

		return "unknown";
	}

	extractExplicitEntity(text) {
		const skipList = [
			"greeting",
			"thanks",
			"affirmative",
			"negative",
			"advisorRequest",
			"dhanadaServices",
			"recommendation",
			"comparison",
		];
		const lowerText = text.toLowerCase();

		// First, scan existing TOPIC_PATTERNS
		for (const item of TOPIC_PATTERNS) {
			if (skipList.includes(item.type)) continue;

			for (const pattern of item.patterns) {
				if (pattern.length <= 3) {
					if (new RegExp(`\\b${pattern}\\b`, "i").test(text)) return item.type;
				} else {
					if (lowerText.includes(pattern)) return item.type;
				}
			}
		}

		// Scan additional keywords requested by user
		const extraEntities = [
			"fd",
			"fixed deposit",
			"equity",
			"debt",
			"mid cap",
			"small cap",
			"tax saving",
		];
		for (const entity of extraEntities) {
			if (entity.length <= 3) {
				if (new RegExp(`\\b${entity}\\b`, "i").test(text)) return entity;
			} else {
				if (lowerText.includes(entity)) return entity;
			}
		}

		return null;
	}

	isLeadInterruption(state, message, intent, explicitEntity) {
		if (state.leadStep === LEAD_STEPS.NONE || state.leadStep === LEAD_STEPS.DONE) return false;

		// Explicit negatives cancel the flow, they don't interrupt it.
		if (intent === "negative") return false;

		if (explicitEntity) return true;
		if (intent !== "unknown" && intent !== "affirmative" && intent !== "thanks") return true;

		const text = message.toLowerCase().trim();
		if (text.includes("?")) return true;

		const questionWords =
			/^(what|how|why|when|where|who|is|are|can|could|would|should|do|does|did|tell|explain|compare|show|help)\b/i;
		if (questionWords.test(text)) return true;

		// If we are expecting a name, and they type more than 4 words, it's probably not a name.
		if (state.leadStep === LEAD_STEPS.NAME && text.split(/\s+/).length > 4) return true;

		return false;
	}

	getLeadReminder(state) {
		if (state.leadStep === LEAD_STEPS.NAME) {
			return "Whenever you’re ready, I just need your name to continue your advisor request 😊";
		} else if (state.leadStep === LEAD_STEPS.CONTACT_PREF) {
			return "We can continue with your advisor request whenever you’re ready. Just let me know if you prefer a phone call or email.";
		} else if (state.leadStep === LEAD_STEPS.PHONE) {
			return "You had requested a callback earlier. Just share your phone number whenever convenient.";
		} else if (state.leadStep === LEAD_STEPS.EMAIL) {
			return "Just share your email address whenever you’re ready to continue your advisor request.";
		} else if (state.leadStep === LEAD_STEPS.PHONE_THEN_EMAIL) {
			return "You had requested an advisor earlier. Just share your phone number whenever convenient.";
		}
		return "We can continue with your advisor request whenever you’re ready.";
	}

	async handleIntent(state, message) {
		const intent = this.detectIntent(message);

		if (intent !== "unknown") {
			console.log(`[LOCAL] Responding to intent: ${intent}`);
		}

		switch (intent) {
			case "greeting":
				return "Hi! How can I help you today?";

			case "thanks":
				return "Happy to help 😊";

			case "affirmative":
				return "Great! What would you like to explore next?";

			case "negative":
				return "No problem 😊";

			case "recommendation":
				state.currentTopic = "recommendation";
				return this.handleRecommendation(state);

			case "comparison":
				state.currentTopic = "comparison";
				return this.handleComparison(message);

			case "nav":
				state.currentTopic = "nav";
				return this.handleNAV(message);

			case "performance":
				state.currentTopic = "performance";
				return this.handlePerformance(message);

			case "marketNews":
				state.currentTopic = "marketNews";
				return this.handleMarketNews();

			case "fundDetails":
				state.currentTopic = "fundDetails";
				return this.handleFundDetails(message);

			case "amc":
				state.currentTopic = "amc";
				return this.handleAMC(message);

			case "risk":
				state.currentTopic = "risk";
				return this.handleRisk(message);

			case "category":
				state.currentTopic = "category";
				return this.handleCategory(message);

			case "sip":
				state.currentTopic = "sip";
				return this.handleGuide("sip");

			case "lumpsum":
				state.currentTopic = "lumpsum";
				return this.handleGuide("lumpsum");

			case "taxation":
				state.currentTopic = "taxation";
				return this.handleGuide("taxation");

			case "assetAllocation":
				state.currentTopic = "assetAllocation";
				return this.handleGuide("assetAllocation");

			case "portfolio":
				state.currentTopic = "portfolio";
				return this.handleGuide("portfolio");

			case "exitLoad":
				state.currentTopic = "exitLoad";
				return this.handleGuide("exitLoad");

			case "expenseRatio":
				state.currentTopic = "expenseRatio";
				return this.handleGuide("expenseRatio");

			case "kyc":
				state.currentTopic = "kyc";
				return this.handleGuide("kyc");

			case "distributors":
				state.currentTopic = "distributors";
				return this.handleDistributors(message);

			case "dhanadaServices":
				state.currentTopic = "dhanadaServices";
				return this.handleServices();

			case "sif":
				state.currentTopic = "sif";
				return this.handleGuide("sif");

			case "mutualFunds":
				state.currentTopic = "mutualFunds";
				return this.handleGuide("mutualFunds");

			case "advisorRequest":
				state.currentTopic = "dhanadaServices";
				if (!state.collected.name) {
					state.leadStep = LEAD_STEPS.NAME;
					return "I can arrange that. May I know your name?";
				} else if (!state.collected.phone) {
					state.leadStep = LEAD_STEPS.PHONE;
					return `I can arrange that. Could you share your mobile number?`;
				} else if (!state.collected.email) {
					state.leadStep = LEAD_STEPS.EMAIL;
					return `I can arrange that. Could you also share your email address?`;
				} else {
					return "Our advisor will connect with you shortly!";
				}

			default:
				return await this.handleUnknown(state, message);
		}
	}

	handleGuide(key) {
		const guide = knowledgeService.getGuideByKey(key);

		if (!guide) {
			return "I can explain that topic in simple terms if you tell me the exact area.";
		}

		return `${guide.title}: ${guide.summary}`;
	}

	handleFundDetails(message) {
		const result = knowledgeService.getFundDetails(message);

		if (result.status !== "ok") {
			return `${result.message}\nSample schemes: ${result.availableFunds.join(", ")}`;
		}

		const { fund } = result;
		return [
			`${fund.name}:`,
			`Category: ${fund.category}`,
			`AMC: ${fund.amc}`,
			`Risk: ${fund.risk}`,
			`Expense ratio: ${fund.expenseRatio}`,
			`Exit load: ${fund.exitLoad}`,
			`Best fit: ${fund.suitableFor}`,
			result.note,
		].join("\n");
	}

	handleNAV(message) {
		const result = knowledgeService.getNAV(message);

		if (result.status !== "ok") {
			return `${result.message}\nSample schemes: ${result.availableFunds.join(", ")}`;
		}

		return `${result.fundName} has a sample NAV of ${result.nav} as of ${result.asOf}. ${result.note}`;
	}

	handleAMC(message) {
		const result = knowledgeService.getAMC(message);

		if (result.status !== "ok") {
			return `${result.message}\nSample AMCs: ${result.availableAMCs.join(", ")}`;
		}

		return [
			`${result.amc.name}: ${result.amc.summary}`,
			`Strengths: ${result.amc.strengths.join(", ")}`,
		].join("\n");
	}

	handleRisk(message) {
		const result = knowledgeService.getRisk(message);

		if (result.mode === "fund") {
			return result.summary;
		}

		return `A simple risk view:\n${result.bands.map((item) => `• ${item}`).join("\n")}`;
	}

	handleCategory(message) {
		const result = knowledgeService.getCategory(message);

		if (result.category) {
			return `${String(result.category).toUpperCase()}: ${result.summary}`;
		}

		return `${result.summary}\nCommon options: ${result.categories.join(", ")}`;
	}

	handlePerformance(message) {
		const result = knowledgeService.getPerformance(message);

		if (result.status !== "ok") {
			return `${result.message}\nSample schemes: ${result.availableFunds.join(", ")}`;
		}

		return [
			`${result.fundName} sample performance:`,
			`1Y: ${result.performance.oneYear}`,
			`3Y: ${result.performance.threeYear}`,
			`5Y: ${result.performance.fiveYear}`,
			result.note,
		].join("\n");
	}

	handleMarketNews() {
		const result = knowledgeService.getMarketNews();
		const items = result.items.map((item) => `• ${item.headline}: ${item.summary}`).join("\n");
		return `Sample market snapshot as of ${result.asOf}:\n${items}\n${result.note}`;
	}

	handleDistributors(message) {
		const result = knowledgeService.getDistributor(message);
		return `Here are sample advisor options for ${result.city}:\n${result.options
			.map((item) => `• ${item}`)
			.join("\n")}`;
	}

	handleServices() {
		const result = knowledgeService.getPlatformOverview();
		return `${result.summary}\nServices:\n${result.services
			.map((item) => `• ${item}`)
			.join("\n")}`;
	}

	handleComparison(message) {
		const result = knowledgeService.compareFunds(message);

		if (result.status !== "ok") {
			return `${result.message}\nSample schemes: ${result.availableFunds.join(", ")}`;
		}

		return formatComparison(result);
	}

	handleRecommendation(state) {
		const profile = state.profile;

		if (!profile.risk || !profile.horizonYears) {
			state.awaitingRecommendationDetails = true;
			return "I can help with that. Please share your risk level and time horizon, for example: moderate risk, 5 years, SIP.";
		}

		state.awaitingRecommendationDetails = false;
		const result = knowledgeService.getRecommendation(profile);
		return formatRecommendation(result, profile);
	}

	async handleUnknown(state, message) {
		if (state.currentTopic === "recommendation") {
			return "Please share your risk level and horizon so I can make a good suggestion 😊";
		}

		const localFallback = "Till then you can contact to our advisor at +91 9990243143 ";

		try {
			const systemInstruction = `You are Riddhi, a friendly, professional investment assistant.
SIF means Specialized Investment Fund in this application's Indian investment context. Never confuse SIF with SIP. If the user writes SIF, treat it as Specialized Investment Fund unless the user explicitly indicates another meaning.
Answer questions about Mutual Funds, SIP, NAV, Tax, Risk, Asset Allocation, Retirement, Investing, Wealth Creation, Financial Planning, and General Finance.
Default to short, conversational, and concise responses (1-3 short sentences).
Keep responses mobile-friendly. Avoid verbose explanations, long disclaimers, unnecessary introductions, or conclusions.
Do not repeat information already given earlier in the conversation.
Use bullet points only when genuinely helpful.
ONLY provide a longer, detailed response if the user explicitly asks to "Explain in detail", "Tell me more", "Complete comparison", or "Detailed analysis".
NEVER mention AI, Gemini, or that you are a large language model.
NEVER mention the word "Dhanada" in any response or describe the chatbot or website as being related to Dhanada. Keep responses neutral and focused strictly on the user's query.
If the user asks something completely unrelated to finance, politely steer them back.

IMPORTANT: You must respond in valid JSON format exactly matching this schema:
{
  "message": "your conversational response here",
  "suggestions": ["suggestion 1", "suggestion 2"],
  "leadOpportunity": {
    "isAppropriateNow": boolean,
    "offerMessage": "string or null"
  },
  "contextSummary": "concise 1-sentence summary expressing the user's actual intent"
}

Rules for contextSummary:
1. Provide a fresh, concise 1-2 sentence summary strictly describing the USER'S current overall meaningful intent, questions, goals, preferences, amounts, and investment requirements synthesized across the complete conversation.
2. Filter out and NEVER include lead-capture / advisor workflow messages or personal contact data in the summary (e.g., "Connect with an advisor", names, mobile numbers, email addresses, "Skip", share preferences). If the user's name is known, use it naturally as the subject (e.g. "Satyam Raj wants to..."), but do not make lead-capture or contact information the subject or content of the summary.
3. Combine separate meaningful intents across the conversation into a single, cohesive, natural summary (e.g., if user asks about differences between SIF, MF, AIF and also wants to invest ₹30,00,000 in SIF, summarize: "Satyam Raj wants to understand the differences between Specialized Investment Funds (SIF), Mutual Funds (MF), and Alternative Investment Funds (AIF) and wants to invest ₹30,00,000 in SIF.").
4. Do NOT concatenate raw user messages; formulate proper grammatical sentences expressing what the USER wants/needs/asked.
5. Preserve key user-provided numbers/amounts formatted in Indian currency style (e.g., ₹30,00,00,000, ₹4 crore, ₹20 Lakhs) and link them to their investment targets.
6. Preserve all specific entities and topics explicitly mentioned (e.g., SIF, Mutual Funds/MF, AIF, SIP, PMS, Equity). Do not omit any explicitly mentioned entities.
7. Ignore trivial greetings and filler when meaningful intent is present. If the entire conversation consists only of greetings/filler, keep the summary minimal: "User greeted the assistant."
8. Summarize the USER'S intent, NOT what the assistant replied or explained.
9. NEVER invent information the user never mentioned.
10. NEVER include the word "Dhanada" in the summary.

Rules for suggestions:
1. Suggestions MUST directly correspond to your IMMEDIATELY PRECEDING response. 
2. If you ask a question, suggestions MUST be realistic answers to it.
3. Keep suggestions concise, unique, and actionable. Generate 1 to 4 options. If no natural replies exist, return [].

Rules for leadOpportunity:
1. Do NOT use the presence of a financial amount (e.g., ₹, lakhs, crores) as a reason to offer an advisor.
2. Set isAppropriateNow = true ONLY IF the CURRENT conversation context naturally creates a useful opportunity for personalized advisory assistance (e.g., portfolio construction, asset allocation, retirement planning, tax planning, wealth preservation, choosing between multiple options).
3. Set isAppropriateNow = false if the user is asking simple factual questions (like NAV, SIP definition, etc.) or just continuing conversation.
4. Evaluate ONLY the LATEST intent/question. Do NOT reuse an old reason or previous context to justify a new offer. The offer MUST feel natural and relevant to what the user is discussing RIGHT NOW.
5. If true, provide a unique contextual offerMessage. Do not reuse generic boilerplate.`;

			const contents = state.history.map((msg) => ({
				role: msg.role === "user" ? "user" : "model",
				parts: [{ text: msg.text }],
			}));

			const response = await generateContentWithFallback({
				systemInstruction,
				contents,
				isJson: true,
			});

			if (
				response.contextSummary &&
				typeof response.contextSummary === "string" &&
				response.contextSummary.trim()
			) {
				state.aiContextSummary = response.contextSummary.trim();
			}

			state.latestSuggestions = response.suggestions;
			state.latestLeadOpportunity = response.leadOpportunity;
			return response.text || "";
		} catch (error) {
			console.error("[GEMINI ERROR]:", error.message);
			const fallbackReply =
				"I'm facing a lots of requests at this time.... " +
				localFallback +
				"we'll get back to you soon";
			state.latestSuggestions = [];
			state.latestLeadOpportunity = null;
			return fallbackReply;
		}
	}

	async continueLeadFlow(state, message, intent) {
		if (state.leadStep === LEAD_STEPS.CHOOSE_SHARE) {
			const lowerMessage = message.toLowerCase();
			if (lowerMessage.includes("both")) {
				state.leadStep = LEAD_STEPS.PHONE_THEN_EMAIL_MODE_1;
				return "Great! Could you share your mobile number first?";
			} else if (lowerMessage.includes("mail")) {
				state.leadStep = LEAD_STEPS.EMAIL_ONLY;
				return "Great! Could you share your email address?";
			} else {
				state.leadStep = LEAD_STEPS.PHONE_ONLY;
				return "Great! Could you share your mobile number?";
			}
		}

		if (state.leadStep === LEAD_STEPS.NAME) {
			const nameCheck = leadManager.validateName(message);
			if (!nameCheck.valid) {
				return `${nameCheck.message}\nMay I know your name?`;
			}
			state.collected.name = nameCheck.value;
			state.leadStep = LEAD_STEPS.CHOOSE_SHARE;
			return `Nice to meet you, ${state.collected.name}! To help our advisor connect with you, what would you like to share?`;
		}

		if (state.leadStep === LEAD_STEPS.ASK_OPTIONAL_PHONE) {
			if (intent === "negative" || message.toLowerCase().trim() === "skip") {
				return await this.saveCompletedLead(state);
			}
			if (intent === "affirmative") {
				state.leadStep = LEAD_STEPS.PHONE_ONLY;
				return "Great! Please share your 10-digit mobile number.";
			}
		}

		if (state.leadStep === LEAD_STEPS.ASK_OPTIONAL_EMAIL) {
			if (intent === "negative" || message.toLowerCase().trim() === "skip") {
				return await this.saveCompletedLead(state);
			}
			if (intent === "affirmative") {
				state.leadStep = LEAD_STEPS.EMAIL_ONLY;
				return "Great! Please share your email address.";
			}
		}

		if (
			state.leadStep === LEAD_STEPS.PHONE_ONLY ||
			state.leadStep === LEAD_STEPS.PHONE_THEN_EMAIL_MODE_1 ||
			state.leadStep === LEAD_STEPS.PHONE_THEN_EMAIL_MODE_2 ||
			state.leadStep === LEAD_STEPS.ASK_OPTIONAL_PHONE
		) {
			const phoneCheck = leadManager.validatePhone(message);
			if (!phoneCheck.valid) {
				return `${phoneCheck.message}`;
			}
			state.collected.phone = phoneCheck.value;

			if (
				state.leadStep === LEAD_STEPS.PHONE_THEN_EMAIL_MODE_1 ||
				state.leadStep === LEAD_STEPS.PHONE_THEN_EMAIL_MODE_2
			) {
				state.leadStep = LEAD_STEPS.EMAIL_ONLY;
				return "Thank you. Could you also share your email address?";
			}

			if (
				(state.leadStep === LEAD_STEPS.PHONE_ONLY ||
					state.leadStep === LEAD_STEPS.ASK_OPTIONAL_PHONE) &&
				!state.collected.email
			) {
				state.leadStep = LEAD_STEPS.ASK_OPTIONAL_EMAIL;
				return "Thank you. Would you also like to share your email address?";
			}

			return await this.saveCompletedLead(state);
		}

		if (
			state.leadStep === LEAD_STEPS.EMAIL_ONLY ||
			state.leadStep === LEAD_STEPS.ASK_OPTIONAL_EMAIL
		) {
			const emailCheck = leadManager.validateEmail(message);
			if (!emailCheck.valid) {
				return `${emailCheck.message}`;
			}
			state.collected.email = emailCheck.value;

			if (
				(state.leadStep === LEAD_STEPS.EMAIL_ONLY ||
					state.leadStep === LEAD_STEPS.ASK_OPTIONAL_EMAIL) &&
				!state.collected.phone
			) {
				state.leadStep = LEAD_STEPS.ASK_OPTIONAL_PHONE;
				return "Thank you. Would you also like to share your mobile number?";
			}

			return await this.saveCompletedLead(state);
		}

		return await this.saveCompletedLead(state);
	}

	async saveCompletedLead(state) {
		if (!state.collected.phone && !state.collected.email) {
			state.leadStep = LEAD_STEPS.NONE;
			state.advisorOffered = false;
			return "I need either a phone number or an email to connect you with an advisor. Let me know if you change your mind.";
		}

		const chatSummary = generateChatSummary(state);

		const leadData = {
			name: state.collected.name,
			phone: state.collected.phone,
			email: state.collected.email,
			interest: state.currentTopic || "General Inquiry",
			chat_summary: chatSummary,
			source: "Website Chatbot",
			conversation_id:
				state.conversationId ||
				(typeof localStorage !== "undefined"
					? localStorage.getItem("dhanada_conversation_id")
					: null),
			visitor_id: state.sessionId,
		};

		const result = await leadManager.saveLead(leadData);
		if (result.success) {
			state.leadCaptured = true;
			state.leadStep = LEAD_STEPS.DONE;
			state.crmLeadName = result.lead_name;
			return `Thank you, ${
				state.collected.name || ""
			}! I have passed your details to our team. An advisor will reach out to you shortly.`;
		} else {
			console.error("[CRM ERROR]", result.message);
			state.leadStep = LEAD_STEPS.NONE;
			return `We're sorry, there was a temporary issue saving your details to our system. Please try providing your details again later, or contact us directly.`;
		}
	}

	async updateLeadSummary(state) {
		const chatSummary = generateChatSummary(state);

		const leadData = {
			name: state.collected.name,
			phone: state.collected.phone,
			email: state.collected.email,
			interest: state.currentTopic !== "unknown" ? formatTopicName(state.currentTopic) : "",
			chat_summary: chatSummary,
			existing_lead_name: state.crmLeadName,
			conversation_id:
				state.conversationId ||
				(typeof localStorage !== "undefined"
					? localStorage.getItem("dhanada_conversation_id")
					: null),
			visitor_id: state.sessionId,
		};

		try {
			await leadManager.saveLead(leadData);
		} catch (e) {
			console.error("Failed to update lead summary:", e);
		}
	}
}
