function cleanGeminiResponse(rawText) {
  if (!rawText) return "";

  // 1. If response contains Drafting response: "...", extract clean final text
  let cleaned = rawText;
  if (cleaned.includes("Drafting response:")) {
    const parts = cleaned.split("Drafting response:");
    cleaned = parts[parts.length - 1];
  }

  // 2. Filter lines to remove meta thoughts, prompt echoes, and instruction lists
  const lines = cleaned.split("\n");
  const cleanLines = lines.filter(line => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    if (/^The user /i.test(trimmed)) return false;
    if (/^plaintext/i.test(trimmed)) return false;
    if (/Copy code/i.test(trimmed)) return false;
    if (/^\*\s*/.test(trimmed)) return false;
    if (/^-\s*/.test(trimmed)) return false;
    if (/^Drafting/i.test(trimmed)) return false;
    if (/^Acknowledge/i.test(trimmed)) return false;
    if (/^Offer assistance/i.test(trimmed)) return false;
    if (/^Keep it/i.test(trimmed)) return false;
    if (/^```/.test(trimmed)) return false;
    return true;
  });

  if (cleanLines.length > 0) {
    const lastLine = cleanLines[cleanLines.length - 1].trim();
    return lastLine.replace(/^["']|["']$/g, '');
  }

  return rawText.replace(/^["'\s]+|["'\s]+$/g, '');
}

export class GeminiService {
  constructor() {
    this.apiKey = localStorage.getItem("gemini_api_key") || "";
    this.genAI = null;
    this.initGenAI();
  }

  async initGenAI() {
    if (this.apiKey) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        this.genAI = new GoogleGenerativeAI(this.apiKey);
      } catch (e) {
        console.error("Failed to load Gemini SDK:", e);
      }
    }
  }

  async setApiKey(key) {
    this.apiKey = key.trim();
    if (this.apiKey) {
      localStorage.setItem("gemini_api_key", this.apiKey);
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        this.genAI = new GoogleGenerativeAI(this.apiKey);
      } catch (e) {
        console.error("Failed to load Gemini SDK:", e);
      }
    } else {
      localStorage.removeItem("gemini_api_key");
      this.genAI = null;
    }
  }

  hasApiKey() {
    return !!this.apiKey;
  }

  async getSupportedModels() {
    if (!this.apiKey) return [];
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(this.apiKey)}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok && data.models && Array.isArray(data.models)) {
        const supported = data.models
          .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
          .map(m => m.name.replace(/^models\//, ""));
        return supported;
      }
    } catch (e) {
      console.warn("Could not query model discovery endpoint:", e);
    }
    return [];
  }

  async fetchGeminiDirect(modelName, messages, systemInstruction, onChunk, onComplete) {
    const formattedContents = messages
      .filter(m => m.role === "user" || m.role === "model")
      .map(m => {
        const text = m.content || (m.parts && m.parts[0] ? m.parts[0].text : "");
        return {
          role: m.role === "model" ? "model" : "user",
          parts: [{ text: text }]
        };
      });

    const bodyData = {
      contents: formattedContents
    };
    if (systemInstruction && systemInstruction.trim()) {
      bodyData.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    // 1. Discover models supported specifically by this user's API Key
    let modelsToTry = await this.getSupportedModels();

    // 2. Fallback list if discovery returns empty
    if (!modelsToTry || modelsToTry.length === 0) {
      modelsToTry = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash",
        "gemini-1.5-pro",
        "gemini-pro"
      ];
    }

    let lastError = null;
    for (const mId of modelsToTry) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${mId}:generateContent?key=${encodeURIComponent(this.apiKey)}`;
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData)
        });

        const data = await response.json();
        if (response.ok && data.candidates && data.candidates[0] && data.candidates[0].content) {
          const rawReply = data.candidates[0].content.parts.map(p => p.text).join("\n");
          const replyText = cleanGeminiResponse(rawReply);
          
          // Stream words out smoothly
          const words = replyText.split(" ");
          for (let i = 0; i < words.length; i += 3) {
            const chunk = words.slice(i, i + 3).join(" ") + " ";
            onChunk(chunk);
            await new Promise(r => setTimeout(r, 20));
          }
          if (onComplete) onComplete(replyText);
          return true;
        } else if (data.error) {
          lastError = new Error(data.error.message || `API error ${data.error.code}`);
        }
      } catch (err) {
        lastError = err;
      }
    }
    throw lastError || new Error("Failed to connect to Google Gemini API.");
  }

  async generateResponseStream(messages, systemInstruction, modelName, onChunk, onError, onComplete) {
    if (!this.hasApiKey()) {
      this.simulateStreamingResponse(messages, systemInstruction, onChunk, onComplete);
      return;
    }

    try {
      const directSuccess = await this.fetchGeminiDirect(modelName, messages, systemInstruction, onChunk, onComplete);
      if (directSuccess) return;
    } catch (err) {
      console.warn("Direct Gemini API call failed:", err);
      const errMsg = err ? (err.message || String(err)) : "API key connection failed.";
      this.simulateStreamingResponse(messages, systemInstruction, onChunk, onComplete, true, errMsg);
    }
  }

  simulateStreamingResponse(messages, systemInstruction, onChunk, onComplete, isApiKeyError = false, errorMsg = "") {
    const latestMessage = messages[messages.length - 1];
    const latestText = latestMessage ? (latestMessage.content || (latestMessage.parts && latestMessage.parts[0] ? latestMessage.parts[0].text : "")) : "";
    const prompt = (latestText || "").toLowerCase().trim();
    
    // Identify agent from systemInstruction
    let agentName = "General";
    if (systemInstruction.includes("Grammar") || systemInstruction.includes("grammar")) {
      agentName = "Grammar";
    } else if (systemInstruction.includes("Translator") || systemInstruction.includes("translator")) {
      agentName = "Translator";
    } else if (systemInstruction.includes("Vocabulary") || systemInstruction.includes("vocabulary")) {
      agentName = "Vocab";
    }

    let content = "";
    if (prompt.includes("hello") || prompt.includes("hi") || prompt.includes("hey") || prompt === "now" || prompt === "go" || prompt === "done" || prompt === "works?") {
      content = "Hello! How can I help you today?";
    }
    
    if (agentName === "Grammar") {
      if (prompt.includes("don't know") || prompt.includes("who's book") || prompt.includes("correct")) {
        content = `### Grammatical Analysis & Correction

Here is the correction for your sentence:

*   **Original:** *"She don't know who's book this is."*
*   **Correction:** *"She **doesn't** know **whose** book this is."*

---

### Detailed Correction Breakdown

#### 1. Subject-Verb Agreement: *"don't"* vs. *"doesn't"*
*   **Rule:** Singular third-person subjects (*she, he, it*) require the singular verb form *does* (contracted to *doesn't*). 
*   **Correction:** Use *doesn't* instead of *don't* (which is for plural or first/second person: *I/you/we/they don't*).

#### 2. Homophone Error: *"who's"* vs. *"whose"*
*   **Rule:** 
    *   **Who's** is a contraction of "who is" or "who has" (e.g., *"Who's going to the park?"*).
    *   **Whose** is a possessive pronoun indicating ownership (e.g., *"Whose coat is this?"*).
*   **Correction:** Since you are asking about the owner of the book, you must use the possessive pronoun **whose**.

---

### Additional Practice Sentence
Compare these correct uses:
> *"She doesn't know **who's** writing the book, or **whose** desk they are using."*`;
      } else if (prompt.includes("who") || prompt.includes("whom")) {
        content = `### Grammar Guide: 'Who' vs. 'Whom'

Deciding between **who** and **whom** can be tricky, but it becomes simple once you look at the grammatical role the pronoun plays in the clause.

---

### The Quick Test: He vs. Him
To determine which pronoun to use, ask yourself if the answer would be **he** or **him** (or *they* vs. *them*):
*   If the answer is **he/she/they** (subject) $\rightarrow$ use **who**.
*   If the answer is **him/her/them** (object) $\rightarrow$ use **whom**.

| Pronoun | Function | Replacement Test | Example |
| :--- | :--- | :--- | :--- |
| **Who** | Subject (performs action) | **He** / **She** / **They** | **Who** wrote this letter? (*He* wrote it.) |
| **Whom** | Object (receives action) | **Him** / **Her** / **Them** | To **whom** was it sent? (It was sent to *him*.) |

---

### Examples in Context

#### Example 1: Subject Role
*   *Incorrect:* "Whom is going to the seminar?"
*   *Correct:* "**Who** is going to the seminar?" (Test: *He* is going, not *him* is going.)

#### Example 2: Object Role
*   *Incorrect:* "Who did you invite to the party?" (Common in spoken English, but grammatically informal)
*   *Correct (Formal):* "**Whom** did you invite to the party?" (Test: You invited *him*, not you invited *he*.)

#### Example 3: After Prepositions
*   Always use **whom** after prepositions (e.g., *to, for, with, about, by*).
*   *"With **whom** are you attending?"*
*   *"The colleague about **whom** we spoke."*`;
      } else {
        content = `### S.O.L Grammar Analysis

I've analyzed the structure of your query. Here is a syntax breakdown:

#### 📝 Structural Assessment
*   **Sentence Pattern:** The query asks a question regarding language mechanics or requests custom sentence corrections.
*   **Focus Areas:** In formal writing, ensure proper subject-verb agreement, distinct pronoun usage, and avoiding run-on clauses.

#### 💡 Syntax Tips
1. **Parallelism:** Keep listed items in the same grammatical form (e.g., *"He likes swimming, running, and cycling"* instead of *"He likes swimming, to run, and cycling"*).
2. **Active Voice:** Prefer active voice over passive voice for direct, energetic communication (e.g., *"The cat chased the mouse"* instead of *"The mouse was chased by the cat"*).

*Paste a specific sentence, and I will perform a complete structural audit!*`;
      }
    } else if (agentName === "Translator") {
      if (prompt.includes("break a leg") || prompt.includes("french")) {
        content = `### Context-Nuanced Translation: 'Break a leg'

When translating idioms, a literal word-for-word translation often sounds confusing. Here is how to localize the English idiom **"break a leg"** into French.

---

### 1. The Direct Literal Translation (Incorrect)
*   *French:* *"Casse-toi une jambe"* ❌
*   *Reason:* This literally means "break a leg to yourself." In French, this sounds like a threat or a curse, rather than an encouragement!

### 2. The Cultural Equivalents (Correct)

#### Option A: *"Merde!"* (Most common theatrical slang)
*   **Meaning:** Literally "Shit!"
*   **Context:** Just like in English theatre, saying "good luck" (*bonne chance*) is considered bad luck. Actors in France say *"Merde!"* to wish each other a great show. It dates back to the era of horse-drawn carriages when plenty of horse manure outside the theatre indicated a massive, sold-out crowd.

#### Option B: *"Bonne chance!"* (Standard Context)
*   **Meaning:** "Good luck!"
*   **Context:** Used in everyday life (exams, job interviews, sports) outside the theatrical world.

#### Option C: *"Touche du bois"* (Action equivalent)
*   **Meaning:** "Touch wood" (equivalent to "knock on wood" to prevent bad luck).

---

### Summary Table

| Source (EN) | French Translation | Tone/Register | Cultural Meaning |
| :--- | :--- | :--- | :--- |
| **Break a leg!** | *Merde !* | Informal (Theatrical) | Good luck! (Avoids saying 'bonne chance') |
| **Break a leg!** | *Je te dis merde !* | Very informal / Friendly | I'm crossing my fingers for you! |
| **Good luck!** | *Bonne chance !* | Neutral / Standard | Standard encouragement. |`;
      } else if (prompt.includes("formal") || prompt.includes("japanese")) {
        content = `# Japanese Localization: Formal Apology Email

Translating formal business communications from English to Japanese requires adjusting for **Keigo** (honorific Japanese speech levels). A direct translation will sound overly blunt or rude.

---

### Scenario: Apologizing for a delayed shipment

#### English Original:
> *"We sincerely apologize for the delay in shipping your order. We are resolving the issue and appreciate your patience."*

#### Japanese Keigo Translation (Business Formal):
> 注文商品の発送が遅れましたことを、深くお詫び申し上げます。現在、問題の解決に努めております。お客様のご理解とご協力に心より感謝いたします。
> 
> *(Chūmon shōhin no hassō ga okuremashita koto o, fukaku owabi mōshiagemasu. Genzai, mondai no kaiketsu ni tsutomete orimasu. Okyaku-sama no go-rikai to go-kyōryoku ni kokoro yori kansha itashimasu.)*

---

### Honorific Level Analysis

1. **お詫び申し上げます (Owabi mōshiagemasu)**:
   * **Level:** *Kenjōgo* (Humble language). 
   * **Why:** You humble your own company's actions (*apologizing*) to show respect to the customer.
2. **ご協力に心より感謝いたします (Go-kyōryoku ni kokoro yori kansha itashimasu)**:
   * **Level:** *Kenjōgo* / *Teineigo* (Humble/Polite mix).
   * **Why:** The prefix **ご (go-)** is added to "cooperation" (*kyōryoku*) to elevate the customer's action. **いたします (itashimasu)** is the humble form of "to do" (*suru*).`;
      } else {
        content = `### S.O.L Translation & Localization Service

To provide a context-perfect translation, please share:
1. **The Source Text** you want translated.
2. **The Target Language**.
3. **The Intended Tone/Audience** (e.g., formal business, casual text, literary prose).

#### 💡 Translation Best Practices
*   **Avoid Literalisms:** Idiomatic phrases must be swapped for their natural cultural equivalent rather than translating word-by-word.
*   **Honorifics & Pronouns:** Many languages (like German, Spanish, French, Korean, or Japanese) distinguish between formal and informal pronouns (*tu* vs. *usted*, *du* vs. *Sie*). Knowing the relationship between speakers changes the translation.

*Provide your text, and I will compile a translation guide with grammar and vocabulary notes!*`;
      }
    } else if (agentName === "Vocab") {
      if (prompt.includes("cliché") || prompt.includes("cliche")) {
        content = `### Word Origin & History: **Cliché** (Noun)

A **cliché** refers to a phrase or opinion that is overused and betrays a lack of original thought. However, the origin of this word is highly visual and mechanical!

---

### Etymological Timeline

\`\`\`mermaid
graph TD
    A["1. French Verb: Clicher (To Click/Stamp)"] --> B["2. Printing Industry: The Stereotype Plate"]
    B --> C["3. Metaphorical Shift: Repetitive Language (Cliché)"]
    style A fill:#ffd700,stroke:#2a2a2e,stroke-width:2px,color:#000
    style B fill:#333,stroke:#2a2a2e,stroke-width:1px,color:#fff
    style C fill:#ffd700,stroke:#2a2a2e,stroke-width:2px,color:#000
\`\`\`

#### 1. Onomatopoeic French Printing
In 18th-century French printing presses, typesetters used a method called *stereotype* printing. Instead of printing directly from individual loose letters, they would cast a metal plate of an entire page of text.
*   The molten metal was poured onto a mold, making a clicking or stamping sound.
*   The French verb **clicher** was an onomatopoeic word imitating that metallic clicking sound (*"clich-clich"*).

#### 2. The Noun Form
The plate itself became known as a **cliché** (a cast plate).

#### 3. The Modern Metaphor
Because these metal plates allowed printers to print the same text over and over again without changing anything, writers in the 19th century began using the term metaphorically to describe **phrases, ideas, or plots that are repeated mechanically without variation**.

---

### 🔍 Quick Facts
*   **Doublet:** The English word *stereotype* comes from the exact same printing plate process (Greek *stereos* = solid + *typos* = impression). Thus, *cliché* and *stereotype* are historical twins!`;
      } else if (prompt.includes("beautiful") || prompt.includes("synonyms")) {
        content = `### Vocabulary Expansion: Synonyms for "Beautiful"

Relying on the word "beautiful" can make writing repetitive. Here are 5 advanced, expressive synonyms, along with their nuances and usage examples.

---

### 1. **Resplendent** [ri-splen-duhnt]
*   **Nuance:** Glowing, shining brilliantly, characterized by glowing splendor. Often associated with light or clothing.
*   **Example:** *"The bride was **resplendent** in her gold-embroidered gown."*

### 2. **Breathtaking** [breth-tey-king]
*   **Nuance:** A beauty so striking or astonishing that it literally leaves you short of breath. Best for landscapes or spectacular views.
*   **Example:** *"The hikers stood in silence, looking out over the **breathtaking** mountain pass."*

### 3. **Sublime** [suh-blahym]
*   **Nuance:** A beauty so grand, elevated, or awe-inspiring that it borders on spiritual or transcendent.
*   **Example:** *"The cathedral's architecture possessed a **sublime** beauty that humbled all who entered."*

### 4. **Ravishing** [rav-i-shing]
*   **Nuance:** Extremely attractive, compelling, or enchanting. Typically used to describe people or visual designs that seize attention.
*   **Example:** *"She looked absolutely **ravishing** in the emerald evening dress."*

### 5. **Pulchritudinous** [puhl-kri-tood-n-uhs]
*   **Nuance:** A very formal, literary, and rare word for physical beauty. Often used for comedic or self-consciously complex writing due to its heavy pronunciation.
*   **Example:** *"He drafted a sonnet dedicated to his **pulchritudinous** muse."*

---

### Vocabulary Matching Exercise

Try using the correct word based on the context:
1. A starry sky filled with northern lights: **Breathtaking** or **Sublime**.
2. A king clad in robes reflecting the light: **Resplendent**.`;
      } else {
        content = `### S.O.L Vocabulary Builder

Expanding your vocabulary is one of the fastest ways to improve fluency. Please tell me:
1. **A Base Word** (e.g. *happy, sad, fast*) you want to replace with advanced vocabulary.
2. **A Theme** (e.g. *academic writing, poetry, business conversations*) to match the tone.

#### 💡 Daily Study Tip
*   **Context over Lists:** Don't memorize lists of words. Instead, write three custom sentences utilizing a new word in context immediately after learning it. This moves the word from passive memory to active usage.

*Provide your prompt, and let's craft some vocabulary exercises!*`;
      }
    } else {
      // General language assistant responses
      if (prompt.includes("acquisition") || prompt.includes("learning")) {
        content = `### Language Acquisition vs. Language Learning

In linguistics, particularly in the work of Stephen Krashen, a major distinction is made between how we pick up languages.

---

### 1. Language Acquisition (Implicit / Subconscious)
*   **Process:** A natural, subconscious process similar to how children master their first language.
*   **Method:** Engaging in meaningful interaction in the target language without focusing on grammatical rules. 
*   **Result:** Intuitively knowing what "sounds right" (implicit knowledge).
*   **Key Factor:** **Comprehensible Input**—hearing and reading language that is slightly above your current level of understanding.

### 2. Language Learning (Explicit / Conscious)
*   **Process:** A formal, conscious study of the language, such as learning grammar rules, memorizing vocabulary lists, and analyzing syntax.
*   **Method:** Classroom lectures, textbooks, flashcard drills.
*   **Result:** Knowing *why* rules work and being able to explain them, but often experiencing a delay when speaking because you have to consciously apply the rules.

---

### Comparison Summary

| Attribute | Acquisition | Learning |
| :--- | :--- | :--- |
| **Focus** | Meaning and message | Grammatical form and rules |
| **Environment** | Immersion, active conversation | Structured study, classrooms |
| **Age Group** | High in children; possible in adults | High in adults; difficult for young kids |
| **Pace** | Slow initially, but leads to fluency | Quick test performance, but slower speech |

### 💡 Modern Learning Tip:
To become fluent, **80% of your time should be spent on acquisition** (listening to podcasts, reading books, chatting) and **20% on learning** (clarifying rules, spelling, and grammar).`;
      } else if (prompt.includes("routine") || prompt.includes("spanish") || prompt.includes("learn")) {
        content = `### 📅 The 30-Minute Daily Language Learning Routine

If you want to achieve conversational fluency, consistency is far more important than intensity. Here is a scientifically backed 30-minute daily study framework.

---

#### ⏱️ Minutes 1–10: Comprehensible Input (Acquisition)
*   **Action:** Listen to a podcast or watch a video in your target language where you understand about 70–80% of the content. (e.g., intermediate Spanish podcasts).
*   **Goal:** Train your ear to sentence patterns, intonation, and vocabulary in context.

#### ⏱️ Minutes 10–20: Active Recall & Vocabulary (Learning)
*   **Action:** Review 10–15 flashcards using a Spaced Repetition System (SRS) like Anki. 
*   **Goal:** Reinforce vocab lists, conjugation tables, or expressions.

#### ⏱️ Minutes 20–25: Output Generation (Practice)
*   **Action:** Write down 5 sentences describing your day, or record yourself speaking about a topic for 2 minutes on your phone.
*   **Goal:** Bridge the gap between understanding language and producing it.

#### ⏱️ Minutes 25–30: Correction & Analysis (Grammar Check)
*   **Action:** Paste your written sentences into **S.O.L Grammar** to check for spelling, preposition, or conjugation errors. Review the grammar rules for any mistakes you made.
*   **Goal:** Prevent bad grammar habits from solidifying.`;
      } else if (!content) {
        content = "Hello! How can I help you today?";
      }
    }

    // Stream the response back to the application using a typing simulator
    const combinedContent = content || "Hello! How can I help you today?";
    const words = combinedContent.split(" ");
    let currentIndex = 0;
    let accumulatedText = "";

    const timer = setInterval(() => {
      if (currentIndex >= words.length) {
        clearInterval(timer);
        if (onComplete) {
          onComplete(combinedContent);
        }
        return;
      }

      // Add a chunk of words to speed up streaming
      const chunkCount = Math.min(3, words.length - currentIndex);
      const nextWords = words.slice(currentIndex, currentIndex + chunkCount).join(" ") + " ";
      accumulatedText += nextWords;
      onChunk(nextWords);
      currentIndex += chunkCount;
    }, 20); // 20ms interval feels quick and satisfying
  }
}
