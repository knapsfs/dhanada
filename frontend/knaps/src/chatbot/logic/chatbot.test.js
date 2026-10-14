import test from "node:test";
import assert from "node:assert/strict";

// Mock localStorage if in node environment without it
if (typeof globalThis.localStorage === "undefined") {
	const storage = new Map();
	globalThis.localStorage = {
		getItem: (k) => storage.get(k) || null,
		setItem: (k, v) => storage.set(k, String(v)),
		removeItem: (k) => storage.delete(k),
		clear: () => storage.clear(),
	};
}

// Mock window for browser environment checks
if (typeof globalThis.window === "undefined") {
	globalThis.window = {
		frappe: {
			csrf_token: "test-mock-token-12345",
		},
	};
}

import {
	Chatbot,
	cleanSuggestionChip,
	DEFAULT_QUICK_REPLIES,
	CONTEXTUAL_QUICK_REPLIES,
	getCsrfToken,
} from "./chatbot.js";

test("cleanSuggestionChip enforces short button phrases and rejects long sentences", () => {
	// Valid concise phrases (2-5 words)
	assert.equal(cleanSuggestionChip("Latest NAV"), "Latest NAV");
	assert.equal(cleanSuggestionChip("View Returns"), "View Returns");
	assert.equal(cleanSuggestionChip("Compare Funds"), "Compare Funds");
	assert.equal(cleanSuggestionChip("Talk to Advisor"), "Talk to Advisor");
	assert.equal(cleanSuggestionChip("• Explore SIF Schemes"), "Explore SIF Schemes");
	assert.equal(cleanSuggestionChip("1. Types of Funds."), "Types of Funds");
	assert.equal(cleanSuggestionChip('"Mutual Fund Risks"'), "Mutual Fund Risks");

	// Rejects paragraph explanations, multiple sentences, newlines, and long text
	assert.equal(
		cleanSuggestionChip("Here is an explanation of the fund returns and how NAV is calculated."),
		null
	);
	assert.equal(cleanSuggestionChip("Line one\nLine two"), null);
	assert.equal(
		cleanSuggestionChip("This button contains far too many words to reasonably fit on a screen"),
		null
	);
	assert.equal(cleanSuggestionChip("Sentence one. Sentence two"), null);
	assert.equal(cleanSuggestionChip(""), null);
	assert.equal(cleanSuggestionChip(null), null);
});

test("Predefined quick replies are concise phrases under length limits", () => {
	for (const label of DEFAULT_QUICK_REPLIES) {
		const words = label.split(/\s+/).filter(Boolean);
		assert.ok(words.length >= 1 && words.length <= 5, `DEFAULT_QUICK_REPLIES label "${label}" should be 1-5 words`);
		assert.ok(label.length <= 35, `DEFAULT_QUICK_REPLIES label "${label}" should be <= 35 chars`);
	}

	for (const [topic, list] of Object.entries(CONTEXTUAL_QUICK_REPLIES)) {
		for (const label of list) {
			const words = label.split(/\s+/).filter(Boolean);
			assert.ok(
				words.length >= 1 && words.length <= 5,
				`CONTEXTUAL_QUICK_REPLIES[${topic}] label "${label}" should be 1-5 words`
			);
			assert.ok(
				label.length <= 35,
				`CONTEXTUAL_QUICK_REPLIES[${topic}] label "${label}" should be <= 35 chars`
			);
		}
	}
});

test("detectIntent routes live financial/scheme queries to unknown so Frappe backend answers", () => {
	const bot = new Chatbot();

	// Financial data queries that must be answered by Frappe backend / financial_retriever.py
	const backendQueries = [
		"What is the NAV of Kotak Pioneer?",
		"What is its latest NAV?",
		"Show me the returns of Apex Equity Long Short",
		"How has it performed over six months?",
		"Compare Horizon Bluechip with Cedar Balanced",
		"SIF scheme details",
		"Which funds are available in SIF?",
		"What is the CAGR of the fund?",
	];

	for (const q of backendQueries) {
		const intent = bot.detectIntent(q);
		assert.equal(intent, "unknown", `Query "${q}" should route to "unknown" (backend)`);
	}

	// Pure static educational questions map to local guides
	assert.equal(bot.detectIntent("what is sip?"), "sip");
	assert.equal(bot.detectIntent("what is kyc?"), "kyc");
	assert.equal(bot.detectIntent("what is exit load?"), "exitLoad");
	assert.equal(bot.detectIntent("hello"), "greeting");
	assert.equal(bot.detectIntent("thank you"), "thanks");
});

test("Lead Capture Lockout: Ignoring an advisor offer resets advisorOffered and applies cooldown", async () => {
	const bot = new Chatbot();
	const sessionId = "test-session-ignore";
	const state = bot.sessionStore.get(sessionId);

	// Simulate an active pending offer
	state.leadStep = "pending_offer";
	state.advisorOffered = true;
	state.advisorDeclined = false;

	// User ignores the offer and asks about SIP
	const res = await bot.processMessage(sessionId, "what is sip?");

	assert.equal(state.leadStep, "none", "leadStep should be reset from pending_offer to none");
	assert.equal(state.advisorOffered, false, "advisorOffered should be reset to false so user is not locked out");
	assert.equal(state.leadEvaluationCooldown, 3, "reasonable cooldown should be applied");
	assert.ok(res.reply.includes("SIP") || res.reply.includes("Systematic"), "User question should be answered");
});

test("Lead Capture Lockout: Explicit decline sets advisorDeclined and avoids repeated offers", async () => {
	const bot = new Chatbot();
	const sessionId = "test-session-decline";
	const state = bot.sessionStore.get(sessionId);

	state.leadStep = "pending_offer";
	state.advisorOffered = true;
	state.advisorDeclined = false;

	// User explicitly declines
	const res = await bot.processMessage(sessionId, "no thanks");

	assert.equal(state.leadStep, "none", "leadStep should be reset to none");
	assert.equal(state.advisorOffered, false, "advisorOffered should be reset");
	assert.equal(state.advisorDeclined, true, "advisorDeclined must be set to true");
	assert.ok(state.leadEvaluationCooldown >= 5, "higher cooldown applied after explicit decline");
	assert.ok(res.reply.includes("Alright"), "Polite acknowledgement given");
});

test("Lead Interruption: Unrelated question during name collection step untraps the user", async () => {
	const bot = new Chatbot();
	const sessionId = "test-session-untrap";
	const state = bot.sessionStore.get(sessionId);

	// User accepted advisor offer and is now in name collection
	state.leadStep = "name";
	state.advisorOffered = true;

	// User asks an unrelated question instead of giving a name
	const res = await bot.processMessage(sessionId, "what is kyc?");

	assert.equal(state.leadStep, "none", "leadStep must reset from name to none when interrupted");
	assert.equal(state.advisorOffered, false, "advisorOffered should be reset");
	assert.ok(!res.reply.includes("May I know your name?"), "User should NOT be trapped in name validation");
	assert.ok(res.reply.toLowerCase().includes("kyc"), "Interruption question must be answered");
});

test("Lead Workflow: Explicit advisor request begins deterministic name capture", async () => {
	const bot = new Chatbot();
	const sessionId = "test-session-workflow";
	const state = bot.sessionStore.get(sessionId);

	const res = await bot.processMessage(sessionId, "connect with an advisor");

	assert.equal(state.leadStep, "name");
	assert.ok(res.reply.includes("what name should I tell our advisor?"));

	// Provide valid name
	const resName = await bot.processMessage(sessionId, "Rohit Sharma");
	assert.equal(state.collected.name, "Rohit Sharma");
	assert.equal(state.leadStep, "choose_share");
	assert.ok(resName.reply.includes("Rohit Sharma"));
});

test("Cached CSRF token can be retrieved safely without extra config call", async () => {
	const token = await getCsrfToken();
	assert.equal(token, "test-mock-token-12345");
});
