import httpService from "./httpApiServices";

export const getCommentaryApi = async (lang = "English") => {
  try {
    const response = await httpService.get(`/match/commentary?lang=${lang}`);
    return response.data;
  } catch (error) {
    console.error("Error in getCommentaryApi:", error);
    throw error;
  }
};

export const askAiApi = async (question) => {
  try {
    const response = await httpService.post("/match/ask", { question });
    return response.data;
  } catch (error) {
    console.error("Error in askAiApi:", error);
    throw error;
  }
};

export const getPredictionApi = async () => {
  try {
    const response = await httpService.get("/match/prediction");
    return response.data;
  } catch (error) {
    console.error("Error in getPredictionApi:", error);
    throw error;
  }
};

export const analyzeFrameApi = async (image) => {
  try {
    const response = await httpService.post("/match/analyze-frame", { image });
    return response.data;
  } catch (error) {
    console.error("Error in analyzeFrameApi:", error);
    throw error;
  }
};
