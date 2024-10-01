import { useInfiniteVideosQuery } from "../../../api";
import { VideoGrid } from "../../../components";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useInstanceConfig } from "../../../hooks";

export const LatestVideosView = () => {
  const { t } = useTranslation();
  const { currentInstanceConfig } = useInstanceConfig();
  const { fetchNextPage, data, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteVideosQuery({
    uniqueQueryKey: "homepageLatestVideosView",
    firstPageSize: currentInstanceConfig?.customizations?.homeLatestPublishedVideoCount,
  });
  const videos = useMemo(() => {
    return data?.pages?.flatMap(({ data }) => data.flat());
  }, [data]);

  return (
    <VideoGrid
      isLoading={isLoading}
      data={videos}
      title={t("latestVideos")}
      isLoadingMore={isFetchingNextPage}
      handleShowMore={hasNextPage ? fetchNextPage : undefined}
    />
  );
};
