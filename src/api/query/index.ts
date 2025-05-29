import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchSearchIpAsset, fetchTrackById } from "@/api/endpoints";
import type { IpAsset } from "@/types";
import { queryKeys } from "../constant/query-keys";

export const useSearchIpAsset = () =>
  useMutation<IpAsset[], Error, string>({
    mutationFn: (search: string) => fetchSearchIpAsset(search),
  });

export const useTrackById = (id: string, enabled = !!id) =>
  useQuery({
    queryKey: queryKeys.trackById(id),
    queryFn: () => fetchTrackById(id),
    enabled,
  });
