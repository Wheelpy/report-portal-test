import { apiClient } from "../../utils/api/apiClient";
import { LaunchesResponse } from "../../utils/api/interfaces";

describe("Launches API", () => {
  //   it("User is able to get all launches by filter via GET request", async () => {
  //     const launches = await apiClient.get<LaunchesResponse>(
  //       "/superadmin_personal/launch"
  //     );

  //     expect(launches).toHaveProperty("content");
  //     expect(Array.isArray(launches.content)).toBe(true);
  //     expect(launches.content.length).toBeGreaterThan(0);
  //   });

//   it("Get launch #1 and check it has id 1", async () => {
//     const launch = await apiClient.get<LaunchesResponse>(
//       "/superadmin_personal/launch/1"
//     );

//     expect(launch).toHaveProperty("id", 1);
//     expect(launch.id).toBe(1);
//   });

  it("Get launch id 999 and expect it to NOT exist (404)", async () => {
    try {
      await apiClient.get<LaunchesResponse>("/superadmin_personal/launch/999");
      throw new Error("Request unexpectedly succeeded");
    } catch (error: any) {
      console.log("ERROR RESPONSE: ", error.response?.status);

      expect(error.response?.status).toBe(404);
    }
  });
});
