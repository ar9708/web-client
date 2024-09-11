import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ChannelsApiImpl } from "../channelsApi";
import { retry } from "../helpers";
import { VideosCommonQuery } from "@peertube/peertube-types";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { GetVideosVideo } from "../models";

import { QUERY_KEYS } from "../constants";

export const useGetChannelInfoQuery = (backend?: string, channelHandle?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.channel, backend, channelHandle],
    queryFn: async () => {
      return await ChannelsApiImpl.getChannelInfo(backend!, channelHandle!);
    },
    enabled: !!backend && !!channelHandle,
    refetchOnWindowFocus: false,
    retry,
  });
};

export const useGetChannelsQuery = () => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.channels, backend],
    queryFn: async () => {
      return await ChannelsApiImpl.getChannels(backend!);
    },
    select: ({ data }) => data.filter(({ isLocal }) => isLocal),
    enabled: !!backend,
    refetchOnWindowFocus: false,
    retry,
  });
};

export const useGetChannelVideosQuery = (channelHandle?: string, queryParams: VideosCommonQuery = { count: 4 }) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.channelVideos, backend, channelHandle, queryParams?.categoryOneOf],
    queryFn: async () => {
      return await ChannelsApiImpl.getChannelVideos(backend!, channelHandle!, queryParams);
    },
    enabled: !!backend && !!channelHandle,
    refetchOnWindowFocus: false,
    retry,
  });
};

export const useInfiniteGetChannelVideosQuery = (
  queryArgs: Partial<{ channelHandle: string; category: number; pageSize: number; uniqueQueryKey: string }>,
) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();
  const { channelHandle, category, pageSize = 4, uniqueQueryKey } = queryArgs;

  return useInfiniteQuery({
    initialPageParam: 0,
    getNextPageParam: (lastPage: { data: GetVideosVideo[]; total: number }, _nextPage, lastPageParam) => {
      const nextCount = (lastPageParam === 0 ? pageSize * 4 : lastPageParam) + (lastPageParam ? pageSize : 0);

      return nextCount >= lastPage.total ? null : nextCount;
    },
    queryKey: [QUERY_KEYS.channelVideos, backend, channelHandle, "infinite", uniqueQueryKey],
    queryFn: async ({ pageParam }) => {
      return await ChannelsApiImpl.getChannelVideos(backend!, channelHandle!, {
        count: pageParam === 0 ? pageSize * 4 : pageSize,
        start: pageParam,
        sort: "-publishedAt",
        categoryOneOf: category ? [category] : undefined,
        skipCount: false,
      });
    },
    enabled: !!backend && !!channelHandle,
    refetchOnWindowFocus: false,
    retry,
  });
};
