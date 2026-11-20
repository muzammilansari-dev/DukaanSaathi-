# DukaanSaathi AI (दुकान साथी AI)
> **Aapki Dukaan Ka Digital Saathi** — A WhatsApp-style Hinglish AI business companion for Indian local shopkeepers, kiranas, home bakers, and freelancers.

[![Architecture](https://img.shields.io/badge/Architecture-Hybrid%20AI%20%2B%20Deterministic%20Math-emerald)](#architectural-safeguards)
[![LLM](https://img.shields.io/badge/LLM-Gemini%203.8%20Flash-blue)](#gemini-ai-integration)
[![Stack](https://img.shields.io/badge/Stack-React%2019%20%2B%20Express%20%2B%20Tailwind%20v4-purple)](#tech-stack)

---

## 1. Problem Dissection
Small shopkeepers (Kirana owners, tailors, bakers, salon artists) lose money and time on three daily repetitive tasks:
1. **Guessing selling prices and margins** without knowing real cost ratios or local Mandi competition.
2. **Losing track of inventory** and running out of fast-moving essentials (stock-outs).
3. **Struggling to write professional customer messages** (awkward udhaar / payment reminders, festival deals, restock broadcasts).

They are comfortable with **WhatsApp and UPI QR codes**, but not complex ERPs, spreadsheets, or English-only tools. They speak and think in **Hinglish**.

---

## 2. Winning MVP Solution
**DukaanSaathi AI** is a mobile-first, WhatsApp-style AI assistant that gives shopkeepers instant business clarity in Hinglish:
* **Natural Voice & Hinglish Text Input**: Speak or type *"Aaj 5 kg chawal bika, 2 kg bacha"* or *"10 packet Maggi aayi ₹50 rate me"*.
* **Code-Driven Math, AI-Driven Language**: Arithmetic, inventory updates, and margin bounds run strictly in deterministic code. Gemini 3.8 Flash handles intent extraction, local market reasoning, and respectful copywriting.
* **Instant WhatsApp Action**: Ready-to-send messages for pending payments, festive offers, and distributor purchase orders with one-tap `wa.me` deep links.

---

## 3. Core Features (Triage)

### Feature 1: Smart Inventory and Restock Advisor
- Natural Hinglish parsing converts everyday shop updates into structured inventory.
- Automatic low-stock detection triggers restock alerts with suggested order quantities `(Threshold × 2 - Current Stock)`.
- One-click **Wholesale Distributor Purchase Order** generation ready to broadcast on WhatsApp.

### Feature 2: Conversational Chat Interface & Voice Input
- WhatsApp-style conversation flow with quick prompt chips.
- Integrated **Web Speech API** for hands-free Hindi / Hinglish voice dictation.
- Interactive in-chat cards for stock changes, price suggestions, and WhatsApp previews.

### Feature 3: Pricing & Customer Message Generator
- **Price Guru**: Computes Min, Recommended, and Max selling prices clamped to anti-loss margin guardrails (5% to 60%).
- Gemini provides local tier-2/tier-3 city retail competitive intelligence (Kanpur, Lucknow, Jaipur, etc.).
- **Customer Message Studio**: Generates polite Khata / Udhaar payment reminders (with UPI ID), festival greetings, and new arrival alerts with `wa.me` links.

---

## 4. Architectural Safeguards
1. **Anti-Hallucination**: Code performs all math (subtractions, thresholds, margin percentages). Gemini is never asked to calculate raw arithmetic.
2. **Strict Guardrails**: Margin suggestions are clamped between 5% and 60% with explicit suggestions labeling.
3. **Graceful Fallbacks**: If API limits or network issues occur, an integrated regex fallback parser ensures 100% uptime for the shopkeeper.
4. **Privacy Protection**: Customer phone numbers remain in the local browser for `wa.me` link construction and are never transmitted to external AI endpoints.

---

## 5. Instant Testing for Judges (Demo Presets)
Use the **Demo Presets** dropdown in the top header:
* **Sharma Kirana Store (Kanpur)**: Preloaded with 8 grocery staples (Chawal, Atta, Maggi, Dal, etc.) with active low-stock alerts.
* **Gulab Sweets & Bakery (Jaipur)**: Preloaded with cakes, pav buns, and cookies.
* Try speaking or typing:
  - *"Aaj 5 kg chawal bika, 2 bacha"*
  - *"Maggi ka stock check karo"*
  - *"₹65 cost par kitne me bechu?"*
  - *"Ramesh bhai ko ₹450 udhaar reminder bhejo"*

---

## 6. Setup & Execution

### Prerequisites
* Node.js v20+
* `GEMINI_API_KEY` (configured in `.env` or injected by AI Studio)

### Commands
```bash
# Install dependencies
npm install

# Start full-stack dev server (port 3000)
npm run dev

# Build for production
npm run build
```
