import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

class GeminiService {
  constructor() {
    if (API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: API_KEY });
      this.modelName = "gemini-2.5-flash";
    }
  }

  /**
   * Adaptive Teacher Logic
   * @param {string} question - User question or statement
   * @param {object} cognitiveState - Current state of the user's brain model
   */
  async getAdaptiveResponse(question, cognitiveState) {
    if (!this.ai) return "Cognitive Twin Core is offline. Please configure API Key.";

    const prompt = `
      You are "Cognitive Twin", a self-evolving AI learning agent. 
      Your goal is to build a live model of the user's brain and adapt your teaching style in real-time.

      USER COGNITIVE MODEL:
      ${JSON.stringify(cognitiveState)}

      CORE DIRECTIVES:
      1. Analyze the user's input for "Confusion Signals" (hesitation, incorrect assumptions) or "Breakthroughs" (clear connections).
      2. Adapt your explanation style:
         - If user is confused: Use simpler analogies, visual descriptions, or break concepts down.
         - If user is fast: Increase depth, use technical terminology, and skip basics.
      3. Measure Learning: Provide a "Cognitive Update" that suggests which concept levels should be adjusted.

      OUTPUT FORMAT:
      You MUST respond in a way that includes a natural chat response AND a JSON metadata block for the system to update the cognitive model.
      
      Response Format:
      [Your chat response here]
      ---
      COGNITIVE_UPDATE: { "conceptUpdates": { "concept_id": delta_value }, "vitalsUpdate": { "focusLevel": new_value } }

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
      console.error("Error in Cognitive Twin response:", error);
      return "I'm detecting a slight neural synchronization error. Let's try re-framing that concept.";
    }
  }
}

export default new GeminiService();
