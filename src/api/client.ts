import {
  baseAeneidApiKey,
  baseAeneidApiUrl,
  baseBlockscoutApiUrl,
  basePublicUrl,
} from "@/config";
import axios from "axios";

type BaseAPI = "local" | "aeneid" | "blockscout";

export const apiClient = (baseApi: BaseAPI = "local") => {
  switch (baseApi) {
    case "aeneid":
      return axios.create({
        baseURL: baseAeneidApiUrl,
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": baseAeneidApiKey,
          "X-Chain": "story-aeneid",
        },
      });
    case "local":
      return axios.create({
        baseURL: basePublicUrl,
        headers: {
          "Content-Type": "application/json",
        },
      });
    case "blockscout":
      return axios.create({
        baseURL: baseBlockscoutApiUrl,
        headers: {
          "Content-Type": "application/json",
        },
      });
    default:
      throw new Error("Invalid API base");
  }
};
