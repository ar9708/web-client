import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ApiServiceImpl } from "./peertubeVideosApi";
import { SOURCES } from "../types";
import { getLocalData } from "./helpers";
import { Video } from "@peertube/peertube-types/peertube-models/videos/video.model";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../app/_layout";
import { InstanceSearchServiceImpl } from "./instanceSearchApi";
import { GetVideosVideo, OwnTubeError } from "./models";
import { InstanceInformationApiImpl } from "./instance";
import { ChannelsApiImpl } from "./channelsApi";
import { VideosCommonQuery } from "@peertube/peertube-types";
import { CategoriesApiImpl } from "./categoriesApi";
import { PlaylistsApiImpl } from "./playlistsApi";

export enum QUERY_KEYS {
  videos = "videos",
  video = "video",
  instances = "instances",
  instance = "instance",
  channel = "channel",
  channels = "channels",
  channelVideos = "channelVideos",
  categories = "categories",
  playlists = "playlists",
  playlistVideos = "playlistVideos",
}

export const useGetVideosQuery = <TResult = GetVideosVideo[]>({
  enabled = true,
  select,
  params,
  customQueryKey,
}: {
  enabled?: boolean;
  select?: (data: GetVideosVideo[]) => TResult;
  params?: VideosCommonQuery;
  customQueryKey?: string;
}) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.videos, backend, customQueryKey],
    queryFn: async () => {
      if (backend === SOURCES.TEST_DATA) {
        return getLocalData<{ data: GetVideosVideo[] }>("videos").data;
      }

      const data = await ApiServiceImpl.getVideos(backend!, { count: 50, ...params });
      return data.data;
    },
    enabled: enabled && !!backend,
    refetchOnWindowFocus: false,
    select,
  });
};

export const useInfiniteVideosQuery = (pageSize = 4) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useInfiniteQuery({
    initialPageParam: 0,
    getNextPageParam: (lastPage: { data: GetVideosVideo[]; total: number }, _nextPage, lastPageParam) => {
      const nextCount = (lastPageParam === 0 ? pageSize * 3 : lastPageParam) + pageSize;

      return nextCount > lastPage.total ? null : nextCount;
    },
    queryKey: [QUERY_KEYS.videos, backend, "infinite"],
    queryFn: async ({ pageParam }) => {
      return await ApiServiceImpl.getVideos(backend!, {
        count: pageParam === 0 ? pageSize * 3 : pageSize,
        start: pageParam,
        sort: "-publishedAt",
      });
    },
    refetchOnWindowFocus: false,
    enabled: !!backend,
  });
};

export const useGetVideoQuery = <TResult = Video>(id?: string, select?: (data: Video) => TResult) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.video, id],
    queryFn: async () => {
      if (backend === SOURCES.TEST_DATA) {
        return getLocalData<Video>("video");
      }

      return await ApiServiceImpl.getVideo(backend!, id!);
    },
    refetchOnWindowFocus: false,
    enabled: !!backend && !!id,
    select,
  });
};

export const useGetInstancesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.instances],
    queryFn: async () => {
      return await InstanceSearchServiceImpl.searchInstances();
    },
    refetchOnWindowFocus: false,
    select: ({ data }) => data,
  });
};

export const useGetInstanceInfoQuery = (backend?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.instance, backend],
    queryFn: async () => {
      return await InstanceInformationApiImpl.getInstanceInfo(backend!);
    },
    select: ({ instance }) => instance,
    enabled: !!backend,
    refetchOnWindowFocus: false,
  });
};

export const useGetChannelInfoQuery = (backend?: string, channelHandle?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.channel, backend, channelHandle],
    queryFn: async () => {
      return await ChannelsApiImpl.getChannelInfo(backend!, channelHandle!);
    },
    enabled: !!backend && !!channelHandle,
    refetchOnWindowFocus: false,
  });
};

export const useGetChannelsQuery = () => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.channels, backend],
    queryFn: async () => {
      return await ChannelsApiImpl.getChannels(backend!);
    },
    select: ({ data }) => data,
    enabled: !!backend,
    refetchOnWindowFocus: false,
  });
};

export const useGetChannelVideosQuery = (channelHandle?: string, queryParams: VideosCommonQuery = { count: 4 }) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery<GetVideosVideo[]>({
    queryKey: [QUERY_KEYS.channelVideos, backend, channelHandle, queryParams?.categoryOneOf],
    queryFn: async () => {
      const response = await ChannelsApiImpl.getChannelVideos(backend!, channelHandle!, queryParams);

      return response.data;
    },
    enabled: !!backend && !!channelHandle,
    refetchOnWindowFocus: false,
  });
};

export const useInfiniteGetChannelVideosQuery = (channelHandle?: string, pageSize = 4) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useInfiniteQuery({
    initialPageParam: 0,
    getNextPageParam: (lastPage: { data: GetVideosVideo[]; total: number }, _nextPage, lastPageParam) => {
      const nextCount = (lastPageParam === 0 ? pageSize * 3 : lastPageParam) + pageSize;

      return nextCount > lastPage.total ? null : nextCount;
    },
    queryKey: [QUERY_KEYS.channelVideos, backend, channelHandle, "infinite"],
    queryFn: async ({ pageParam }) => {
      const response = await ChannelsApiImpl.getChannelVideos(backend!, channelHandle!, {
        count: pageParam === 0 ? pageSize * 3 : pageSize,
        start: pageParam,
        sort: "-publishedAt",
      });

      return {
        data: response.data.map((video) => ({ ...video, thumbnailPath: `https://${backend}${video.thumbnailPath}` })),
        total: response.total,
      };
    },
    enabled: !!backend && !!channelHandle,
    refetchOnWindowFocus: false,
  });
};

export const useGetCategoriesQuery = () => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.categories, backend],
    queryFn: async () => {
      return await CategoriesApiImpl.getCategories(backend!);
    },
    enabled: !!backend,
    refetchOnWindowFocus: false,
  });
};

export const useGetPlaylistsQuery = () => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.playlists, backend],
    queryFn: async () => {
      const data = await PlaylistsApiImpl.getPlaylists(backend!);
      return { ...data, data: data.data.filter(({ isLocal, videosLength }) => isLocal && videosLength > 0) };
    },
    enabled: !!backend,
    refetchOnWindowFocus: false,
  });
};

export const useGetPlaylistVideosQuery = (playlistId?: number, count: number = 4) => {
  const { backend } = useLocalSearchParams<RootStackParams["index"]>();

  return useQuery({
    queryKey: [QUERY_KEYS.playlistVideos, backend, playlistId],
    queryFn: async () => {
      return await PlaylistsApiImpl.getPlaylistVideos(backend!, playlistId!, { count });
    },
    enabled: !!backend && !!playlistId,
    refetchOnWindowFocus: false,
    retry: (failureCount, error: OwnTubeError) => {
      if (error.code === 429) {
        return true;
      }
      return failureCount < 5;
    },
  });
};
