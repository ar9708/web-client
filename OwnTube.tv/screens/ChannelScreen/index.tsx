import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { Screen } from "../../layouts";
import { useGetCategoriesQuery, useGetChannelInfoQuery, useGetChannelPlaylistsQuery } from "../../api";
import { CategoryView, LatestVideos } from "./components";
import { InfoFooter, Loader } from "../../components";
import { PlaylistVideosView } from "../Playlists/components";
import { ListInfoHeader } from "../../components";
import { usePageContentTopPadding } from "../../hooks";

export const ChannelScreen = () => {
  const { backend, channel } = useLocalSearchParams<RootStackParams[ROUTES.CHANNEL]>();

  const { data: channelInfo, isLoading: isLoadingChannelInfo } = useGetChannelInfoQuery(channel);
  const { data: categories } = useGetCategoriesQuery({});
  const { data: playlists } = useGetChannelPlaylistsQuery(channel);
  const { top } = usePageContentTopPadding();

  return (
    <Screen style={{ padding: 0, paddingTop: top }}>
      {isLoadingChannelInfo ? (
        <Loader />
      ) : (
        <ListInfoHeader
          avatarUrl={
            channelInfo?.avatars?.[0]?.path ? `https://${backend}${channelInfo?.avatars?.[0]?.path}` : undefined
          }
          name={channelInfo?.displayName}
          description={channelInfo?.description}
          linkHref={channelInfo?.url}
        />
      )}
      <LatestVideos />
      {playlists?.map(({ uuid, displayName, id, videoChannel }) => (
        <PlaylistVideosView channel={videoChannel?.name} id={id} title={displayName} key={uuid} />
      ))}
      {categories?.map((category) => <CategoryView channelHandle={channel} category={category} key={category.id} />)}
      <InfoFooter />
    </Screen>
  );
};
