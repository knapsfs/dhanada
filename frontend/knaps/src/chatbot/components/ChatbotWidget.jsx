import React, { useState, useEffect, useRef } from 'react';
import '../assets/style.css';
import { Chatbot } from '../logic/chatbot.js';
import { saveChatMessage } from '../logic/conversationPersistence.js';

const chatbotInstance = new Chatbot();

const STORAGE_KEYS = {
  sessionId: 'dhanada_session_id',
  conversationId: 'dhanada_conversation_id',
  history: 'dhanada_chat_history',
  state: 'dhanada_chat_state',
  widgetOpen: 'dhanada_widget_open',
};

const DEFAULT_SUGGESTIONS = [
  'What is SIP?',
  'Compare Horizon Bluechip and Cedar Balanced Advantage',
  'Show sample market news',
  'Suggest a fund for 5 years',
];

const WELCOME_MESSAGE = 'Hello! I am Riddhi, your investment assistant. How can I help you today?';

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(() => localStorage.getItem(STORAGE_KEYS.widgetOpen) === 'true');
  const [sessionId, setSessionId] = useState(() => {
    let id = localStorage.getItem(STORAGE_KEYS.sessionId);
    if (!id) {
      id = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : 'sess-' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem(STORAGE_KEYS.sessionId, id);
    }
    return id;
  });
  const [conversationId, setConversationId] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.conversationId) || null;
  });
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.history);
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    return [{ role: 'bot', text: WELCOME_MESSAGE }];
  });
  const [chatState, setChatState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.state);
      if (stored) return JSON.parse(stored);
    } catch (e) { }
    return {};
  });
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [healthStatus, setHealthStatus] = useState('Connecting...');
  const [healthOk, setHealthOk] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  const inputRef = useRef(null);
  const historyRef = useRef(null);
  const lastMessageRef = useRef(null);
  const launcherRef = useRef(null);
  const isInvertedRef = useRef(false);

  useEffect(() => {
    console.log("ChatbotWidget Mounted");
  }, []);

  useEffect(() => {
    let ticking = false;
    const updateIconColor = () => {
      const launcher = document.getElementById('widgetLauncher');
      if (!launcher) return;

      const rect = launcher.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      const prevPointerEvents = launcher.style.pointerEvents;
      launcher.style.pointerEvents = 'none';

      const elements = document.elementsFromPoint(x, y);
      launcher.style.pointerEvents = prevPointerEvents;

      let isDarkBackground = false;

      for (const el of elements) {
        if (el.closest('.widget-launcher') || el.closest('.chat-widget')) continue;

        const computedStyle = window.getComputedStyle(el);
        const bgColor = computedStyle.backgroundColor;
        const bgImage = computedStyle.backgroundImage;

        if (bgImage && bgImage.includes('gradient')) {
          isDarkBackground = true;
          break;
        }

        if (bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
          const rgbMatch = bgColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          if (rgbMatch) {
            const r = parseInt(rgbMatch[1], 10);
            const g = parseInt(rgbMatch[2], 10);
            const b = parseInt(rgbMatch[3], 10);

            const isWhiteOrLight = (r > 240 && g > 240 && b > 240);
            if (!isWhiteOrLight) {
              isDarkBackground = true;
            }
            break;
          }
        }
      }

      if (isDarkBackground !== isInvertedRef.current) {
        isInvertedRef.current = isDarkBackground;
        setIsInverted(isDarkBackground);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateIconColor();
          ticking = false;
        });
        ticking = true;
      }
    };

    setTimeout(updateIconColor, 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.widgetOpen, String(isOpen));
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 120);
    }
  }, [isOpen]);

  useEffect(() => {
    if (historyRef.current && lastMessageRef.current) {
      const container = historyRef.current;
      const lastMsg = lastMessageRef.current;
      
      const childRect = lastMsg.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const relativeTop = childRect.top - containerRect.top + container.scrollTop;
      
      const targetScrollTop = relativeTop - 20; // 20px padding
      
      container.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping, suggestions]);

  useEffect(() => {
    // Local chatbot is always online
    setHealthOk(true);
    setHealthStatus('Online');
  }, []);

  const pushMessage = (role, text, quickReplies = []) => {
    setMessages((prev) => {
      const clearedPrev = prev.map(msg => ({ ...msg, quickReplies: [] }));
      const updated = [...clearedPrev, { role, text, quickReplies }];
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(updated));
      return updated;
    });
  };

  const updateStateAndSuggestions = (newState, quickReplies) => {
    setChatState(newState);
    localStorage.setItem(STORAGE_KEYS.state, JSON.stringify(newState));
    setSuggestions(quickReplies || []);
  };

  const handleSend = async (text) => {
    if (!text.trim() || isBusy) return;

    setSuggestions([]);
    setIsOpen(true);
    setIsBusy(true);
    pushMessage('user', text);
    setInputText('');

    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    setIsTyping(true);

    let activeConvId = conversationId;

    // 1. Persist user message to Dhanada backend
    try {
      let userPersistRes = await saveChatMessage({
        conversationId: activeConvId,
        visitorId: sessionId,
        role: 'user',
        message: text,
      });

      // Handle stale/invalid conversation ID (404/403) by clearing and retrying
      if (!userPersistRes?.success && (userPersistRes?.status === 404 || userPersistRes?.status === 403 || userPersistRes?.error?.includes('404') || userPersistRes?.error?.includes('403'))) {
        localStorage.removeItem(STORAGE_KEYS.conversationId);
        activeConvId = null;
        userPersistRes = await saveChatMessage({
          conversationId: null,
          visitorId: sessionId,
          role: 'user',
          message: text,
        });
      }

      if (userPersistRes?.success && userPersistRes.conversation_id) {
        activeConvId = userPersistRes.conversation_id;
        if (activeConvId !== conversationId) {
          setConversationId(activeConvId);
          localStorage.setItem(STORAGE_KEYS.conversationId, activeConvId);
        }
      }
    } catch (persistErr) {
      console.warn("Failed to persist user message:", persistErr);
    }

    try {
      // 2. Generate response via Riddhi logic
      const data = await chatbotInstance.processMessage(sessionId, text, { conversationId: activeConvId });
      pushMessage('bot', data.reply, data.quickReplies);
      updateStateAndSuggestions(data.state, data.quickReplies);

      // 3. Persist assistant response to Dhanada backend
      try {
        const userCollected = data.state?.collected || {};
        const chatSummary = data.summary || data.state?.summary || "";

        let botPersistRes = await saveChatMessage({
          conversationId: activeConvId,
          visitorId: sessionId,
          role: 'assistant',
          message: data.reply,
          chatContext: chatSummary || undefined,
          userName: userCollected.name || undefined,
          email: userCollected.email || undefined,
          phone: userCollected.phone || undefined,
        });

        // Handle stale/invalid conversation ID fallback
        if (!botPersistRes?.success && (botPersistRes?.status === 404 || botPersistRes?.status === 403 || botPersistRes?.error?.includes('404') || botPersistRes?.error?.includes('403'))) {
          localStorage.removeItem(STORAGE_KEYS.conversationId);
          botPersistRes = await saveChatMessage({
            conversationId: null,
            visitorId: sessionId,
            role: 'assistant',
            message: data.reply,
            chatContext: chatSummary || undefined,
            userName: userCollected.name || undefined,
            email: userCollected.email || undefined,
            phone: userCollected.phone || undefined,
          });
        }

        if (botPersistRes?.success && botPersistRes.conversation_id && botPersistRes.conversation_id !== activeConvId) {
          activeConvId = botPersistRes.conversation_id;
          setConversationId(activeConvId);
          localStorage.setItem(STORAGE_KEYS.conversationId, activeConvId);
        }
      } catch (botPersistErr) {
        console.warn("Failed to persist assistant message:", botPersistErr);
      }
    } catch (error) {
      console.error(error);
      pushMessage('bot', 'Sorry, I am having trouble connecting right now. Please try again later.');
    } finally {
      setIsTyping(false);
      setIsBusy(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSend(inputText);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputText);
    }
  };

  const handleInput = (e) => {
    setInputText(e.target.value);
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  };

  const handleNewChat = () => {
    const newId = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : 'sess-' + Math.random().toString(36).substring(2, 15);
    setSessionId(newId);
    localStorage.setItem(STORAGE_KEYS.sessionId, newId);

    setConversationId(null);
    localStorage.removeItem(STORAGE_KEYS.conversationId);

    const initialMsgs = [{ role: 'bot', text: WELCOME_MESSAGE }];
    setMessages(initialMsgs);
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(initialMsgs));

    setChatState({});
    localStorage.removeItem(STORAGE_KEYS.state);

    setSuggestions(DEFAULT_SUGGESTIONS);
    setInputText('');
    setIsOpen(true);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen]);

  return (
    <>
      <button
        id="widgetLauncher"
        className={`widget-launcher ${isOpen ? 'is-open' : ''} ${isInverted ? 'inverted' : ''}`}
        type="button"
        aria-controls="chatWidget"
        aria-expanded={isOpen}
        aria-label="Open Riddhi Chat"
        onClick={() => setIsOpen(true)}
      >
        <div className="morph-container">
          <div className="morph-part extra"></div>
          <div className="morph-part stem"></div>
          <div className="morph-part arm-top"></div>
          <div className="morph-part arm-bot"></div>
        </div>
      </button >

      <section id="chatWidget" className={`chat-widget ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
        <header className="chat-widget-header">
          <div className="widget-brand">
            <img src={`${import.meta.env.BASE_URL}favicon.svg`} alt="Knaps bot icon" className="widget-brand-icon" />
            <div>
              <p className="widget-brand-kicker">Knaps</p>
              <h2>Assistant</h2>
            </div>
          </div>

          <div className="widget-header-actions">
            <div className="status-pill">
              <span className={`status-dot ${healthOk ? 'ok' : 'error'}`}></span>
              <span id="healthText">{healthStatus}</span>
            </div>
            <button id="newChatButton" className="icon-button" type="button" aria-label="Start new chat" onClick={handleNewChat}>↺</button>
            <button id="closeWidgetButton" className="icon-button" type="button" aria-label="Close chat" onClick={() => setIsOpen(false)}>✕</button>
          </div>
        </header >

        {/* <div className="widget-intro">
          <p>Ask about SIP, funds, tax, NAV, risk, KYC, and recommendations.</p>
        </div> */}

        <div id="suggestionBar" className="suggestion-bar" aria-label="Quick prompts">
          {suggestions.map((s, idx) => (
            <button key={idx} type="button" className="suggestion-chip" onClick={() => handleSend(s)} disabled={isBusy}>
              {s}
            </button>
          ))}
        </div>

        <div id="chatHistory" className="chat-history" aria-live="polite" ref={historyRef}>
          {messages.map((msg, idx) => {
            const isLastMessage = idx === messages.length - 1 && !isTyping;
            return (
            <div 
              key={idx} 
              className={`message-row ${msg.role}`}
              ref={isLastMessage ? lastMessageRef : null}
            >
              <div className={`message ${msg.role}`}>
                {msg.role === 'bot' && (
                  <div className="message-meta">
                    <span className="message-avatar">R</span>
                    <span>Riddhi</span>
                  </div>
                )}
                <div>{msg.text}</div>
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="quick-replies-container">
                    {msg.quickReplies.map((qr, qrIdx) => (
                      <button
                        key={qrIdx}
                        type="button"
                        className="quick-reply-btn"
                        onClick={() => handleSend(qr)}
                        disabled={isBusy}
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div >
            );
          })
          }
          {
            isTyping && (
              <div className="message-row bot" ref={lastMessageRef}>
                <div className="message bot">
                  <div className="message-meta">
                    <span className="message-avatar">R</span>
                    <span>Riddhi</span>
                  </div>
                  <div className="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )
          }
        </div >

        <form id="composer" className="composer" onSubmit={handleFormSubmit}>
          <label className="sr-only" htmlFor="messageInput">Type your message</label>
          <textarea
            id="messageInput"
            ref={inputRef}
            rows="1"
            maxLength="1000"
            placeholder="Type your question..."
            value={inputText}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isBusy}
          ></textarea>
          <button id="sendButton" type="submit" disabled={!inputText.trim() || isBusy}>Send</button>
        </form>
      </section >
    </>
  );
}
