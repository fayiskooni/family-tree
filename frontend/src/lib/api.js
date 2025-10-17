import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/logout");
  return response.data;
};

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/me");
    console.log(res);

    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser", error);
    return null;
  }
};

export const createAuthFamily = async (familyName) => {
  const response = await axiosInstance.post("/family", familyName);
  return response.data;
};

export async function getUserFamilies() {
  const response = await axiosInstance.get("/families");
  return response.data;
}

export const createAuthMember = async (member) => {
  const response = await axiosInstance.post("/member", member);
  return response.data;
};

export async function getUserMembers() {
  const response = await axiosInstance.get("/members");
  return response.data;
}

export const getAuthMember = async (memberData) => {
  const response = await axiosInstance.post(
    `/member/${memberData.member_id}`,
    memberData
  );
  return response.data;
};
