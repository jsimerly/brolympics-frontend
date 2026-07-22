import api from "./axios";

export const syncUserWithBackend = async () => {
  try {
    const response = await api.post("/api/auth/sync-user/");
    console.log("User synced with Django backend:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error syncing user with Django backend:", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    const response = await api.get("/api/auth/user/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserInfo = async (userData) => {
  try {
    const response = await api.put("/api/auth/user/", userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

/** Merge a PRIOR account's history into the current one. `token` is the old
 * account's id token (obtained via a secondary sign-in that proves
 * ownership). Returns what moved: {players, leagues_owned, ..., conflicts}. */
export const mergePriorAccount = async (token) => {
  const response = await api.post("/api/auth/merge/", { token });
  return response.data;
};

export const updateUserImg = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await api.put("/api/auth/user/image/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user image:", error);
    throw error;
  }
};
