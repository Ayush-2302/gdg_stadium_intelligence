/**
 * Service to interact with local Ollama API.
 * Assumes Ollama is running on http://localhost:11434
 */

const OLLAMA_URL = process.env.NEXT_PUBLIC_OLLAMA_URL
const MODEL_NAME = process.env.NEXT_PUBLIC_OLLAMA_MODEL

export const askStadiumAI = async (prompt, systemPrompt = "") => {
  const context = `You are StadiumPulse AI, a premium digital concierge for a high-tech sporting venue. 
  Your goal is to help fans navigate the stadium, find food, avoid crowds, and have a seamless experience. 
  Keep your answers concise, helpful, and premium in tone.
  ${systemPrompt}`;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_NAME,
        prompt: `${context}\n\nUser: ${prompt}\nAI:`,
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          `Model '${MODEL_NAME}' not found. Please run 'ollama pull ${MODEL_NAME}'`,
        );
      }
      throw new Error(`Ollama error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("AI Service Error:", error);
    if (error.message.includes("fetch")) {
      return "Ollama is not running. Please start Ollama locally to use the AI Concierge.";
    }
    return `AI Error: ${error.message}. Please check your Ollama setup.`;
  }
};
