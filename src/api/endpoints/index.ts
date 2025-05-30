import { apiClient } from "../client";

const fetchSearchIpAsset = (ip: string) =>
  apiClient("local")
    .post("/search", { search: ip })
    .then((res) => res.data.results);

const fetchTrackById = (id: string) =>
  apiClient("local")
    .get(`/track/${id}`)
    .then((res) => res.data.results);

export { fetchSearchIpAsset, fetchTrackById };
