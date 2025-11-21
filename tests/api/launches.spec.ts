import { apiClient } from "../../utils/api/apiClient";
import { LaunchesResponse } from "../../utils/api/interfaces";
import { randomUUID } from "crypto";

describe("Launches API", () => {
  describe("request type: GET", () => {
    it("User is able to get all launches by filter via GET request", async () => {
      const launches = await apiClient.get<LaunchesResponse>(
        "/superadmin_personal/launch"
      );

      expect(launches).toHaveProperty("content");
      expect(Array.isArray(launches.content)).toBe(true);
      expect(launches.content.length).toBeGreaterThan(0);
    });

    it("Get launch #1 and check it has id 1", async () => {
      const launch = await apiClient.get<LaunchesResponse>(
        "/superadmin_personal/launch/1"
      );

      expect(launch).toHaveProperty("id", 1);
      expect(launch.id).toBe(1);
    });

    it("Get launch id 999 and expect it to NOT exist (404)", async () => {
      try {
        await apiClient.get<LaunchesResponse>(
          "/superadmin_personal/launch/999"
        );
        throw new Error("Request unexpectedly succeeded");
      } catch (error: any) {
        console.log("ERROR RESPONSE: ", error.response?.status);

        expect(error.response?.status).toBe(404);
      }
    });
  });

  describe("request type: POST", () => {
    it("Create new launch via POST and check response contains id", async () => {
      const body = {
        startTime: new Date().toISOString(),
        name: "autotest-launch",
        description: "Created from Jest test",
        attributes: [
          {
            key: "env",
            value: "dev",
            system: false,
          },
        ],
        uuid: randomUUID(),
        mode: "DEFAULT",
        rerun: false,
      };

      const response = await apiClient.post<{ id: number }>(
        "/superadmin_personal/launch",
        body
      );

      expect(response.id).toBeDefined();
      expect(typeof response.id).toBe("string");
    });

    it("Should return 500 when creating launch with duplicate uuid", async () => {
      const duplicateUuid = "1";

      const body = {
        startTime: new Date().toISOString(),
        name: "duplicate-launch-test",
        description: "Trying to create launch with duplicate uuid",
        attributes: [
          {
            key: "test",
            value: "duplicate",
            system: false,
          },
        ],
        uuid: duplicateUuid,
        mode: "DEFAULT",
        rerun: false,
      };

      try {
        await apiClient.post("/superadmin_personal/launch", body);
        throw new Error("Request should have failed but succeeded");
      } catch (error: any) {
        expect(error.response?.status).toBe(500);
        expect(error.response?.data?.message).toContain("duplicate");
      }
    });

    it("Should return 400 when creating launch without 'name'", async () => {
      const body = {
        startTime: new Date().toISOString(),
        description: "Trying to create launch without name",
        attributes: [
          {
            key: "test",
            value: "no-name",
            system: false,
          },
        ],
        uuid: randomUUID(),
        mode: "DEFAULT",
        rerun: false,
      };

      try {
        await apiClient.post("/superadmin_personal/launch", body);
        throw new Error("Request should have failed but succeeded");
      } catch (error: any) {
        expect(error.response?.status).toBe(400);
        expect(error.response?.data?.message).toContain("name");
      }
    });
  });

  describe("request type: PUT", () => {
    it("Should update launch description", async () => {
      const launchId = 1;

      const originalLaunch = await apiClient.get<any>(
        `/superadmin_personal/launch/${launchId}`
      );

      const updatedDescription =
        (originalLaunch.description || "initial") + " UPDATED " + Date.now();

      const updateBody = {
        mode: originalLaunch.mode || "DEFAULT",
        description: updatedDescription,
        attributes:
          originalLaunch.attributes?.map((a: any) => ({
            key: a.key,
            value: a.value,
          })) || [],
      };

      await apiClient.put(
        `/superadmin_personal/launch/${launchId}/update`,
        updateBody
      );

      const updatedLaunch = await apiClient.get<any>(
        `/superadmin_personal/launch/${launchId}`
      );

      expect(updatedLaunch.description).toBe(updatedDescription);
    });

    it("Should return error when trying to update non-existing launch", async () => {
      const invalidLaunchId = 999;

      const updateBody = {
        mode: "DEFAULT",
        description: "Should not update",
        attributes: [],
      };

      try {
        await apiClient.put(
          `/superadmin_personal/launch/${invalidLaunchId}/update`,
          updateBody
        );
        throw new Error("Request should have failed but succeeded");
      } catch (error: any) {
        expect(error.response).toBeDefined();
        expect(error.response.status).toBeGreaterThanOrEqual(400);
        expect(error.response.status).toBeLessThan(600);

        expect(
          JSON.stringify(error.response.data || "").toLowerCase()
        ).toContain("error");
      }
    });

    it("Should return error when updating launch with invalid body", async () => {
      const launchId = 1;

      const invalidBody = {
        mode: 123,
        description: 999,
        attributes: "invalid",
      };

      try {
        await apiClient.put(
          `/superadmin_personal/launch/${launchId}/update`,
          invalidBody
        );
        throw new Error("Request should have failed but succeeded");
      } catch (error: any) {
        expect(error.response).toBeDefined();

        expect(error.response.status).toBeGreaterThanOrEqual(400);
        expect(error.response.status).toBeLessThan(600);

        const msg = JSON.stringify(error.response.data || "").toLowerCase();

        expect(msg).toContain("index value outside legal index range");
      }
    });
  });

  describe("request type: PUT", () => {
    it("Should fail when trying to PATCH launch (PATCH not supported in RP)", async () => {
      const launchId = 1;

      try {
        await apiClient.patch(
          `/superadmin_personal/launch/${launchId}/update`,
          { description: "PATCH attempt" }
        );

        throw new Error("PATCH unexpectedly succeeded, but must fail");
      } catch (error: any) {
        console.log("PATCH ERROR:", error.response?.status || error.message);

        expect(error).toBeDefined();
        expect(
          error.response?.status === 405 ||
            error.response?.status === 500 ||
            error.message?.includes("aborted") ||
            error.code === "ERR_BAD_REQUEST"
        ).toBe(true);
      }
    });
  });

  describe("request type: DELETE", () => {
    it("Should delete the last completed or failed launch", async () => {
      const launchesList = await apiClient.get<any>(
        "/superadmin_personal/launch"
      );

      expect(Array.isArray(launchesList.content)).toBe(true);
      expect(launchesList.content.length).toBeGreaterThan(0);

      const finishedLaunches = launchesList.content.filter(
        (launch: any) => launch.status !== "IN_PROGRESS"
      );

      expect(finishedLaunches.length).toBeGreaterThan(0);

      const lastLaunch = finishedLaunches[finishedLaunches.length - 1];
      const launchId = lastLaunch.id;

      console.log(
        "Deleting launch id:",
        launchId,
        "with status:",
        lastLaunch.status
      );

      const deleteResponse = await apiClient.delete<any>(
        `/superadmin_personal/launch/${launchId}`
      );

      expect(deleteResponse.message).toContain(
        `Launch with ID = '${launchId}' successfully deleted.`
      );

      try {
        await apiClient.get(`/superadmin_personal/launch/${launchId}`);
        throw new Error("GET after delete unexpectedly succeeded");
      } catch (error: any) {
        expect(
          error.response?.status === 404 || error.response?.status === 500
        ).toBe(true);
      }
    });

    it("Should fail to delete the last IN_PROGRESS launch", async () => {
      const launchesList = await apiClient.get<any>(
        "/superadmin_personal/launch"
      );

      expect(Array.isArray(launchesList.content)).toBe(true);
      expect(launchesList.content.length).toBeGreaterThan(0);

      const inProgressLaunches = launchesList.content.filter(
        (launch: any) => launch.status === "IN_PROGRESS"
      );

      if (inProgressLaunches.length === 0) {
        console.warn("No IN_PROGRESS launches found. Skipping test.");
        return;
      }

      const lastInProgressLaunch =
        inProgressLaunches[inProgressLaunches.length - 1];
      const launchId = lastInProgressLaunch.id;

      console.log("Trying to delete IN_PROGRESS launch id:", launchId);

      try {
        await apiClient.delete<any>(`/superadmin_personal/launch/${launchId}`);
        throw new Error("DELETE unexpectedly succeeded for IN_PROGRESS launch");
      } catch (error: any) {
        expect(error.response?.status).toBe(406);
        expect(error.response?.data?.message).toContain(
          `Unable to perform operation for non-finished launch. Unable to delete launch '${launchId}' in progress state`
        );
      }
    });
  });
});
