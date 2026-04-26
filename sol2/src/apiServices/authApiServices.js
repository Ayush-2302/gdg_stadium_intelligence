import httpService from "./httpApiServices";

export const signinApi = async (data) => {
  try {
    const response = await httpService.post("/auth/signin", data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signupApi = async (data, token) => {
  try {
    const response = await httpService.post("/auth/signup", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateUserApi = async (id, data, token) => {
  try {
    const response = await httpService.put(`/auth/user/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const getAllUsersApi = async (params = {}, token) => {
  try {
    const response = await httpService.get("/auth/users", {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/signin";
};

export const createMultipleUsersApi = async (users, token) => {
  try {
    const response = await httpService.post(
      "/auth/create-multiple-users",
      { users },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error creating multiple users:", error);
    throw error;
  }
};


export const adminResetUserPasswordApi = async (id, newPassword, token) => {
  try {
    const response = await httpService.put(
      `/auth/reset-password/user/${id}`,
      { newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error resetting user password:", error);
    throw error;
  }
};

export const deleteUserApi = async (userId, token) => {
  try {
    const response = await httpService.delete(`/auth/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const uploadAndCreateUsersApi = async (file, token) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await httpService.post(
      "/auth/upload-users-file",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading and creating users:", error);
    throw error;
  }
};

export const forgotPasswordApi = async (email) => {
  try {
    const response = await httpService.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Error asking for password reset:", error);
    throw error;
  }
};

export const resetPasswordApi = async (token, password) => {
  try {
    const response = await httpService.put(`/auth/reset-password/${token}`, {
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};
