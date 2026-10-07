# AyuHealth AI 🩺 🌐

**AyuHealth AI** is an intelligent, multilingual healthcare assistant engineered to deliver accessible medical guidance across diverse regional Indian languages. By combining **Google Gemini AI** models with a hybrid voice architecture (Web Speech API + Gemini Universal Cloud TTS), AyuHealth AI enables users to communicate symptoms naturally through voice or text and receive empathetic, localized health assessments and medication advice in their native language.

---

## 🌟 Key Features

- **🗣️ Multilingual Voice & Speech-to-Text (STT)**
  - Full voice recognition and speech feedback supporting **10+ Indian languages and dialects**:
    - **Telugu (తెలుగు)**
    - **Hindi (हिन्दी)**
    - **Tamil (தமிழ்)**
    - **Kannada (ಕನ್ನಡ)**
    - **Malayalam (മലയാളം)**
    - **Bengali (বাংলা)**
    - **Marathi (मराठी)**
    - **Gujarati (ગુજરાતી)**
    - **Punjabi (ਪੰਜਾਬੀ)**
    - **Indian English (English)**
  - Hands-free dictation with real-time speech transcription.

- **☁️ Universal Cloud Voice (Gemini TTS Fallback)**
  - Solves the common limitation where desktop platforms (e.g., Windows PCs) lack native text-to-speech voices for regional Indian languages like Telugu, Tamil, or Kannada.
  - Automatically switches to **Gemini 3.1 Flash TTS (`gemini-3.1-flash-tts-preview`)** to stream high-fidelity 24kHz PCM audio directly to the browser via the Web Audio API when local OS voices are unavailable.

- **🩺 Context-Aware Symptom Analysis**
  - Powered by **Gemini 3 Flash (`gemini-3-flash-preview`)**.
  - Takes patient demographics (age, gender, location, language) into account for tailored advice and culturally relevant health considerations.
  - Generates clear, structured assessments:
    - **Preliminary Diagnosis / Assessment**
    - **Over-the-Counter (OTC) Guidance & Home Care**
    - **Precautions & When to See a Doctor**
    - Reassuring, positive, and empathetic tone.

- **📱 Guided Patient Intake Workflow**
  - Step-by-step interactive intake flow:
    1. **Welcome & Introduction** (with spoken audio greeting)
    2. **Gender Selection**
    3. **Age Verification**
    4. **Location / Region**
    5. **Native Language Preference**
    6. **Symptom Reporting** (via mic or typing)
    7. **Diagnosis, Care Plan & Spoken Readout**

- **🛠️ Integrated Voice Configuration Guide**
  - In-app assistance for configuring native speech synthesis on Windows, Android, macOS, and tips on using Microsoft Edge's natural neural voices.

---

## 🏗️ Architecture & Voice Pipeline

```
                                  +------------------------------+
                                  |     User Voice / Input       |
                                  +--------------+---------------+
                                                 |
                                                 v
                               +----------------------------------+
                               | Web Speech Recognition (Browser) |
                               +-----------------+----------------+
                                                 |
                                                 v
                                  +------------------------------+
                                  |  AyuHealth Patient Context   |
                                  |  (Age, Gender, Region, Lang) |
                                  +--------------+---------------+
                                                 |
                                                 v
                   +-----------------------------------------------------------+
                   | Gemini 3 Flash API (`gemini-3-flash-preview`)             |
                   | Generates Diagnosis & Guidance in Native Target Language  |
                   +-----------------------------+-----------------------------+
                                                 |
                                                 v
                             +-----------------------------------+
                             |     Voice Synthesis Selection     |
                             +-----------------+-----------------+
                                               |
                     +-------------------------+-------------------------+
                     |                                                   |
      [Local OS Voice Available?]                        [No Local Voice Detected]
                     |                                                   |
                     v                                                   v
      +-----------------------------+               +----------------------------------+
      | Browser Web Speech API      |               | Gemini 3.1 Flash Cloud TTS       |
      | (SpeechSynthesisUtterance)  |               | (`gemini-3.1-flash-tts-preview`) |
      +-----------------------------+               +-----------------+----------------+
                                                                      |
                                                                      v
                                                    +----------------------------------+
                                                    | Web Audio API (PCM 24kHz decode) |
                                                    +----------------------------------+
```

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI & TTS Engine**: [`@google/genai` SDK](https://www.npmjs.com/package/@google/genai)
  - Text & Medical Reasoning: `gemini-3-flash-preview`
  - Cloud Speech Synthesis: `gemini-3.1-flash-tts-preview`
- **Audio Processing**: Web Audio API (`AudioContext`, `AudioBuffer`, 16-bit PCM streaming)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A **Google Gemini API Key** (obtainable via [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone or navigate to the repository:**
   ```bash
   git clone https://github.com/your-username/ayuhealth-ai.git
   cd ayuhealth-ai
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (based on `.env.example`):
   ```bash
   cp .env.example .env
   ```

   Add your Gemini API key to `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open the application:**
   Navigate to `http://localhost:3000` in your web browser.

---

## 📋 Available Scripts

- `npm run dev`: Launches the Vite development server on port 3000.
- `npm run build`: Compiles TypeScript and creates an optimized production bundle in `/dist`.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Performs type checking via `tsc --noEmit`.
- `npm run clean`: Cleans up the build output folder.

---

## 💡 Regional Voice Output Tips

If you are using Windows and experience silent voice output for languages like Telugu or Kannada:

1. **Automatic Universal Cloud Voice**:
   - The application automatically detects missing local voices and requests high-quality spoken audio from Gemini Cloud TTS. You will hear audio output even if your Windows system does not have the language pack installed!

2. **For Zero-Latency Offline Voices on Windows**:
   - Open Windows **Settings** > **Time & Language** > **Language & Region**.
   - Click **Add a language**, search for your language (e.g., Telugu, Tamil, Marathi), and install the language & speech pack.
   - Alternatively, open the web application in **Microsoft Edge**, which includes cloud-connected natural neural voices for most Indian languages out of the box.

3. **On Android & Chrome**:
   - Android has built-in Google Speech Services with full support for Indian regional languages. Ensure the Google TTS voice data is updated under **Settings > Accessibility > Text-to-Speech Output**.

---

## 📁 Project Structure

```
├── .env.example              # Template for environment variables
├── index.html                # App entry point with meta tags
├── metadata.json             # AI Studio applet configuration & permissions
├── package.json              # Project dependencies and npm scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── src/
    ├── App.tsx               # Main patient intake flow and UI state
    ├── main.tsx              # React entry point
    ├── index.css             # Tailwind CSS entry point
    ├── components/
    │   ├── VoiceInterface.tsx    # Speech recognition & hybrid TTS engine (Web + Gemini Cloud)
    │   └── VoiceSetupGuide.tsx   # Helper modal for OS language pack setup
    ├── constants/
    │   └── languages.ts          # Supported languages, BCP-47 codes, greetings, and keywords
    ├── lib/
    │   └── utils.ts              # Utility classes and Tailwind helper functions
    └── services/
        └── gemini.ts             # Gemini SDK client for diagnosis & audio generation
```

---

## ⚠️ Medical Disclaimer

> **Important Notice:** AyuHealth AI is designed for informational, triage, and educational assistance only. It is **not** a replacement for professional clinical evaluation, medical advice, diagnosis, or treatment. Users should always consult a licensed healthcare professional or contact emergency medical services if they are experiencing urgent or life-threatening symptoms.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
