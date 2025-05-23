import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { Screen } from "../../layouts";
import { InfoFooter, Loader, VideoGrid } from "../../components";
import { useGetCategoriesQuery, useInfiniteVideosQuery } from "../../api";
import { useMemo } from "react";
import { useInstanceConfig, usePageContentTopPadding } from "../../hooks";
import { useTranslation } from "react-i18next";

export const CategoryScreen = () => {
  const { currentInstanceConfig } = useInstanceConfig();
  const { category } = useLocalSearchParams<RootStackParams[ROUTES.CATEGORY]>();
  const { data: categories, isFetching: isFetchingCategories } = useGetCategoriesQuery({});
  const { t } = useTranslation();
  const { top } = usePageContentTopPadding();

  const categoryTitle = useMemo(() => {
    return categories?.find(({ id }) => String(id) === category)?.name;
  }, [categories, category]);

  const { fetchNextPage, data, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteVideosQuery({
    uniqueQueryKey: "categoryVideosView",
    queryParams: { categoryOneOf: [Number(category)] },
    pageSize: currentInstanceConfig?.customizations?.showMoreSize,
  });

  const videos = useMemo(() => {
    return data?.pages?.flatMap(({ data }) => data.flat());
  }, [data]);

  if (isFetchingCategories) {
    return <Loader />;
  }

  return (
    <Screen style={{ padding: 0, paddingTop: top }}>
      <VideoGrid
        isLoading={isLoading}
        data={videos}
        title={categoryTitle}
        isLoadingMore={isFetchingNextPage}
        handleShowMore={hasNextPage ? fetchNextPage : undefined}
        link={{ text: t("showMore") }}
        isTVActionCardHidden={!hasNextPage}
      />
      <InfoFooter />
    </Screen>
  );
};
