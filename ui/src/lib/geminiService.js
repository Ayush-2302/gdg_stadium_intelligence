import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

class GeminiService {
  constructor() {
    if (API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: API_KEY });
      this.modelName = "gemini-2.5-flash";
    }
  }

  async generateCommentary(matchState, lang = "English") {
    if (!this.ai) return "Gemini AI is not configured.";

    const scrapedComm = matchState.commentary?.join("\n") || "No recent updates.";
    const scorecardText = matchState.scorecard?.map(s => `${s.name}: ${s.score}`).join(", ") || "No scorecard data.";

    const prompt = `
      You are an expert cricket commentator. Given the current match state, provide a short, engaging summary of the recent events and the overall situation in ${lang} language.
      
      MATCH CONTEXT:
      Live Score: ${matchState.live?.score || "N/A"}
      Status: ${matchState.live?.status || "Live"}
      Real-Time Highlights: ${scrapedComm}
      Current Scorecard: ${scorecardText}

      INSTRUCTIONS:
      - Use the Real-Time Highlights to provide a natural, informed commentary.
      - Don't just list the highlights; weave them into a narrative.
      - Keep it under 3-4 sentences.
      - Output language: ${lang}.

      Commentary (${lang}):
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error(`Error generating commentary in ${lang}:`, error);
      return lang === "Hindi" ? "मैच एक महत्वपूर्ण चरण में है। हर गेंद मायने रखती है!" : "The match is at a crucial stage. Every ball counts now!";
    }
  }

  async answerQuestion(question, matchState) {
    if (!this.ai) return "Gemini AI is not configured.";

    const scrapedComm = matchState.commentary?.join("\n") || "No recent updates.";
    const scorecardText = matchState.scorecard?.map(s => `${s.name}: ${s.score}`).join(", ") || "No scorecard data.";
    const stadiumContext = matchState.stadium 
      ? `STADIUM LOGISTICS (Arun Jaitley Stadium):
         - Gates: ${matchState.stadium.gates.map(g => `${g.name} (${g.waitTime}m wait)`).join(", ")}
         - Food: ${matchState.stadium.concessions.map(c => `${c.name} (${c.waitTime}m wait, popular for ${c.popular})`).join(", ")}
         - Restrooms: ${matchState.stadium.facilities.map(f => `${f.name} is ${f.status}`).join(", ")}`
      : "No stadium data available.";

    const prompt = `
      You are "CricGenius", an AI Cricket & Stadium Companion. Answer the following fan question.
      If the question is about the match, use the MATCH CONTEXT.
      If the question is about stadium logistics (entry, food, restrooms, wayfinding), use the STADIUM LOGISTICS.
      
      MATCH CONTEXT:
      Live Score: ${matchState.live?.score || "N/A"}
      Recent Events: ${scrapedComm}
      Current Scorecard: ${scorecardText}

      ${stadiumContext}

      Question: ${question}
      Answer:
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("Error answering question:", error);
      return "I'm sorry, I'm having trouble analyzing the match right now. But what a game it is!";
    }
  }

  async predictOutcome(matchState) {
    if (!this.ai) return JSON.stringify({ winProbability: 50, reason: "AI not configured." });

    const scrapedComm = matchState.commentary?.join("\n") || "No recent updates.";
    const scorecardText = matchState.scorecard?.map(s => `${s.name}: ${s.score}`).join(", ") || "No scorecard data.";

    const prompt = `
      You are a cricket prediction expert. Based on the current match state, provide a win probability and a brief reason for your prediction.
      
      MATCH CONTEXT:
      Live Score: ${matchState.live?.score || "N/A"}
      Status: ${matchState.live?.status || "Live"}
      Recent Commentary: ${scrapedComm}
      Scorecard: ${scorecardText}

      Prediction (JSON format: { "winProbability": number, "reason": string }):
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: this.modelName,
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error("Error predicting outcome:", error);
      return JSON.stringify({ winProbability: 50, reason: "It's anyone's game at this point!" });
    }
  }
}

export default new GeminiService();
