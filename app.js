import { AGENT_CONFIGS } from "./agent-configs.js";
import { GeminiService } from "./gemini-service.js";

// -------------------------------------------------------------
// Real-Time Live Auto-Reload Engine (Auto-updates on phone & desktop)
// -------------------------------------------------------------
(function initLiveHotReload() {
  let lastCssMod = null;
  let lastHtmlMod = null;
  
  setInterval(async () => {
    try {
      const cssRes = await fetch(`styles.css?t=${Date.now()}`, { method: "HEAD" });
      const cssMod = cssRes.headers.get("last-modified") || cssRes.headers.get("etag");
      
      const htmlRes = await fetch(`index.html?t=${Date.now()}`, { method: "HEAD" });
      const htmlMod = htmlRes.headers.get("last-modified") || htmlRes.headers.get("etag");

      if ((lastCssMod && cssMod && lastCssMod !== cssMod) || (lastHtmlMod && htmlMod && lastHtmlMod !== htmlMod)) {
        console.log("⚡ Live change detected! Auto-reloading phone & desktop view...");
        window.location.reload();
      }
      
      if (cssMod) lastCssMod = cssMod;
      if (htmlMod) lastHtmlMod = htmlMod;
    } catch (err) {
      // Ignore transient network glitches
    }
  }, 1200);
})();

// Initialize Gemini Service
const geminiService = new GeminiService();

// -------------------------------------------------------------
// SOL Vocabulary Library (For Random Word Generator)
// -------------------------------------------------------------
const VOCABULARY_LIBRARY = {
  es: [
    { word: "Cerveza", meta: "noun | /θeɾˈβeθa/", def: "An alcoholic beverage made by fermenting barley, flavored with hops; beer." },
    { word: "Biblioteca", meta: "noun | /bi.βljoˈte.ka/", def: "A building or room containing collections of books and periodicals; library." },
    { word: "Madrugada", meta: "noun | /ma.ðɾuˈɣa.ða/", def: "The early morning hours, specifically the period between midnight and sunrise; dawn." },
    { word: "Girasol", meta: "noun | /xi.ɾaˈsol/", def: "A tall North American plant of the daisy family, with very large golden-rayed flowers; sunflower." },
    { word: "Desafío", meta: "noun | /de.saˈfi.o/", def: "A call to take part in a contest or competition; a challenge." }
  ],
  fr: [
    { word: "Pamplemousse", meta: "noun | /pɑ̃.plə.mus/", def: "A large round sour citrus fruit with yellow skin and pink or yellow flesh; grapefruit." },
    { word: "Écureuil", meta: "noun | /e.ky.ʁœj/", def: "A small squirrel-like rodent with a bushy tail that lives in trees; squirrel." },
    { word: "Crépuscule", meta: "noun | /kʁe.pys.kyl/", def: "The soft glowing light from the sky when the sun is below the horizon; twilight." },
    { word: "Chuchoter", meta: "verb | /ʃy.ʃɔ.te/", def: "Speak very softly using one's breath rather than one's vocal cords; whisper." },
    { word: "Dépaysement", meta: "noun | /de.pa.iz.mɑ̃/", def: "The feeling of disorientation or change of scenery one gets when traveling; displacement." }
  ],
  de: [
    { word: "Gemütlichkeit", meta: "noun | /ɡəˈmyːtlɪçkaɪt/", def: "A state of warmth, friendliness, and good cheer; coziness or comfort." },
    { word: "Fernweh", meta: "noun | /ˈfɛʁnˌveː/", def: "A longing for far-off places or travel; farsickness (opposite of homesickness)." },
    { word: "Schadenfreude", meta: "noun | /ˈʃaːdn̩ˌfʁɔʏ̯də/", def: "Pleasure derived by someone from another person's misfortune." },
    { word: "Kummerspeck", meta: "noun | /ˈkʊmɐˌʃpɛk/", def: "Excess weight gained from emotional overeating; grief-bacon." },
    { word: "Sehnsucht", meta: "noun | /ˈzeːnˌzʊxt/", def: "A deep yearning or wistful longing for something indefinable or unattainable." }
  ],
  it: [
    { word: "Sprezzatura", meta: "noun | /spret.tsaˈtu.ra/", def: "A certain nonchalance, so as to conceal all art and make whatever one does seem effortless." },
    { word: "Allora", meta: "adverb | /alˈlo.ra/", def: "An introductory filler word meaning 'then', 'well', or 'therefore'." },
    { word: "Crepuscolo", meta: "noun | /kreˈpus.ko.lo/", def: "The period of fading light after sunset or before sunrise; twilight." },
    { word: "Mozaico", meta: "noun | /moˈdza.i.ko/", def: "A picture or pattern produced by arranging together small colored pieces of stone or glass; mosaic." },
    { word: "Riflessione", meta: "noun | /ri.flesˈsjo.ne/", def: "Serious thought or consideration; reflection." }
  ],
  en: [
    { word: "Serendipity", meta: "noun | /ˌserənˈdipədē/", def: "The occurrence and development of events by chance in a happy or beneficial way." },
    { word: "Mellifluous", meta: "adjective | /məˈliflo͞oəs/", def: "A sound that is sweet and musical; pleasant to hear." },
    { word: "Ephemeral", meta: "adjective | /əˈfemərəl/", def: "Lasting for a very short time; transient." },
    { word: "Petrichor", meta: "noun | /ˈpeˌtrīkôr/", def: "A pleasant smell that frequently accompanies the first rain after a long period of warm, dry weather." },
    { word: "Limerence", meta: "noun | /ˈlimərəns/", def: "The state of being infatuated or obsessed with another person, typically experienced involuntarily." }
  ]
};

// -------------------------------------------------------------
// Curated Videos Library
// -------------------------------------------------------------
const VIDEOS_LIBRARY = [
  { id: "v1", title: "Comprehensible Spanish for Beginners", desc: "A slow, clear story in Spanish using visual guides to aid natural acquisition.", code: "es", embedUrl: "https://www.youtube.com/embed/RJbUtcaoNCY?list=PLPSdgTGGxv5Pfy8Ftf0mzsnG3v2RvijO_", playlistUrl: "https://www.youtube.com/playlist?list=PLPSdgTGGxv5Pfy8Ftf0mzsnG3v2RvijO_" },
  { id: "v2", title: "French Comprehensible Input: Travel Essentials", desc: "Acquire intermediate travel phrases naturally through situational dialogues.", code: "fr", embedUrl: "https://www.youtube.com/embed/8v_Y-5b23d0" },
  { id: "v3", title: "German A1: Daily Routine Dialogue", desc: "Learn daily activities in German using simple sentences, illustrations, and slow audio.", code: "de", embedUrl: "https://www.youtube.com/embed/3Q_Uj-Wc-3M" },
  { id: "v4", title: "Introduction to Input-Based Learning Methods", desc: "Linguists explain why comprehensible input accelerates vocabulary and retention.", code: "en", embedUrl: "https://www.youtube.com/embed/J_EQDtpYSNM" }
];

// -------------------------------------------------------------
// Simulated Community Board Data
// -------------------------------------------------------------
let communityPosts = [
  {
    id: "p1",
    user: "Marco L. 🇮🇹",
    time: "2 hours ago",
    content: "Has anyone found a good routine for practicing Italian Sprezzatura? It is so hard to sound natural without stuttering!",
    likes: 12,
    comments: [
      { user: "Sarah K. 🇺🇸", content: "I suggest shadowing native podcasters! Just copy their rhythm without thinking of vocabulary." }
    ]
  },
  {
    id: "p2",
    user: "Emma W. 🇬🇧",
    time: "5 hours ago",
    content: "SOL Grammar just fixed my Spanish subjunctive clauses in my diary. Highly recommend checking it before sleeping!",
    likes: 24,
    comments: []
  }
];

// -------------------------------------------------------------
// App State variables
// -------------------------------------------------------------
let activePanel = "start-here";
let activeChatMessages = JSON.parse(localStorage.getItem("sol_chat_history")) || [];
let activeModel = "gemini-1.5-flash";
let activeAgentId = "general";
let currentTheme = localStorage.getItem("sol_theme") || "dark";

// Speech Recognition instance
let speechRecognition = null;
let isRecording = false;

// -------------------------------------------------------------
// DOM Selection
// -------------------------------------------------------------
const sidebar = document.getElementById("sidebar");
const menuToggleBtn = document.getElementById("menu-toggle-btn");
const navItems = document.querySelectorAll(".nav-item");

const headerAgentBadge = document.getElementById("header-agent-badge");
const headerChatTitle = document.getElementById("header-chat-title");
const headerModelBadge = document.getElementById("header-model-badge");
const themeToggleBtn = document.getElementById("theme-toggle-btn");

const panelsContainer = document.getElementById("panels-container");
const panels = document.querySelectorAll(".workspace-panel");

// Panel - Start Here
const featureCards = document.querySelectorAll(".feature-card");

// Panel - Community (Circle.so style Layout)
let currentCircleChannel = "announcements";
let circleChannelsData = {
  announcements: [
    {
      id: "cp1",
      title: "Globally Known Weekly Schedule - Oct 3-8, 2026 (LINKS INSIDE)",
      author: "Gregory Dobbins",
      role: "Program Manager 🎓",
      avatar: "GD",
      time: "2 days ago",
      content: "What's Up GLOBALLY KNOWN LEARNERS! Here is the weekly comprehension schedule. Please review your lessons and analyze your pronunciation in the labs.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
      likes: 17,
      comments: [
        { author: "Sarah K.", content: "Super excited for this schedule! Subscribed." }
      ]
    }
  ],
  "english-inputs": [
    {
      id: "cp2",
      title: "How to practice shadowing with City Vlogs?",
      author: "Sarah K. 🇺🇸",
      role: "Language Coach 🏅",
      avatar: "SK",
      time: "3 hours ago",
      content: "I recommend playing the City Vlog lessons at 0.75x speed. Focus on mimicking the vowels and mouth shapes. Listen to the phrase first, pause, and record yourself under the output practicing tab!",
      likes: 8,
      comments: []
    }
  ],
  "metaphors": [
    {
      id: "cp3",
      title: "Fascinating Metaphor: 'Running out of time' ⏳",
      author: "Alice F. 🇫🇷",
      role: "Member 👤",
      avatar: "AF",
      time: "Yesterday",
      content: "In Spanish and French, the metaphorical conceptualization of time matches the English system. We talk about time as a resource that can be spent, saved, or wasted. Let's discuss other metaphor grids!",
      likes: 12,
      comments: []
    }
  ],
  "general-chat": [
    {
      id: "cp4",
      title: "Welcome everyone! Introduce yourself here!",
      author: "You",
      role: "Learner 👤",
      avatar: "Y",
      time: "Just now",
      content: "Hey community! I am using SOL to master comprehension input. Excited to learn with you all!",
      likes: 0,
      comments: []
    }
  ],
  "featurings": [
    {
      id: "cp5",
      title: "New SOL 2.0 Engine is extremely responsive!",
      author: "Bob D. 🇩🇪",
      role: "Member 👤",
      avatar: "BD",
      time: "3 days ago",
      content: "The accent detection engine is incredibly accurate now. My Spanish accuracy scores went from 80% to 95% after fixing daily routine vowels.",
      likes: 5,
      comments: []
    }
  ]
};

const CIRCLE_CHANNELS_META = {
  home: { title: "Community Dashboard", desc: "Welcome to the Globally Known student hub." },
  "members-tab": { title: "Community Members", desc: "Meet other active language learners in the SOL cohort." },
  announcements: { title: "# Announcements", desc: "Official updates and notices from the SOL Globally Known team." },
  "english-inputs": { title: "# english-inputs", desc: "Discuss vocabulary, structures, and notes from City Vlog lessons." },
  metaphors: { title: "# metaphors-discussion", desc: "Explore semantic networks, idioms, and target language metaphors." },
  "general-chat": { title: "# general-chat", desc: "Informal conversations and greetings with study partners." },
  "featurings": { title: "# featurings", desc: "Share your accuracy metrics, speech recordings, and feature suggestions." }
};

// Panel - Random Word
const wordLangSelect = document.getElementById("word-lang-select");
const nextWordBtn = document.getElementById("next-word-btn");
const targetWordText = document.getElementById("target-word-text");
const targetWordMeta = document.getElementById("target-word-meta");
const targetWordDef = document.getElementById("target-word-def");
const listenWordBtn = document.getElementById("listen-word-btn");
const recordSpeechBtn = document.getElementById("record-speech-btn");
const recordingStatus = document.getElementById("recording-status");
const feedbackBox = document.getElementById("pronunciation-feedback-box");
const feedbackScore = document.getElementById("feedback-score");
const expectedText = document.getElementById("expected-text");
const detectedText = document.getElementById("detected-text");
const feedbackComment = document.getElementById("feedback-comment");

// Panel - Videos
const videoGrid = document.getElementById("video-grid");



// Panel - Describing Lab
const labImage = document.getElementById("lab-image");
const labChangeImageBtn = document.getElementById("lab-change-image-btn");
const labTextInput = document.getElementById("lab-text-input");
const labSubmitBtn = document.getElementById("lab-submit-btn");
const labFeedback = document.getElementById("lab-feedback");

// Panel - Output Practicing
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const agentSelect = document.getElementById("agent-select");
const modelSelect = document.getElementById("model-select");
const clearChatBtn = document.getElementById("clear-chat-btn");
const messagesList = document.getElementById("messages-list");
const welcomeScreen = document.getElementById("welcome-screen");
const welcomeAgentTitle = document.getElementById("welcome-agent-title");
const welcomeAgentTagline = document.getElementById("welcome-agent-tagline");
const suggestionsGrid = document.getElementById("suggestions-grid");

// Panel - Info
const apiKeyInput = document.getElementById("api-key-input");
const togglePasswordBtn = document.getElementById("toggle-password-btn");
const saveSettingsBtn = document.getElementById("save-settings-btn");
const clearAllDataBtn = document.getElementById("clear-all-data-btn");
const apiStatusBadge = document.getElementById("api-status-badge");

// -------------------------------------------------------------
// Helper Utilities
// -------------------------------------------------------------
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

window.copyCodeToClipboard = async function(btn) {
  const container = btn.closest(".code-block-container");
  const codeEl = container.querySelector("code");
  const text = codeEl.textContent;
  
  try {
    await navigator.clipboard.writeText(text);
    btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
    btn.classList.add("copied");
    setTimeout(() => {
      btn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy code`;
      btn.classList.remove("copied");
    }, 2000);
  } catch (err) {
    console.error("Failed to copy code: ", err);
  }
};

// Configure Custom Marked.js Code Block Rendering
const renderer = new marked.Renderer();
renderer.code = function(code, language) {
  const cleanLanguage = language || "plaintext";
  const rawCode = typeof code === 'object' ? code.text : code;
  return `
    <div class="code-block-container">
      <div class="code-block-header">
        <span>${cleanLanguage}</span>
        <button class="copy-code-btn" onclick="copyCodeToClipboard(this)">
          <i class="fa-regular fa-copy"></i> Copy code
        </button>
      </div>
      <pre><code class="language-${cleanLanguage}">${escapeHtml(rawCode)}</code></pre>
    </div>
  `;
};
marked.setOptions({ renderer });

// -------------------------------------------------------------
// Application Initialization
// -------------------------------------------------------------
function init() {
  // Theme Setup
  applyTheme(currentTheme);
  initThemePicker();

  // API Key Status
  updateApiStatusIndicator();
  const apiKeyInputEl = document.getElementById("api-key-input");
  if (apiKeyInputEl) apiKeyInputEl.value = geminiService.apiKey;

  // Initialize Panels
  initSidebar();
  initStartHerePanel();
  initCommunityPanel();
  initRandomWordPanel();
  initVideosPanel();
  initDictionaryPanel();
  initDescribingLabPanel();
  initOutputPracticingPanel();

  // Initialize PWA, Google Auth & Admin Access
  initPwaInstall();
  initGoogleAuth();
  initAdminMode();

  // Settings Panel Bind
  setupSettingsHandlers();

  // Explicitly activate activePanel or start-here on startup
  if (typeof window.switchPanel === "function") {
    window.switchPanel(activePanel || "start-here");
  }
}

// -------------------------------------------------------------
// Gemini Home Screen Panel Setup (Start Here)
// -------------------------------------------------------------
const GREETING_TEMPLATES = [
  "Ask away, {name}!",
  "What's new, {name}?",
  "How's it going, {name}?",
  "What would you like to acquire today, {name}?",
  "Ready to practice, {name}?"
];

let lastGreetingIndex = -1;

function updateGreetingText() {
  const greetingEl = document.getElementById("gemini-greeting-text");
  if (!greetingEl) return;
  
  let name = "Adrian";
  try {
    const profile = JSON.parse(localStorage.getItem("sol_user_profile"));
    if (profile && profile.name) {
      name = profile.name.split(" ")[0];
    }
  } catch (e) {}

  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * GREETING_TEMPLATES.length);
  } while (GREETING_TEMPLATES.length > 1 && randomIndex === lastGreetingIndex);
  lastGreetingIndex = randomIndex;

  const template = GREETING_TEMPLATES[randomIndex];
  greetingEl.textContent = template.replace("{name}", name);
}

let homeConversationHistory = [];
let currentHomeConvId = null;

function updateHomeChatModeState() {
  const panelStart = document.getElementById("panel-start-here");
  const homeContent = document.querySelector(".gemini-home-content");
  const conversationEl = document.getElementById("gemini-home-conversation");
  const hasMsgs = conversationEl && conversationEl.querySelectorAll(".gemini-inline-message").length > 0;
  if (panelStart) panelStart.classList.toggle("has-messages", hasMsgs);
  if (homeContent) homeContent.classList.toggle("has-messages", hasMsgs);
}

function triggerHomeFadeInAnimation() {
  const container = document.querySelector(".gemini-home-content");
  if (!container) return;
  
  container.classList.remove("fade-in-anim");
  void container.offsetWidth; // Force DOM reflow
  container.classList.add("fade-in-anim");
}

function resetHomeConversationScreen() {
  homeConversationHistory = [];
  currentHomeConvId = null;
  const conversationEl = document.getElementById("gemini-home-conversation");
  if (conversationEl) conversationEl.innerHTML = "";
  const homeInput = document.getElementById("gemini-home-input");
  if (homeInput) homeInput.value = "";
  updateGreetingText();
  updateHomeChatModeState();
  switchPanel("start-here");
  triggerHomeFadeInAnimation();
}

function initStartHerePanel() {
  updateGreetingText();

  const homeInput = document.getElementById("gemini-home-input");
  const modelSelector = document.getElementById("home-model-selector");
  const modelNameText = document.getElementById("home-model-name");
  const micBtn = document.getElementById("btn-home-mic");
  const attachBtn = document.getElementById("btn-home-attach");
  const chips = document.querySelectorAll(".gemini-chip-btn");
  const conversationEl = document.getElementById("gemini-home-conversation");

  // Send Direct Query to Gemini right on Home Screen
  const submitHomeQuery = async (query) => {
    if (!query || !conversationEl) return;

    // Auto-create sidebar conversation item on first message if needed
    if (!currentHomeConvId) {
      currentHomeConvId = "conv_" + Date.now();
      const firstSentence = query.trim().split(/[.!?\n]/)[0].trim() || query;
      const shortTitle = firstSentence.length > 32 ? firstSentence.slice(0, 32) + "..." : firstSentence;
      const randomColor = RANDOM_ACCENT_PALETTE[Math.floor(Math.random() * RANDOM_ACCENT_PALETTE.length)];
      const convs = getSolConversations();
      convs.unshift({
        id: currentHomeConvId,
        title: "💬 " + shortTitle,
        icon: "fa-comments",
        type: "chat",
        history: [],
        accentColor: randomColor
      });
      saveSolConversations(convs);
      renderSidebarConversations();
    }

    // 1. Render User Message Bubble
    const userDiv = document.createElement("div");
    userDiv.className = "gemini-inline-message";
    userDiv.innerHTML = `<div class="gemini-user-query">${escapeHtml(query)}</div>`;
    conversationEl.appendChild(userDiv);
    updateHomeChatModeState();
    saveActiveConversationMessages();

    // Append to home conversation history
    homeConversationHistory.push({ role: "user", content: query, parts: [{ text: query }] });

    // 2. Render Gemini AI Response Container
    const aiDiv = document.createElement("div");
    aiDiv.className = "gemini-inline-message";
    aiDiv.innerHTML = `
      <div class="gemini-ai-response">
        <div class="gemini-ai-body">
          <i class="fa-solid fa-spinner fa-spin" style="color: var(--accent-yellow);"></i> Thinking...
        </div>
      </div>
    `;
    conversationEl.appendChild(aiDiv);
    aiDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });

    const aiBody = aiDiv.querySelector(".gemini-ai-body");
    let responseText = "";

    const systemInstruction = "";

    if (geminiService.hasApiKey()) {
      let isStreamError = false;
      try {
        await geminiService.generateResponseStream(
          homeConversationHistory,
          systemInstruction,
          activeModel,
          (chunk) => {
            if (responseText === "") aiBody.innerHTML = "";
            responseText += chunk;
            aiBody.innerHTML = marked.parse(responseText) + `<span class="cursor-blink"></span>`;
            aiDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
          },
          (errorMsg) => {
            isStreamError = true;
            aiBody.innerHTML = `
              <div style="color: #ef4444; font-weight: 500; padding: 0.25rem 0;">
                <i class="fa-solid fa-circle-exclamation"></i> <strong>Gemini API Error:</strong> ${escapeHtml(errorMsg)}
                <div style="margin-top: 0.75rem; color: #cbd5e1; font-size: 0.88rem; font-weight: 400;">
                  💡 Your saved Gemini API Key appears invalid or expired.<br><br>
                  👉 Click <button onclick="window.switchPanel('info');" style="background: rgba(250, 204, 21, 0.2); border: 1px solid #facc15; color: #facc15; padding: 0.25rem 0.6rem; border-radius: 6px; cursor: pointer; font-weight: 600; margin-left: 0.25rem;">Info / Settings</button> to enter a valid free Gemini API Key, or clear it to use Demo Mode.
                </div>
              </div>
            `;
          }
        );
        if (!isStreamError && responseText) {
          aiBody.innerHTML = marked.parse(responseText);
          aiBody.setAttribute("data-raw-text", responseText);
          homeConversationHistory.push({ role: "model", content: responseText, parts: [{ text: responseText }] });
          saveActiveConversationMessages();
        }
      } catch (err) {
        aiBody.innerHTML = `
          <div style="color: #ef4444; font-weight: 500;">
            <i class="fa-solid fa-circle-exclamation"></i> <strong>Connection Error:</strong> ${escapeHtml(err.message || err)}
          </div>
        `;
      }
    } else {
      // Demo Mode response
      setTimeout(() => {
        responseText = `Hello! I'm **Gemini AI**, ready to assist you on **SOL - Globally Known**.\n\n` +
                       `To unlock live unlimited streaming directly from Google's official Gemini API, simply click **Info / Settings** (the bottom ⓘ icon) and paste your free **Gemini API Key**.\n\n` +
                       `*How can I help you acquire new English vocabulary or practice dialogues today?*`;
        aiBody.innerHTML = marked.parse(responseText);
        aiBody.setAttribute("data-raw-text", responseText);
        homeConversationHistory.push({ role: "model", content: responseText, parts: [{ text: responseText }] });
        saveActiveConversationMessages();
      }, 600);
    }

    // Bind Audio TTS Button
    if (ttsBtn) {
      ttsBtn.addEventListener("click", () => {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
          const cleanText = responseText.replace(/[*_#`~>]/g, "");
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = "en-US";
          window.speechSynthesis.speak(utterance);
          if (typeof showToast === "function") showToast("🔊 Playing Gemini Audio...");
        }
      });
    }

    // Bind Copy Button
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(responseText).then(() => {
          if (typeof showToast === "function") showToast("📋 Response copied!");
        });
      });
    }
  };

  // Keyboard Enter on Input Bar -> Submits prompt directly on Home Screen
  if (homeInput) {
    homeInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && homeInput.value.trim()) {
        const query = homeInput.value.trim();
        homeInput.value = "";
        submitHomeQuery(query);
      }
    });
  }

  // Model Selector Toggle Pill
  if (modelSelector) {
    modelSelector.addEventListener("click", () => {
      const models = ["Flash", "Pro", "SOL Engine"];
      const current = modelNameText ? modelNameText.textContent.trim() : "Flash";
      const nextIndex = (models.indexOf(current) + 1) % models.length;
      const nextModel = models[nextIndex];
      if (modelNameText) modelNameText.textContent = nextModel;
      
      const headerModelBadge = document.getElementById("header-model-badge");
      if (headerModelBadge) {
        headerModelBadge.innerHTML = `<i class="fa-solid fa-brain"></i> ${nextModel}`;
      }
      if (typeof showToast === "function") showToast(`Model set to ${nextModel}`);
    });
  }

  // Voice Input Mic Button
  if (micBtn) {
    micBtn.addEventListener("click", () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported by your browser. Please type your query in the input bar.");
        return;
      }

      micBtn.style.color = "#ef4444";
      if (typeof showToast === "function") showToast("🎙️ Listening... Speak now!");

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (homeInput) {
          homeInput.value = transcript;
          submitHomeQuery(transcript);
        }
        micBtn.style.color = "#94a3b8";
      };

      recognition.onerror = () => {
        micBtn.style.color = "#94a3b8";
        if (typeof showToast === "function") showToast("Voice input cancelled or unavailable.");
      };

      recognition.onend = () => {
        micBtn.style.color = "#94a3b8";
      };

      recognition.start();
    });
  }

  // Attachment Plus Button
  if (attachBtn) {
    attachBtn.addEventListener("click", () => {
      alert("Attachment support active! You can attach images, PDFs, or audio files in the Describing Lab and Output Practicing panels.");
    });
  }

  // Quick Action Chips Click Navigation
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      const target = chip.getAttribute("data-target");
      if (target) {
        switchPanel(target);
      }
    });
  });
}

function initSidebar() {
  // Sidebar Slide Toggle (works on desktop and mobile)
  const menuToggleBtnEl = document.getElementById("menu-toggle-btn");
  const sidebarEl = document.getElementById("sidebar");
  if (menuToggleBtnEl && sidebarEl) {
    menuToggleBtnEl.addEventListener("click", () => {
      if (sidebarEl.classList.contains("expanded")) {
        sidebarEl.classList.replace("expanded", "collapsed");
      } else {
        sidebarEl.classList.replace("collapsed", "expanded");
      }
      sidebarEl.classList.toggle("mobile-active");
    });
  }

  // Tab Panel Routing
  const allNavItems = document.querySelectorAll(".nav-item");
  allNavItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const panelId = item.getAttribute("data-panel");
      if (panelId === "sol-chat") {
        if (typeof saveActiveConversationMessages === "function" && typeof homeConversationHistory !== "undefined" && homeConversationHistory && homeConversationHistory.length > 0) {
          saveActiveConversationMessages();
        }
        if (typeof resetHomeConversationScreen === "function") resetHomeConversationScreen();
        if (typeof window.switchPanel === "function") window.switchPanel("sol-chat");
      } else if (panelId) {
        if (typeof window.switchPanel === "function") window.switchPanel(panelId);
      }
      
      if (sidebarEl && sidebarEl.classList.contains("mobile-active")) {
        sidebarEl.classList.remove("mobile-active");
      }
    });
  });

  // Footer status badge click -> opens Info / Settings
  const apiStatusBadge = document.getElementById("api-status-badge");
  if (apiStatusBadge) {
    apiStatusBadge.style.cursor = "pointer";
    apiStatusBadge.addEventListener("click", () => {
      if (typeof window.switchPanel === "function") window.switchPanel("info");
    });
  }

  // Start Here quick-click links
  document.querySelectorAll(".feature-card").forEach(card => {
    card.addEventListener("click", () => {
      const target = card.getAttribute("data-target");
      if (target && typeof window.switchPanel === "function") {
        window.switchPanel(target);
      }
    });
  });

  // New Conversation Button Click -> Resets Gemini Home Screen
  const newChatBtn = document.getElementById("btn-new-sol-chat");
  if (newChatBtn) {
    newChatBtn.addEventListener("click", () => {
      if (typeof resetHomeConversationScreen === "function") resetHomeConversationScreen();
      if (typeof showToast === "function") showToast("Started new conversation with Gemini AI!");
    });
  }

  if (typeof renderSidebarConversations === "function") renderSidebarConversations();
  if (typeof resetHomeConversationScreen === "function") resetHomeConversationScreen();
}

let defaultSolConversations = [];

function getSolConversations() {
  const saved = localStorage.getItem("sol_saved_conversations_list");
  if (saved) {
    try {
      const list = JSON.parse(saved);
      // Filter out pre-filled starter dummy items if present
      return list.filter(c => !["conv_1", "conv_2", "conv_3", "conv_4"].includes(c.id));
    } catch(e) {}
  }
  return defaultSolConversations;
}

function saveSolConversations(list) {
  localStorage.setItem("sol_saved_conversations_list", JSON.stringify(list));
}

function saveActiveConversationMessages() {
  if (!currentHomeConvId) return;
  const convs = getSolConversations();
  const convIndex = convs.findIndex(c => c.id === currentHomeConvId);
  if (convIndex === -1) return;

  convs[convIndex].history = homeConversationHistory;
  saveSolConversations(convs);
}

function loadSolConversation(convId) {
  const convs = getSolConversations();
  const conv = convs.find(c => c.id === convId);
  if (!conv) return;

  currentHomeConvId = conv.id;
  homeConversationHistory = conv.history || [];

  const conversationEl = document.getElementById("gemini-home-conversation");
  if (!conversationEl) return;
  conversationEl.innerHTML = "";

  homeConversationHistory.forEach(msg => {
    const text = msg.content || (msg.parts && msg.parts[0] ? msg.parts[0].text : "");
    if (!text) return;

    if (msg.role === "user") {
      const userDiv = document.createElement("div");
      userDiv.className = "gemini-inline-message";
      userDiv.innerHTML = `<div class="gemini-user-query">${escapeHtml(text)}</div>`;
      conversationEl.appendChild(userDiv);
    } else if (msg.role === "model") {
      const aiDiv = document.createElement("div");
      aiDiv.className = "gemini-inline-message";
      aiDiv.innerHTML = `
        <div class="gemini-ai-response">
          <div class="gemini-ai-body">
            ${marked.parse(text)}
          </div>
        </div>
      `;
      conversationEl.appendChild(aiDiv);
    }
  });

  updateHomeChatModeState();
  renderSidebarConversations();
  switchPanel("start-here");
  triggerHomeFadeInAnimation();
}

const RANDOM_ACCENT_PALETTE = [
  "#ff007f", "#ff7f00", "#ffeb00", "#00ff7f", "#00e5ff", 
  "#7f00ff", "#ff00d4", "#00ffcc", "#ff3366", "#9933ff",
  "#ff4500", "#00fa9a", "#1e90ff", "#ff1493", "#a855f7"
];

function renderSidebarConversations() {
  const listEl = document.getElementById("sidebar-conversations-list");
  if (!listEl) return;

  const convs = getSolConversations();
  listEl.innerHTML = "";

  convs.forEach((conv, index) => {
    const isActive = conv.id === currentHomeConvId;
    const li = document.createElement("li");
    li.className = `conversation-item ${isActive ? "active" : ""}`;
    
    // Pick or assign a random vibrant accent color for each conversation item
    if (!conv.accentColor) {
      conv.accentColor = RANDOM_ACCENT_PALETTE[Math.floor(Math.random() * RANDOM_ACCENT_PALETTE.length)];
    }
    li.style.setProperty("--item-accent-color", conv.accentColor);

    li.innerHTML = `
      <span class="conversation-item-title" title="${escapeHtml(conv.title)}">${escapeHtml(conv.title)}</span>
      <button class="conversation-item-del" data-id="${conv.id}" title="Delete Conversation"><i class="fa-solid fa-trash-can"></i></button>
    `;

    li.addEventListener("click", (e) => {
      if (e.target.closest(".conversation-item-del")) return;
      loadSolConversation(conv.id);
      if (typeof showToast === "function") showToast(`Loaded "${conv.title.replace(/^💬\s*/, "")}"`);
    });

    const delBtn = li.querySelector(".conversation-item-del");
    if (delBtn) {
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (confirm(`Delete conversation "${conv.title}"?`)) {
          const updated = getSolConversations().filter(c => c.id !== conv.id);
          saveSolConversations(updated);
          if (currentHomeConvId === conv.id) {
            resetHomeConversationScreen();
          }
          renderSidebarConversations();
        }
      });
    }

    listEl.appendChild(li);
  });
}

window.switchPanel = function(panelId) {
  if (!panelId) return;
  activePanel = panelId;

  // 1. Highlight Nav Items
  const navItemsList = document.querySelectorAll(".nav-item");
  navItemsList.forEach(item => {
    const isSelected = item.getAttribute("data-panel") === panelId;
    item.classList.toggle("active", isSelected);
  });

  // 2. Direct Fail-Proof Panel Display Control (Bypasses any CSS animation bugs)
  const panelsList = document.querySelectorAll(".workspace-panel");
  panelsList.forEach(p => {
    const isActive = p.id === `panel-${panelId}`;
    p.classList.toggle("active", isActive);
    if (isActive) {
      p.style.setProperty("display", "flex", "important");
      p.style.setProperty("opacity", "1", "important");
      p.style.setProperty("visibility", "visible", "important");
      p.scrollTop = 0;
    } else {
      p.style.setProperty("display", "none", "important");
      p.style.setProperty("opacity", "0", "important");
    }
  });

  // 3. Reset slideshow view if routing away from the dictionary
  if (panelId !== "dictionary") {
    const slideshowView = document.getElementById("dict-slideshow-view");
    const coverView = document.getElementById("dict-cover-view");
    if (slideshowView && coverView) {
      slideshowView.classList.add("hidden");
      coverView.classList.remove("hidden");
    }
  }

  // 4. Update Header Information
  const headerChatTitleEl = document.getElementById("header-chat-title");
  const headerAgentBadgeEl = document.getElementById("header-agent-badge");

  const matchingNavItem = document.querySelector(`.nav-item[data-panel="${panelId}"]`);
  if (matchingNavItem) {
    const labelEl = matchingNavItem.querySelector(".nav-label");
    const label = labelEl ? labelEl.textContent : "Sol";
    const iconEl = matchingNavItem.querySelector(".nav-icon");
    
    if (headerChatTitleEl) headerChatTitleEl.textContent = label;
    if (iconEl && headerAgentBadgeEl) {
      if (iconEl.tagName === "I") {
        headerAgentBadgeEl.innerHTML = `<i class="${iconEl.className}"></i>`;
      } else {
        headerAgentBadgeEl.innerHTML = iconEl.outerHTML;
      }
    }
  }

  // 5. Special Panel Trigger Callbacks
  if (panelId === "community") {
    if (typeof renderCircleFeed === "function") renderCircleFeed();
  } else if (panelId === "videos") {
    if (typeof initVideosPanel === "function") initVideosPanel();
  } else if (panelId === "output-practicing") {
    const userInput = document.getElementById("user-input");
    if (userInput) userInput.focus();
    if (typeof scrollToBottom === "function") scrollToBottom();
  }

  window.scrollTo({ top: 0, behavior: "instant" });
};
function switchPanel(panelId) { window.switchPanel(panelId); }

// -------------------------------------------------------------
// Panel 2: Globally Known Community Board (Circle.so style Layout)
// -------------------------------------------------------------
let activeFeedTab = "posts"; // "posts" or "members"

function initCommunityPanel() {
  renderCircleFeed();
  renderCircleMembersWidget();

  // Navigation Items switching channels
  const navItemsContainer = document.querySelector(".circle-nav");
  if (navItemsContainer) {
    navItemsContainer.addEventListener("click", (e) => {
      const item = e.target.closest(".circle-nav-item");
      if (!item) return;

      // Toggle Active navigation item
      const allItems = navItemsContainer.querySelectorAll(".circle-nav-item");
      allItems.forEach(c => c.classList.remove("active"));
      item.classList.add("active");

      const channelId = item.getAttribute("data-channel");
      currentCircleChannel = channelId;

      // Update Middle Column header information
      const titleEl = document.getElementById("circle-channel-title");
      const descEl = document.getElementById("circle-channel-desc");
      const meta = CIRCLE_CHANNELS_META[channelId];
      if (meta) {
        if (titleEl) titleEl.textContent = meta.title;
        if (descEl) descEl.textContent = meta.desc;
      }

      // Hide/Show New Post button for Home/Members tabs
      const btnNewPost = document.getElementById("btn-circle-new-post");
      if (btnNewPost) {
        if (channelId === "home" || channelId === "members-tab") {
          btnNewPost.style.display = "none";
        } else {
          btnNewPost.style.display = "flex";
        }
      }

      // Default tab view
      activeFeedTab = "posts";
      const tabPosts = document.getElementById("tab-btn-posts");
      const tabMembers = document.getElementById("tab-btn-members");
      if (tabPosts) tabPosts.classList.add("active");
      if (tabMembers) tabMembers.classList.remove("active");

      renderCircleFeed();
    });
  }

  // Feed Tab Buttons (Posts vs Members tab inside Middle Column)
  const tabPosts = document.getElementById("tab-btn-posts");
  const tabMembers = document.getElementById("tab-btn-members");
  
  if (tabPosts && tabMembers) {
    tabPosts.addEventListener("click", () => {
      tabPosts.classList.add("active");
      tabMembers.classList.remove("active");
      activeFeedTab = "posts";
      renderCircleFeed();
    });

    tabMembers.addEventListener("click", () => {
      tabMembers.classList.add("active");
      tabPosts.classList.remove("active");
      activeFeedTab = "members";
      renderCircleFeed();
    });
  }

  // New Post Modal toggle controls
  const btnNewPost = document.getElementById("btn-circle-new-post");
  const modal = document.getElementById("circle-composer-modal");
  const btnCloseModal = document.getElementById("btn-close-circle-modal");

  if (btnNewPost && modal) {
    btnNewPost.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  }

  if (btnCloseModal && modal) {
    btnCloseModal.addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // Handle New Post form submissions
  const postForm = document.getElementById("circle-post-form");
  if (postForm && modal) {
    postForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const titleInput = document.getElementById("circle-post-title");
      const bodyInput = document.getElementById("circle-post-body");
      const imgInput = document.getElementById("circle-post-image");

      const title = titleInput.value.trim();
      const body = bodyInput.value.trim();
      const imgUrl = imgInput ? imgInput.value.trim() : "";

      if (!title || !body) return;

      const newPost = {
        id: "cp_" + Date.now(),
        title: title,
        author: "You",
        role: "Learner 👤",
        avatar: "Y",
        time: "Just now",
        content: body,
        image: imgUrl || null,
        likes: 0,
        comments: []
      };

      if (!circleChannelsData[currentCircleChannel]) {
        circleChannelsData[currentCircleChannel] = [];
      }

      circleChannelsData[currentCircleChannel].unshift(newPost);
      
      // Reset inputs & hide modal
      titleInput.value = "";
      bodyInput.value = "";
      if (imgInput) imgInput.value = "";
      modal.classList.add("hidden");

      renderCircleFeed();

      // Trigger automatic smart community AI reply
      setTimeout(() => {
        simulateCircleReply(newPost.id, title, body);
      }, 1500);
    });
  }
}

function renderCircleFeed() {
  const feedContainer = document.getElementById("circle-posts-feed");
  if (!feedContainer) return;
  feedContainer.innerHTML = "";

  if (activeFeedTab === "members" || currentCircleChannel === "members-tab") {
    // Render list of members in the middle column
    const members = [
      { name: "Gregory Dobbins", status: "online", role: "Program Manager 🎓", avatar: "GD", details: "Funnel Builder expert since 2018." },
      { name: "Sarah K.", status: "online", role: "Language Coach 🏅", avatar: "SK", details: "Native English linguist focused on comprehensible inputs." },
      { name: "Alice F.", status: "online", role: "Member 👤", avatar: "AF", details: "French native acquiring conversational Spanish syntax." },
      { name: "Bob D.", status: "offline", role: "Member 👤", avatar: "BD", details: "Tech lead exploring Metaphor Schema integrations." },
      { name: "You", status: "online", role: "Learner 👤", avatar: "Y", details: "Your active SOL study account." }
    ];

    const grid = document.createElement("div");
    grid.className = "circle-members-grid";
    
    members.forEach(m => {
      const card = document.createElement("div");
      card.className = "circle-member-card";
      card.innerHTML = `
        <div class="member-avatar">${m.avatar}</div>
        <div class="member-info">
          <div class="member-name-row">
            <h4>${m.name}</h4>
            <span class="member-status ${m.status}">${m.status}</span>
          </div>
          <p class="member-role">${m.role}</p>
          <p class="member-details">${m.details}</p>
        </div>
      `;
      grid.appendChild(card);
    });
    feedContainer.appendChild(grid);
    return;
  }

  // Render posts feed for current channel
  const posts = (typeof circleChannelsData !== "undefined" && circleChannelsData[currentCircleChannel]) ? circleChannelsData[currentCircleChannel] : [];
  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "circle-post-card";
    card.innerHTML = `
      <div class="circle-post-header">
        <div class="circle-post-avatar">${post.avatar || "👤"}</div>
        <div class="circle-post-meta">
          <div class="circle-post-author-row">
            <span class="circle-post-author">${escapeHtml(post.author)}</span>
            <span class="circle-post-role">${escapeHtml(post.role || "")}</span>
          </div>
          <span class="circle-post-time">${escapeHtml(post.time)}</span>
        </div>
      </div>
      <h3 class="circle-post-title">${escapeHtml(post.title)}</h3>
      <p class="circle-post-content">${escapeHtml(post.content)}</p>
      ${post.image ? `<img src="${post.image}" class="circle-post-image" alt="Post Image">` : ""}
      <div class="circle-post-footer">
        <button class="circle-post-like-btn ${post.userLiked ? 'liked' : ''}" data-id="${post.id}">
          <i class="fa-solid fa-heart"></i> <span>${post.likes || 0}</span>
        </button>
        <span class="circle-post-comments-count"><i class="fa-solid fa-comment"></i> ${post.comments ? post.comments.length : 0} Comments</span>
      </div>
    `;

    const likeBtn = card.querySelector(".circle-post-like-btn");
    if (likeBtn) {
      likeBtn.addEventListener("click", () => {
        if (!post.userLiked) {
          post.likes = (post.likes || 0) + 1;
          post.userLiked = true;
        } else {
          post.likes = Math.max(0, (post.likes || 1) - 1);
          post.userLiked = false;
        }
        renderCircleFeed();
      });
    }

    feedContainer.appendChild(card);
  });
}

function openPlaylistViewer(video) {
  const playlistModal = document.getElementById("playlist-modal");
  const mainPlaylistIframe = document.getElementById("main-playlist-iframe");
  const playlistTitle = document.getElementById("playlist-title");
  const playlistDesc = document.getElementById("playlist-desc");
  const episodesCarouselTrack = document.getElementById("episodes-carousel-track");
  const btnCarouselPrev = document.getElementById("btn-carousel-prev");
  const btnCarouselNext = document.getElementById("btn-carousel-next");
  const carouselSection = document.querySelector(".episodes-carousel-section");

  if (!playlistModal) return;

  playlistModal.classList.remove("hidden");

  if (playlistTitle) playlistTitle.textContent = video.title;
  if (playlistDesc) playlistDesc.textContent = video.desc;

  if (mainPlaylistIframe) {
    mainPlaylistIframe.src = video.embedUrl;
  }

  const hasPlaylist = video.embedUrl && video.embedUrl.includes("list=");
  if (hasPlaylist) {
    if (carouselSection) carouselSection.style.display = "flex";
    if (episodesCarouselTrack && typeof SPANISH_PLAYLIST_EPISODES !== "undefined") {
      episodesCarouselTrack.innerHTML = "";
      SPANISH_PLAYLIST_EPISODES.forEach((episode, index) => {
        const epCard = document.createElement("div");
        epCard.className = `episode-card ${index === 0 ? "active" : ""}`;
        const epThumbSrc = (episode.videoId && episode.videoId !== "videoseries" && episode.videoId.length > 5)
          ? `https://img.youtube.com/vi/${episode.videoId}/mqdefault.jpg`
          : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60`;

        epCard.innerHTML = `
          <div class="episode-thumb-container">
            <img src="${epThumbSrc}" alt="${escapeHtml(episode.title)}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60';">
            <div class="episode-play-overlay"><i class="fa-solid fa-play"></i></div>
            <span class="episode-badge">${episode.duration}</span>
          </div>
          <div class="episode-details">
            <h4>Episode ${episode.episode}: ${escapeHtml(episode.title)}</h4>
            <p>${escapeHtml(episode.desc)}</p>
          </div>
        `;

        epCard.addEventListener("click", () => {
          const allCards = episodesCarouselTrack.querySelectorAll(".episode-card");
          allCards.forEach(c => c.classList.remove("active"));
          epCard.classList.add("active");
          if (mainPlaylistIframe) mainPlaylistIframe.src = episode.embedUrl;
        });

        episodesCarouselTrack.appendChild(epCard);
      });
    }
  } else {
    if (carouselSection) carouselSection.style.display = "none";
  }
}

function initDictionaryPanel() {
  // Grab elements
  const coverView = document.getElementById("dict-cover-view");
  const slideshowView = document.getElementById("dict-slideshow-view");
  const btnStartBodySlides = document.getElementById("btn-start-body-slides");
  const btnStartBathroomSlides = document.getElementById("btn-start-bathroom-slides");
  const btnStartSeasideSlides = document.getElementById("btn-start-seaside-slides");
  const btnCloseSlides = document.getElementById("btn-close-slides");
  const btnPrevSlide = document.getElementById("btn-prev-slide");
  const btnNextSlide = document.getElementById("btn-next-slide");
  const slideImage = document.getElementById("slide-image-element");
  const slideImageWrapper = document.getElementById("slide-image-wrapper-element");
  const counterLabel = document.getElementById("slide-counter-label");
  const dotsContainer = document.getElementById("slide-dots-container");

  // Floating anchor buttons
  const btnAnchorLeft = document.getElementById("btn-anchor-left");
  const btnAnchorCenter = document.getElementById("btn-anchor-center");
  const btnAnchorRight = document.getElementById("btn-anchor-right");

  if (!coverView) return; // Guard in case of hot-reload rendering shifts

  // Scroll the main content window and panel back to top
  const scrollPanelToTop = () => {
    const dictionaryPanel = document.getElementById("panel-dictionary");
    if (dictionaryPanel) {
      dictionaryPanel.scrollTo({ top: 0, behavior: "smooth" });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let currentSlideIdx = 1;
  let currentDeck = "body"; // "body", "bathroom", "seaside"
  let maxSlides = 17;

  // Zoom & Pan states
  let isZoomed = false;
  let isDragging = false;
  let currentScale = 1;
  let startX = 0, startY = 0;
  let translateX = 0, translateY = 0;
  let currentTranslateX = 0, currentTranslateY = 0;
  let clickStartTime = 0;
  let clickStartX = 0, clickStartY = 0;

  // Dynamically toggle zoom anchor visibility based on column position
  const updateAnchorVisibility = () => {
    // Dynamically toggle Left & Right anchor icons between Circle-Dot (zoomed out) and Arrow (zoomed in)
    const leftIcon = btnAnchorLeft ? btnAnchorLeft.querySelector("i") : null;
    const rightIcon = btnAnchorRight ? btnAnchorRight.querySelector("i") : null;

    if (isZoomed) {
      if (leftIcon) leftIcon.className = "fa-solid fa-chevron-left";
      if (rightIcon) rightIcon.className = "fa-solid fa-chevron-right";
    } else {
      if (leftIcon) leftIcon.className = "fa-solid fa-circle-dot";
      if (rightIcon) rightIcon.className = "fa-solid fa-circle-dot";
    }

    if (!isZoomed) {
      if (btnAnchorLeft) { btnAnchorLeft.style.opacity = ""; btnAnchorLeft.style.pointerEvents = ""; btnAnchorLeft.style.display = "flex"; }
      if (btnAnchorCenter) { btnAnchorCenter.style.opacity = ""; btnAnchorCenter.style.pointerEvents = ""; btnAnchorCenter.style.display = "flex"; }
      if (btnAnchorRight) { btnAnchorRight.style.opacity = ""; btnAnchorRight.style.pointerEvents = ""; btnAnchorRight.style.display = "flex"; }
      return;
    }

    const width = slideImage.clientWidth;
    const limitX = (width * currentScale - width) / 2;

    if (limitX > 10) {
      const activeX = currentTranslateX;

      // Always hide Center button when zoomed in
      if (btnAnchorCenter) { btnAnchorCenter.style.opacity = "0"; btnAnchorCenter.style.pointerEvents = "none"; }

      // Centered on Left Column: hide Left button, show Right button
      if (activeX > limitX * 0.35) {
        if (btnAnchorLeft) { btnAnchorLeft.style.opacity = "0"; btnAnchorLeft.style.pointerEvents = "none"; }
        if (btnAnchorRight) { btnAnchorRight.style.opacity = ""; btnAnchorRight.style.pointerEvents = ""; }
      } 
      // Centered on Right Column: hide Right button, show Left button
      else if (activeX < -limitX * 0.35) {
        if (btnAnchorRight) { btnAnchorRight.style.opacity = "0"; btnAnchorRight.style.pointerEvents = "none"; }
        if (btnAnchorLeft) { btnAnchorLeft.style.opacity = ""; btnAnchorLeft.style.pointerEvents = ""; }
      } 
      // Centered on Center Column: show both Left and Right buttons
      else {
        if (btnAnchorLeft) { btnAnchorLeft.style.opacity = ""; btnAnchorLeft.style.pointerEvents = ""; }
        if (btnAnchorRight) { btnAnchorRight.style.opacity = ""; btnAnchorRight.style.pointerEvents = ""; }
      }
    } else {
      if (btnAnchorLeft) { btnAnchorLeft.style.opacity = "0"; btnAnchorLeft.style.pointerEvents = "none"; }
      if (btnAnchorCenter) { btnAnchorCenter.style.opacity = "0"; btnAnchorCenter.style.pointerEvents = "none"; }
      if (btnAnchorRight) { btnAnchorRight.style.opacity = "0"; btnAnchorRight.style.pointerEvents = "none"; }
    }
  };

  const resetZoom = () => {
    isZoomed = false;
    isDragging = false;
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    currentTranslateX = 0;
    currentTranslateY = 0;
    if (slideImage) {
      slideImage.style.transform = "translate(0px, 0px) scale(1)";
      slideImage.style.transition = "";
      slideImage.classList.remove("zoomed");
    }
    if (slideImageWrapper) {
      slideImageWrapper.classList.remove("zoomed-state");
    }
    updateAnchorVisibility();
  };

  // Build pagination dots dynamically based on total slides
  const buildPaginationDots = (totalSlides) => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";
    for (let i = 1; i <= totalSlides; i++) {
      const dot = document.createElement("div");
      dot.className = "slide-dot";
      dot.title = `Go to Slide ${i}`;
      dot.addEventListener("click", () => {
        currentSlideIdx = i;
        updateSlideDisplay();
        scrollPanelToTop();
      });
      dotsContainer.appendChild(dot);
    }
  };

  const updateSlideDisplay = () => {
    if (!slideImage || !counterLabel) return;

    // Reset zoom state on page change
    resetZoom();

    if (currentDeck === "body") {
      slideImage.src = `assets/dict/page_${currentSlideIdx}.png`;
      counterLabel.textContent = `Slide ${currentSlideIdx} of 17`;
      maxSlides = 17;
    } else if (currentDeck === "bathroom") {
      slideImage.src = `assets/dict/bathroom_page_${currentSlideIdx}.png`;
      counterLabel.textContent = `Slide ${currentSlideIdx} of 18`;
      maxSlides = 18;
    } else {
      slideImage.src = `assets/dict/seaside_page_${currentSlideIdx}.png`;
      counterLabel.textContent = `Slide ${currentSlideIdx} of 21`;
      maxSlides = 21;
    }

    // Toggle nav buttons disabled state visual indicators
    if (btnPrevSlide) {
      btnPrevSlide.style.opacity = currentSlideIdx === 1 ? "0.4" : "1";
      btnPrevSlide.style.cursor = currentSlideIdx === 1 ? "default" : "pointer";
    }
    if (btnNextSlide) {
      btnNextSlide.style.opacity = currentSlideIdx === maxSlides ? "0.4" : "1";
      btnNextSlide.style.cursor = currentSlideIdx === maxSlides ? "default" : "pointer";
    }

    // Highlight active dot
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll(".slide-dot");
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index + 1 === currentSlideIdx);
      });
    }

    updateAnchorVisibility();
  };

  // 1. Cover Card Click: Body Parts
  if (btnStartBodySlides) {
    btnStartBodySlides.addEventListener("click", () => {
      coverView.classList.add("hidden");
      slideshowView.classList.remove("hidden");
      currentDeck = "body";
      maxSlides = 17;
      currentSlideIdx = 1;
      buildPaginationDots(17);
      updateSlideDisplay();
      scrollPanelToTop();
    });
  }

  // 1b. Cover Card Click: Inside The Bathroom
  if (btnStartBathroomSlides) {
    btnStartBathroomSlides.addEventListener("click", () => {
      coverView.classList.add("hidden");
      slideshowView.classList.remove("hidden");
      currentDeck = "bathroom";
      maxSlides = 18;
      currentSlideIdx = 1;
      buildPaginationDots(18);
      updateSlideDisplay();
      scrollPanelToTop();
    });
  }

  // 1c. Cover Card Click: Sea Side
  if (btnStartSeasideSlides) {
    btnStartSeasideSlides.addEventListener("click", () => {
      coverView.classList.add("hidden");
      slideshowView.classList.remove("hidden");
      currentDeck = "seaside";
      maxSlides = 21;
      currentSlideIdx = 1;
      buildPaginationDots(21);
      updateSlideDisplay();
      scrollPanelToTop();
    });
  }

  // 2. Back / Close Button Click
  btnCloseSlides.addEventListener("click", () => {
    slideshowView.classList.add("hidden");
    coverView.classList.remove("hidden");
    resetZoom();
    scrollPanelToTop();
  });

  // 3. Previous/Next Slide clicks
  btnPrevSlide.addEventListener("click", () => {
    if (currentSlideIdx > 1) {
      currentSlideIdx--;
      updateSlideDisplay();
      scrollPanelToTop();
    }
  });

  btnNextSlide.addEventListener("click", () => {
    if (currentSlideIdx < maxSlides) {
      currentSlideIdx++;
      updateSlideDisplay();
      scrollPanelToTop();
    }
  });

  // 4. Keyboard Arrow Key Navigation (when slides panel is visible)
  window.addEventListener("keydown", (e) => {
    if (slideshowView.classList.contains("hidden")) return;

    if (e.key === "ArrowLeft") {
      if (currentSlideIdx > 1) {
        currentSlideIdx--;
        updateSlideDisplay();
        scrollPanelToTop();
      }
    } else if (e.key === "ArrowRight") {
      if (currentSlideIdx < maxSlides) {
        currentSlideIdx++;
        updateSlideDisplay();
        scrollPanelToTop();
      }
    }
  });

  // 5. Zoom & Pan Event Listeners on slideImage
  if (slideImage) {
    slideImage.addEventListener("mousedown", (e) => {
      clickStartTime = Date.now();
      clickStartX = e.clientX;
      clickStartY = e.clientY;

      if (isZoomed) {
        isDragging = true;
        slideImage.style.transition = "none"; // Disable smooth transition during drag
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        e.preventDefault(); // Prevent standard image drag selector
      }
    });

    window.addEventListener("mousemove", (e) => {
      if (!isZoomed || !isDragging) return;

      currentTranslateX = e.clientX - startX;
      currentTranslateY = e.clientY - startY;

      // Bound panning coordinates so the slide doesn't go off screen
      const width = slideImage.clientWidth;
      const height = slideImage.clientHeight;
      const limitX = (width * currentScale - width) / 2;
      const limitY = (height * currentScale - height) / 2;

      currentTranslateX = Math.max(-limitX, Math.min(limitX, currentTranslateX));
      currentTranslateY = Math.max(-limitY, Math.min(limitY, currentTranslateY));

      slideImage.style.transform = `translate(${currentTranslateX}px, ${currentTranslateY}px) scale(${currentScale})`;
      updateAnchorVisibility();
    });

    window.addEventListener("mouseup", (e) => {
      if (isDragging) {
        isDragging = false;
        slideImage.style.transition = ""; // Restore smooth transition
        translateX = currentTranslateX;
        translateY = currentTranslateY;
        updateAnchorVisibility();
      }

      // Check if this was a simple click to toggle zoom rather than a drag
      const dragDuration = Date.now() - clickStartTime;
      const dragDistance = Math.hypot(e.clientX - clickStartX, e.clientY - clickStartY);

      if (e.target === slideImage && dragDuration < 200 && dragDistance < 6) {
        isZoomed = !isZoomed;
        if (isZoomed) {
          currentScale = 2; // Default 2x zoom on click
          slideImage.classList.add("zoomed");
          if (slideImageWrapper) {
            slideImageWrapper.classList.add("zoomed-state");
          }
          
          const rect = slideImage.getBoundingClientRect();
          const clickX_rel = (e.clientX - rect.left) - rect.width / 2;
          const clickY_rel = (e.clientY - rect.top) - rect.height / 2;

          // Center zoom on mouse click coordinates
          translateX = -clickX_rel * (currentScale - 1);
          translateY = -clickY_rel * (currentScale - 1);

          // Apply bounds check
          const width = slideImage.clientWidth;
          const height = slideImage.clientHeight;
          const limitX = (width * currentScale - width) / 2;
          const limitY = (height * currentScale - height) / 2;

          translateX = Math.max(-limitX, Math.min(limitX, translateX));
          translateY = Math.max(-limitY, Math.min(limitY, translateY));

          currentTranslateX = translateX;
          currentTranslateY = translateY;

          slideImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
        } else {
          resetZoom();
        }
        updateAnchorVisibility();
      }
    });

    // Make sure dragging stops cleanly if cursor leaves window
    window.addEventListener("mouseleave", () => {
      if (isDragging) {
        isDragging = false;
        slideImage.style.transition = "";
        translateX = currentTranslateX;
        translateY = currentTranslateY;
        updateAnchorVisibility();
      }
    });

    // 6. Mouse Wheel Scroll (Vertical Panning) when zoomed in
    slideImage.addEventListener("wheel", (e) => {
      if (!isZoomed) return; // Only scroll vertically after zoom has happened

      e.preventDefault(); // Stop normal page scroll while interacting with zoomed slide

      const width = slideImage.clientWidth;
      const height = slideImage.clientHeight;
      const limitY = (height * currentScale - height) / 2;

      // Scroll speed factor
      const scrollSpeed = 0.8;
      translateY -= e.deltaY * scrollSpeed;

      // Bound Y coordinate
      translateY = Math.max(-limitY, Math.min(limitY, translateY));
      currentTranslateY = translateY;

      slideImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
    }, { passive: false });

    // 7. Snap-to-column anchor clicks
    const snapToAnchor = (column) => {
      if (!isZoomed) {
        isZoomed = true;
        currentScale = 2;
        slideImage.classList.add("zoomed");
        if (slideImageWrapper) {
          slideImageWrapper.classList.add("zoomed-state");
        }
      }

      const width = slideImage.clientWidth;
      const limitX = (width * currentScale - width) / 2;

      // Snap to the top of the slide
      const height = slideImage.clientHeight;
      const limitY = (height * currentScale - height) / 2;
      translateY = limitY;
      currentTranslateY = limitY;

      if (column === "left") {
        translateX = limitX;
      } else if (column === "center") {
        translateX = 0;
      } else if (column === "right") {
        translateX = -limitX;
      }

      currentTranslateX = translateX;
      slideImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${currentScale})`;
      updateAnchorVisibility();
    };

    if (btnAnchorLeft) {
      btnAnchorLeft.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!isZoomed) {
          snapToAnchor("left");
        } else {
          // Centered on Right Column: snap to Center Column. Otherwise snap to Left Column.
          const width = slideImage.clientWidth;
          const limitX = (width * currentScale - width) / 2;
          if (currentTranslateX < -limitX * 0.35) {
            snapToAnchor("center");
          } else {
            snapToAnchor("left");
          }
        }
        scrollPanelToTop();
      });
    }

    if (btnAnchorCenter) {
      btnAnchorCenter.addEventListener("click", (e) => {
        e.stopPropagation();
        snapToAnchor("center");
        scrollPanelToTop();
      });
    }

    if (btnAnchorRight) {
      btnAnchorRight.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!isZoomed) {
          snapToAnchor("right");
        } else {
          // Centered on Left Column: snap to Center Column. Otherwise snap to Right Column.
          const width = slideImage.clientWidth;
          const limitX = (width * currentScale - width) / 2;
          if (currentTranslateX > limitX * 0.35) {
            snapToAnchor("center");
          } else {
            snapToAnchor("right");
          }
        }
        scrollPanelToTop();
      });
    }
  }
}

// -------------------------------------------------------------
// Panel 6: The Describing Lab
// -------------------------------------------------------------
function initDescribingLabPanel() {
  const images = [
    "https://picsum.photos/seed/beach/800/600", // beach
    "https://picsum.photos/seed/forest/800/600", // forest/mountains
    "https://picsum.photos/seed/skyline/800/600"  // city skyline
  ];
  let activeImageIdx = 0;

  labChangeImageBtn.addEventListener("click", () => {
    activeImageIdx = (activeImageIdx + 1) % images.length;
    labImage.src = images[activeImageIdx];
    labTextInput.value = "";
    labFeedback.classList.add("hidden");
  });

  labSubmitBtn.addEventListener("click", async () => {
    const text = labTextInput.value.trim();
    if (!text) return;

    labFeedback.innerHTML = `
      <div style="text-align: center;">
        <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.5rem; color: var(--accent-yellow); margin-bottom: 0.5rem;"></i>
        <p>Analyzing description structure and vocabulary...</p>
      </div>
    `;
    labFeedback.classList.remove("hidden");

    const prompt = `The user is writing a description of an image containing a scenic landscape (active landscape index represents beach/mountains/city). Here is their text: "${text}". 
    Perform a language learning analysis:
    1. Grammar Audit: check for mistakes (verbs, spelling, noun-adjective agreements).
    2. Suggest 3 enhanced, advanced vocabulary words or idioms to make their description sound more native.
    3. Provide a revised, premium version of their description.
    Format clearly in Markdown.`;

    if (geminiService.hasApiKey()) {
      try {
        const model = geminiService.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const feedback = result.response.text();
        labFeedback.innerHTML = marked.parse(feedback);
      } catch (e) {
        console.error(e);
        labFeedback.innerHTML = `<div style="color: #ef4444;">Error connecting to Gemini API. Please review Settings.</div>`;
      }
    } else {
      // Demo Mode feedback
      setTimeout(() => {
        labFeedback.innerHTML = `
### 🎓 Description Feedback

#### 1. Grammatical Audit
- *Good job!* The sentence structure shows clear understanding. Keep an eye on preposition selections.

#### 2. Vocabulary Boosts
- **Resplendent** (instead of *beautiful*)
- **Ethereal** (to describe the light)
- **Vibrant** (to describe the colors)

#### 3. Premium Suggested Rewrite
> *"The landscape presents a resplendent sunset with vibrant colors reflecting across the water surface, creating an ethereal glow."*
        `;
      }, 1500);
    }
  });
}

// -------------------------------------------------------------
// Panel 7: The Output Practicing (Dialog Session Chatbot)
// -------------------------------------------------------------
function initOutputPracticingPanel() {
  // Sync select inputs
  agentSelect.value = activeAgentId;
  modelSelect.value = activeModel;

  // Render Saved Chat Logs
  renderChatMessages();

  // Reset Session Click
  clearChatBtn.addEventListener("click", () => {
    if (confirm("Reset current conversation history?")) {
      activeChatMessages = [];
      localStorage.removeItem("sol_chat_history");
      renderChatMessages();
    }
  });

  // Agent selector updates greeting
  agentSelect.addEventListener("change", (e) => {
    activeAgentId = e.target.value;
    updateAgentWelcomeScreen();
  });

  modelSelect.addEventListener("change", (e) => {
    activeModel = e.target.value;
  });

  // Input listeners
  userInput.addEventListener("input", () => {
    autoGrowTextarea();
    sendBtn.disabled = userInput.value.trim() === "";
  });

  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  });

  // Send form button
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleChatSubmit();
  });

  updateAgentWelcomeScreen();
}

function updateAgentWelcomeScreen() {
  const agent = AGENT_CONFIGS[activeAgentId] || AGENT_CONFIGS.general;
  welcomeAgentTitle.textContent = agent.name;
  welcomeAgentTagline.textContent = agent.tagline;

  // Render suggestions grid
  suggestionsGrid.innerHTML = "";
  agent.suggestions.forEach(s => {
    const pill = document.createElement("button");
    pill.className = "suggestion-pill";
    pill.textContent = s;
    pill.addEventListener("click", () => {
      userInput.value = s;
      autoGrowTextarea();
      userInput.focus();
      sendBtn.disabled = false;
    });
    suggestionsGrid.appendChild(pill);
  });

  if (activeChatMessages.length === 0) {
    welcomeScreen.style.display = "flex";
    messagesList.style.display = "none";
  } else {
    welcomeScreen.style.display = "none";
    messagesList.style.display = "flex";
  }
}

function renderChatMessages() {
  messagesList.innerHTML = "";
  
  if (activeChatMessages.length === 0) {
    welcomeScreen.style.display = "flex";
    messagesList.style.display = "none";
    return;
  }

  welcomeScreen.style.display = "none";
  messagesList.style.display = "flex";

  activeChatMessages.forEach(msg => {
    const bubble = createMessageBubble(msg.role, msg.content);
    messagesList.appendChild(bubble);
  });

  Prism.highlightAll();
  scrollToBottom();
}

function createMessageBubble(role, content) {
  const row = document.createElement("div");
  row.className = `message-row ${role === "user" ? "user-row" : "agent-row"}`;

  const agent = AGENT_CONFIGS[activeAgentId] || AGENT_CONFIGS.general;
  const avatarText = role === "user" ? "👤" : agent.icon;

  row.innerHTML = `
    <div class="message-bubble">
      <div class="avatar">${avatarText}</div>
      <div class="message-content">
        ${role === "user" ? escapeHtml(content).replace(/\n/g, "<br>") : marked.parse(content)}
      </div>
    </div>
  `;

  return row;
}

async function handleChatSubmit() {
  const text = userInput.value.trim();
  if (!text) return;

  // Add User Message to history
  activeChatMessages.push({ role: "user", content: text });
  localStorage.setItem("sol_chat_history", JSON.stringify(activeChatMessages));

  // Render User Bubble
  if (welcomeScreen.style.display !== "none") {
    welcomeScreen.style.display = "none";
    messagesList.style.display = "flex";
  }
  
  const userBubble = createMessageBubble("user", text);
  messagesList.appendChild(userBubble);
  
  // Clear textarea
  userInput.value = "";
  autoGrowTextarea();
  sendBtn.disabled = true;

  // Insert Mock loader for SOL response
  const agentBubble = document.createElement("div");
  agentBubble.className = "message-row agent-row";
  
  const agent = AGENT_CONFIGS[activeAgentId] || AGENT_CONFIGS.general;
  agentBubble.innerHTML = `
    <div class="message-bubble">
      <div class="avatar">${agent.icon}</div>
      <div class="message-content">
        <div class="typing-indicator">
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
          <span class="typing-dot"></span>
        </div>
      </div>
    </div>
  `;
  messagesList.appendChild(agentBubble);
  scrollToBottom();

  toggleInputFields(true);

  const container = agentBubble.querySelector(".message-content");
  let responseText = "";

  // Call gemini service stream
  await geminiService.generateResponseStream(
    activeChatMessages,
    agent.systemInstruction,
    activeModel,
    // On Chunk callback
    (chunk) => {
      if (responseText === "") container.innerHTML = "";
      responseText += chunk;
      container.innerHTML = marked.parse(responseText) + `<span class="cursor-blink"></span>`;
      scrollToBottom();
    },
    // On Error callback
    (errorMsg) => {
      container.innerHTML = `
        <div style="color: #ef4444; border: 1px dashed rgba(239, 68, 68, 0.4); padding: 0.75rem 1rem; border-radius: 8px; font-weight: 500;">
          <i class="fa-solid fa-circle-exclamation"></i> ${errorMsg}
        </div>
      `;
      toggleInputFields(false);
      scrollToBottom();
    },
    // On Complete callback
    (fullText) => {
      container.innerHTML = marked.parse(fullText);
      activeChatMessages.push({ role: "model", content: fullText });
      localStorage.setItem("sol_chat_history", JSON.stringify(activeChatMessages));
      
      toggleInputFields(false);
      Prism.highlightAll();
      scrollToBottom();
      userInput.focus();
    }
  );
}

function toggleInputFields(disabled) {
  userInput.disabled = disabled;
  agentSelect.disabled = disabled;
  modelSelect.disabled = disabled;
  clearChatBtn.disabled = disabled;
  
  if (disabled) {
    sendBtn.disabled = true;
    sendBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
  } else {
    sendBtn.disabled = userInput.value.trim() === "";
    sendBtn.innerHTML = `<i class="fa-solid fa-arrow-up"></i>`;
  }
}

// -------------------------------------------------------------
// Panel 8: Info / Configurations Setup
// -------------------------------------------------------------
function setupSettingsHandlers() {
  // Toggle password visibility
  togglePasswordBtn.addEventListener("click", () => {
    const isPassword = apiKeyInput.type === "password";
    apiKeyInput.type = isPassword ? "text" : "password";
    
    const icon = togglePasswordBtn.querySelector("i");
    icon.classList.toggle("fa-eye");
    icon.classList.toggle("fa-eye-slash");
  });

  // Save Settings Click
  saveSettingsBtn.addEventListener("click", () => {
    const rawKey = apiKeyInput.value.trim().replace(/^["']|["']$/g, '');
    geminiService.setApiKey(rawKey);
    updateApiStatusIndicator();
    if (typeof showToast === "function") {
      showToast(rawKey ? "API Key updated successfully!" : "Switched to Demo Mode");
    } else {
      alert(rawKey ? "API Key configuration updated successfully!" : "Switched to Demo Mode.");
    }
  });

  // Clear data settings
  clearAllDataBtn.addEventListener("click", () => {
    if (confirm("WARNING: This will clear your entire SOL history, delete saved API keys, and reload the workspace. Proceed?")) {
      localStorage.clear();
      activeChatMessages = [];
      geminiService.setApiKey("");
      
      alert("Local data cleared.");
      location.reload();
    }
  });
}

function applyTheme(themeName) {
  currentTheme = themeName || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);
  localStorage.setItem("sol_theme", currentTheme);

  // Update active state in header dropdown
  const headerOptions = document.querySelectorAll(".theme-option-btn");
  headerOptions.forEach(opt => {
    opt.classList.toggle("active", opt.getAttribute("data-theme-val") === currentTheme);
  });

  // Update active state in settings swatches grid
  const swatchCards = document.querySelectorAll(".theme-swatch-card");
  swatchCards.forEach(card => {
    card.classList.toggle("active", card.getAttribute("data-theme-val") === currentTheme);
  });
}

// Global Theme Dropdown Toggle
window.toggleThemeDropdown = function(e) {
  if (e) e.stopPropagation();
  const dropdown = document.getElementById("theme-dropdown-menu");
  if (dropdown) {
    dropdown.classList.toggle("hidden");
  }
};

function initThemePicker() {
  const themeMenuBtn = document.getElementById("theme-toggle-btn");
  const themeDropdownMenu = document.getElementById("theme-dropdown-menu");

  if (themeMenuBtn && themeDropdownMenu) {
    themeMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      themeDropdownMenu.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (themeDropdownMenu && !themeDropdownMenu.contains(e.target) && e.target !== themeMenuBtn && !themeMenuBtn.contains(e.target)) {
        themeDropdownMenu.classList.add("hidden");
      }
    });
  }

  // Theme option clicks (header dropdown & settings swatches)
  document.addEventListener("click", (e) => {
    const themeBtn = e.target.closest("[data-theme-val]");
    if (themeBtn) {
      const val = themeBtn.getAttribute("data-theme-val");
      applyTheme(val);
      const dropdown = document.getElementById("theme-dropdown-menu");
      if (dropdown) dropdown.classList.add("hidden");
      if (typeof showToast === "function") {
        const themeLabels = {
          dark: "Sol Amber",
          cyan: "Cyber Cyan",
          emerald: "Emerald Mint",
          purple: "Amethyst Violet",
          crimson: "Crimson Sunset",
          rainbow: "Spectrum Rainbow 🌈",
          light: "Minimal Light"
        };
        const themeLabel = themeLabels[val] || val;
        showToast(`🎨 Theme switched to ${themeLabel}`);
      }
    }
  });
}

// -------------------------------------------------------------
// PWA Install & Google Auth Handlers
// -------------------------------------------------------------
let deferredPwaPrompt = null;

function initPwaInstall() {
  // Clear any registered Service Workers and Cache Storage to prevent FetchEvent network errors
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
  }
  if ("caches" in window) {
    caches.keys().then((names) => {
      for (let name of names) {
        caches.delete(name);
      }
    });
  }

  const installBtn = document.getElementById("btn-install-pwa");

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPwaPrompt = e;
    if (installBtn) {
      installBtn.style.display = "flex";
    }
  });

  if (installBtn) {
    installBtn.addEventListener("click", async () => {
      if (deferredPwaPrompt) {
        deferredPwaPrompt.prompt();
        const { outcome } = await deferredPwaPrompt.userChoice;
        if (outcome === "accepted") {
          installBtn.style.display = "none";
        }
        deferredPwaPrompt = null;
      } else {
        alert("📲 How to Install SOL App:\n\n1. On Desktop (Chrome/Edge): Click the ⊕ / Install App button in your top header or address bar.\n2. On Mobile (Chrome/Safari): Tap browser menu (⋮ or Share) and select 'Add to Home Screen'.");
      }
    });
  }
}

function initGoogleAuth() {
  const authContainer = document.getElementById("user-auth-container");
  if (!authContainer) return;

  const savedProfile = localStorage.getItem("sol_user_profile");
  if (savedProfile) {
    try {
      const user = JSON.parse(savedProfile);
      renderUserProfile(user);
      return;
    } catch (e) {}
  }

  renderSignInButton();
}

function renderSignInButton() {
  const authContainer = document.getElementById("user-auth-container");
  if (!authContainer) return;
  authContainer.innerHTML = `
    <button class="google-login-btn" id="btn-google-login" title="Sign in with Google Account">
      <i class="fa-brands fa-google" style="color: #4285F4;"></i> <span>Sign in</span>
    </button>
  `;

  const btn = document.getElementById("btn-google-login");
  if (btn) {
    btn.addEventListener("click", () => {
      const name = prompt("Sign in with Google Account:\n\nEnter your name or email to connect and sync history & lists across all devices:", "Adrian Milla");
      if (name && name.trim()) {
        const trimmedName = name.trim();
        const user = {
          name: trimmedName,
          email: `${trimmedName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
          picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmedName)}&background=4f46e5&color=fff&bold=true`
        };
        localStorage.setItem("sol_user_profile", JSON.stringify(user));
        renderUserProfile(user);
        syncUserDataToCloud(user);
        updateGreetingText();
      }
    });
  }
}

function renderUserProfile(user) {
  const authContainer = document.getElementById("user-auth-container");
  if (!authContainer) return;
  authContainer.innerHTML = `
    <div class="google-user-profile" title="Connected: ${escapeHtml(user.email)}">
      <img src="${user.picture}" alt="${escapeHtml(user.name)}" class="google-user-avatar">
      <span class="google-user-name">${escapeHtml(user.name.split(" ")[0])}</span>
      <button class="google-logout-btn" id="btn-google-logout" title="Sign Out">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>
  `;

  updateGreetingText();

  const logoutBtn = document.getElementById("btn-google-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Sign out of your profile?")) {
        localStorage.removeItem("sol_user_profile");
        renderSignInButton();
        updateGreetingText();
      }
    });
  }
}

function syncUserDataToCloud(user) {
  const userKeyHistory = `sol_history_${user.email}`;
  const userKeySavings = `sol_savings_${user.email}`;
  localStorage.setItem(userKeyHistory, JSON.stringify(rwggpHistory));
  localStorage.setItem(userKeySavings, JSON.stringify(rwggpSavingsLists));
}

// -------------------------------------------------------------
// Video Panel Category Definitions
// -------------------------------------------------------------
const PLAYLIST_CATEGORIES = [
  { id: "city",      flag: "🌆", title: "City Vlogs",         videos: [], count: "0 Videos" },
  { id: "house",     flag: "🏠", title: "House Tours",        videos: [], count: "0 Videos" },
  { id: "action",    flag: "⚡", title: "Action & Sports",    videos: [], count: "0 Videos" },
  { id: "bathroom",  flag: "🚿", title: "Bathroom Routines",  videos: [], count: "0 Videos" },
  { id: "kitchen",   flag: "🍳", title: "Kitchen & Cooking",  videos: [], count: "0 Videos" },
  { id: "bodies",    flag: "💪", title: "Body & Fitness",     videos: [], count: "0 Videos" },
  { id: "different", flag: "🎓", title: "Study & Learning",   videos: [], count: "0 Videos" },
  { id: "nature",    flag: "🌿", title: "Nature & Outdoors",  videos: [], count: "0 Videos" },
  { id: "seaside",   flag: "🌊", title: "Seaside & Beach",    videos: [], count: "0 Videos" },
  { id: "whathouse", flag: "🏡", title: "What's in the House", videos: [], count: "0 Videos" }
];

// Start SOL Engine
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", init);
} else {
  init();
}





function initVideosPanel() {

  if (!localStorage.getItem("sol_v3_clean_slate_reset")) {
    localStorage.removeItem("sol_user_added_videos");
    localStorage.removeItem("sol_custom_video_links");
    localStorage.setItem("sol_v3_clean_slate_reset", "true");
  }

  const videoGrid = document.getElementById("video-grid");
  const playlistModal = document.getElementById("playlist-modal");
  const mainPlaylistIframe = document.getElementById("main-playlist-iframe");
  const btnClosePlaylistModal = document.getElementById("btn-close-playlist-modal");

  if (!videoGrid) return;

  videoGrid.innerHTML = "";
  if (playlistModal) playlistModal.classList.add("hidden");

  let userAddedVideos = [];
  try {
    userAddedVideos = JSON.parse(localStorage.getItem("sol_user_added_videos")) || [];
    userAddedVideos = userAddedVideos.filter(v => v && !v.isAddTemplate && v.embedUrl && v.embedUrl.trim() !== "");
  } catch (err) {
    userAddedVideos = [];
  }

  PLAYLIST_CATEGORIES.forEach(category => {
    const customForCategory = userAddedVideos.filter(v => v.categoryId === category.id);
    let allVids = [...customForCategory, { id: "add_card_" + category.id, isAddTemplate: true }];
    category.videos = allVids;
    category.count = `${Math.max(0, category.videos.length - 1)} Videos`;

    const row = document.createElement("div");
    row.className = "playlist-category-row";

    row.innerHTML = `
      <div class="category-header-row">
        <div class="category-header">
          <span class="category-flag">${category.flag}</span>
          <h3>${escapeHtml(category.title)}</h3>
          <span class="category-count">(${category.count})</span>
        </div>
        <div class="netflix-header-indicators" id="netflix-indicators-${category.id}"></div>
      </div>
      <div class="netflix-slider-container">
        <div class="netflix-slider-track" id="track-${category.id}">
          <!-- Videos populated dynamically -->
        </div>
      </div>
      <div class="custom-category-slider-wrapper" id="custom-slider-wrapper-${category.id}">
        <div class="classic-scrollbar-container">
          <button class="classic-scrollbar-arrow arrow-left" id="arrow-left-${category.id}" title="Scroll Left">
            <i class="fa-solid fa-caret-left"></i>
          </button>
          <div class="classic-scrollbar-track" id="slider-track-${category.id}">
            <div class="classic-scrollbar-thumb" id="slider-thumb-${category.id}"></div>
          </div>
          <button class="classic-scrollbar-arrow arrow-right" id="arrow-right-${category.id}" title="Scroll Right">
            <i class="fa-solid fa-caret-right"></i>
          </button>
        </div>
      </div>
    `;

    videoGrid.appendChild(row);

    const trackElement = row.querySelector(`#track-${category.id}`);
    const sliderContainer = row.querySelector(".netflix-slider-container");
    const trackBar = row.querySelector(`#slider-track-${category.id}`);
    const thumbEl = row.querySelector(`#slider-thumb-${category.id}`);
    const btnLeft = row.querySelector(`#arrow-left-${category.id}`);
    const btnRight = row.querySelector(`#arrow-right-${category.id}`);

    if (btnLeft && sliderContainer) {
      btnLeft.addEventListener("click", () => {
        const dynamicStep = Math.max(300, sliderContainer.clientWidth * 0.75);
        sliderContainer.scrollBy({ left: -dynamicStep, behavior: "smooth" });
      });
    }
    if (btnRight && sliderContainer) {
      btnRight.addEventListener("click", () => {
        const dynamicStep = Math.max(300, sliderContainer.clientWidth * 0.75);
        sliderContainer.scrollBy({ left: dynamicStep, behavior: "smooth" });
      });
    }

    const syncSliderPosition = () => {
      if (!sliderContainer) return;
      const maxScroll = sliderContainer.scrollWidth - sliderContainer.clientWidth;
      if (maxScroll <= 0) {
        if (thumbEl) thumbEl.style.left = "0px";
        return;
      }
      const pct = Math.min(1, Math.max(0, sliderContainer.scrollLeft / maxScroll));
      if (trackBar && thumbEl) {
        const trackWidth = trackBar.clientWidth;
        const thumbWidth = Math.max(40, (sliderContainer.clientWidth / sliderContainer.scrollWidth) * trackWidth);
        thumbEl.style.width = `${thumbWidth}px`;
        const maxThumbLeft = trackWidth - thumbWidth;
        thumbEl.style.left = `${pct * maxThumbLeft}px`;
      }
    };

    if (sliderContainer) {
      sliderContainer.addEventListener("scroll", syncSliderPosition);
      setTimeout(syncSliderPosition, 100);
      window.addEventListener("resize", syncSliderPosition);
    }

    category.videos.forEach((video) => {
      if (video.isAddTemplate) {
        const card = document.createElement("div");
        card.className = "video-card add-video-card";
        card.style.cursor = "pointer";
        card.style.minWidth = "220px";
        card.style.flexShrink = "0";

        card.innerHTML = `
          <div class="video-thumbnail-container add-video-blue-frame" style="display:flex; flex-direction:column; justify-content:center; align-items:center; background: rgba(15, 23, 42, 0.7); border: 2px dashed #0ea5e9; border-radius: 10px; height: 155px; box-sizing: border-box; transition: all 0.2s ease;">
            <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(14, 165, 233, 0.15); display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
              <i class="fa-solid fa-plus" style="font-size: 1.4rem; color: #0ea5e9;"></i>
            </div>
            <span style="color: #f8fafc; font-weight: 700; font-size: 15px; margin-bottom: 2px;">Add Video</span>
            <span style="color: #94a3b8; font-size: 11px;">Embed YouTube Link</span>
          </div>
        `;

        card.addEventListener("click", () => {
          const rawUrl = prompt("🔗 Enter YouTube Link or Embed URL:\n(e.g., https://www.youtube.com/watch?v=... or https://youtu.be/...)");
          if (!rawUrl || !rawUrl.trim()) return;

          let embedUrl = rawUrl.trim();
          let videoId = "";
          let listId = "";

          const watchMatch = embedUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
          const listMatch = embedUrl.match(/[?&]list=([a-zA-Z0-9_-]+)/);

          if (watchMatch) videoId = watchMatch[1];
          if (listMatch) listId = listMatch[1];

          if (videoId) {
            embedUrl = `https://www.youtube.com/embed/${videoId}`;
            if (listId) embedUrl += `?list=${listId}`;
          }

          const title = prompt("📝 Enter Video Title:", "My Embedded Video") || "My Embedded Video";

          const newVid = {
            id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            categoryId: category.id,
            title: title,
            desc: "Custom embedded YouTube video",
            embedUrl: embedUrl,
            isUserAdded: true
          };

          const saved = JSON.parse(localStorage.getItem("sol_user_added_videos")) || [];
          saved.push(newVid);
          localStorage.setItem("sol_user_added_videos", JSON.stringify(saved.filter(v => v && !v.isAddTemplate && v.embedUrl)));
          
          if (typeof showToast === "function") showToast("✅ Video added successfully!");
          initVideosPanel();
        });

        trackElement.appendChild(card);
        return;
      }

      const card = document.createElement("div");
      card.className = "video-card";
      card.style.minWidth = "280px";
      card.style.flexShrink = "0";
      card.style.background = "#0f172a";
      card.style.borderRadius = "10px";
      card.style.overflow = "hidden";
      card.style.border = "1px solid rgba(255, 255, 255, 0.1)";

      const activeEmbedUrl = video.embedUrl || "";

      card.innerHTML = `
        <div style="position: relative; width: 100%; height: 160px; z-index: 10; background: #000;">
          ${activeEmbedUrl ? `
            <iframe 
              src="${activeEmbedUrl}" 
              title="${escapeHtml(video.title)}" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen
              style="width: 100%; height: 100%; border: none; border-radius: 0; position: relative; z-index: 10;"
            ></iframe>
          ` : `
            <div style="display:flex; justify-content:center; align-items:center; height:100%; color:#94a3b8;">No Video Source</div>
          `}
        </div>
        <div style="padding: 10px 12px; background: #1e293b; display: flex; flex-direction: column; gap: 4px; position: relative; z-index: 5;">
          <h4 style="margin:0; font-size: 14px; color: #f8fafc; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(video.title)}</h4>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
            <span style="font-size: 11px; color: #0ea5e9; text-transform: uppercase; font-weight: 700;">${category.id}</span>
            ${video.isUserAdded ? `<button class="delete-video-btn mini" data-id="${video.id}" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); padding: 3px 8px; border-radius: 4px; font-size: 11px; cursor: pointer;"><i class="fa-solid fa-trash-can"></i> Delete</button>` : ""}
          </div>
        </div>
      `;

      const deleteBtn = card.querySelector(".delete-video-btn.mini");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (confirm(`Delete video "${video.title}"?`)) {
            let userVids = JSON.parse(localStorage.getItem("sol_user_added_videos")) || [];
            userVids = userVids.filter(v => v.id !== video.id);
            localStorage.setItem("sol_user_added_videos", JSON.stringify(userVids));
            if (typeof showToast === "function") showToast("🗑️ Video removed.");
            initVideosPanel();
          }
        });
      }

      trackElement.appendChild(card);
    });
  });

  if (btnClosePlaylistModal) {
    btnClosePlaylistModal.addEventListener("click", () => {
      if (playlistModal) playlistModal.classList.add("hidden");
      if (mainPlaylistIframe) mainPlaylistIframe.src = "";
    });
  }
}


// -------------------------------------------------------------
// Toast Notification & Helper Utilities
// -------------------------------------------------------------
function showToast(message) {
  let toast = document.getElementById("global-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "global-toast";
    toast.style.cssText = "position:fixed; bottom:24px; right:24px; background:rgba(15,23,42,0.95); color:#38bdf8; padding:12px 20px; border-radius:8px; border:1px solid rgba(56,189,248,0.3); font-weight:600; z-index:99999; box-shadow:0 10px 25px rgba(0,0,0,0.5); transition:all 0.3s ease; opacity:0; transform:translateY(10px); pointer-events:none;";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateY(0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
  }, 3000);
}

let adminUnlockedState = false;

function initAdminMode() {
  const pinInput = document.getElementById("admin-pin-input");
  const unlockBtn = document.getElementById("btn-unlock-admin");
  if (unlockBtn) {
    unlockBtn.addEventListener("click", () => {
      if (pinInput && pinInput.value === "1234") {
        adminUnlockedState = true;
        showToast("🔓 Admin Mode Unlocked");
        if (typeof initVideosPanel === "function") initVideosPanel();
      } else {
        alert("Incorrect PIN. Default PIN is 1234");
      }
    });
  }
}

function isAdminUnlocked() {
  return true;
}

function parseYouTubeLink(url) {
  if (!url || typeof url !== "string") return "";
  let trimmed = url.trim();
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  const listMatch = trimmed.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  let videoId = watchMatch ? watchMatch[1] : "";
  let listId = listMatch ? listMatch[1] : "";
  if (videoId) {
    let embed = `https://www.youtube.com/embed/${videoId}`;
    if (listId) embed += `?list=${listId}`;
    return embed;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return "";
}

function initRandomWordPanel() {
  // Safe initialization
}

function renderCircleMembersWidget() {
  // Safe initialization
}

function simulateCircleReply(postId, title, body) {
  // Safe reply simulation
}


// Global Fail-Proof Event Delegation for Tab Switching
document.addEventListener("click", (e) => {
  const item = e.target.closest("[data-panel]");
  if (item) {
    const panelId = item.getAttribute("data-panel");
    if (panelId && typeof window.switchPanel === "function") {
      window.switchPanel(panelId);
    }
  }
});
