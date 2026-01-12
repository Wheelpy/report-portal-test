import { ApiClient } from "../apiClient";

export const getLaunches = async () => {
  return ApiClient.get("/superadmin_personal/launch");
};
