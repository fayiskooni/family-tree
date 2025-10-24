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

export const createAuthMember = async (member) => {
  const response = await axiosInstance.post("/member", member);
  return response.data;
};

export const createFamilyMember = async (familyId, memberData) => {
  const response = await axiosInstance.post(
    `/family/member/${familyId}`,
    memberData
  );
  return response.data;
};

export const createCouple = async (id,data) => {
  const response = await axiosInstance.post(`/couple/${id}`, data);
  return response.data;
};

export const createChild = async (id,data) => {
  const response = await axiosInstance.post(`/parent/child/${id}`, data);
  return response.data;
};

export async function getFamily(id) {
  const response = await axiosInstance.get(`/family/${id}`);
  return response.data;
}

export async function getMember(id) {
  const response = await axiosInstance.get(`/member/${id}`);
  return response.data;
}

export async function getMemberSpouse(id) {
  const response = await axiosInstance.get(`/couple/${id}`);
  return response.data;
}

export async function getMemberChild(id) {
  const response = await axiosInstance.get(`/parent/child/${id}`);
  return response.data;
}

export async function getUserFamilies() {
  const response = await axiosInstance.get("/families");
  return response.data;
}

export async function getUserMembers() {
  const response = await axiosInstance.get("/members");
  return response.data;
}

export async function getRecommendedMembers(id) {
  const response = await axiosInstance.get(`/recommended/members/${id}`);
  return response.data;
}

export async function getFamilyMembers(id) {
  const response = await axiosInstance.get(`/family/members/${id}`);
  return response.data;
}

export async function getAllUnmarriedMales() {
  const response = await axiosInstance.get("/male/members");
  return response.data;
}

export async function getAllUnmarriedFemales() {
  const response = await axiosInstance.get("/female/members");
  return response.data;
}

export const updateFamily = async ({ id, familyName }) => {
  try {
    const response = await axiosInstance.patch(`/family/${id}`, {
      // backend expects `family_name`
      family_name: familyName,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating family:", error);
    throw error;
  }
};

export const updateMember = async ({ id, member }) => {
  try {
    const response = await axiosInstance.patch(`/member/${id}`, member);
    return response.data;
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
};

export const deleteFamily = async ({ id }) => {
  try {
    const response = await axiosInstance.delete(`/family/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting family:", error);
    throw error;
  }
};

export const deleteMember = async ({ id }) => {
  try {
    const response = await axiosInstance.delete(`/member/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting member:", error);
    throw error;
  }
};

export const deleteFamilyMember = async (id, memberId) => {
  try {
    const response = await axiosInstance.delete(`/family/member/${id}`, {
      data: { member_id: memberId },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting family member:", error);
    throw error;
  }
};
