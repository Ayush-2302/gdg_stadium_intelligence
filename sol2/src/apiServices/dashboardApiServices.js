import httpService from "./httpApiServices";

export const getMetricsApi = async () => {
  try {
    const response = await httpService.get("/dashboard/metrics");
    return response.data;
  } catch (error) {
    console.error("Error in getMetricsApi:", error);
    throw error;
  }
};
