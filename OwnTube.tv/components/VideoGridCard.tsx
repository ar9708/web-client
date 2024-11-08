import { Pressable, StyleSheet, View } from "react-native";
import { VideoThumbnail } from "./VideoThumbnail";
import { GetVideosVideo } from "../api/models";
import { Link } from "expo-router";
import { ROUTES } from "../types";
import { Typography } from "./Typography";
import { spacing } from "../theme";
import { useBreakpoints, useHoverState, useViewHistory } from "../hooks";
import { useTheme } from "@react-navigation/native";
import { ChannelLink } from "./ChannelLink";
import { formatDistanceToNow } from "date-fns";
import { useTranslation } from "react-i18next";
import { LANGUAGE_OPTIONS } from "../i18n";
import { useState } from "react";

interface VideoGridCardProps {
  video: GetVideosVideo;
  backend?: string;
}

export const VideoGridCard = ({ video, backend }: VideoGridCardProps) => {
  const { isDesktop } = useBreakpoints();
  const { colors } = useTheme();
  const { isHovered, toggleHovered } = useHoverState();
  const { t, i18n } = useTranslation();
  const { getViewHistoryEntryByUuid } = useViewHistory({ enabled: false });
  const { timestamp } = getViewHistoryEntryByUuid(video.uuid) || {};
  const [containerWidth, setContainerWidth] = useState(0);

  return (
    <View style={styles.container}>
      <Pressable style={styles.pressableContainer} onPress={null} onHoverIn={toggleHovered} onHoverOut={toggleHovered}>
        <Link
          onLayout={(e) => {
            setContainerWidth(e.nativeEvent.layout.width);
          }}
          style={styles.linkWrapper}
          href={{ pathname: `/${ROUTES.VIDEO}`, params: { id: video.uuid, backend, timestamp } }}
        >
          <VideoThumbnail
            imageDimensions={{ width: containerWidth, height: containerWidth * (9 / 16) }}
            video={video}
            timestamp={timestamp}
            backend={backend}
          />
        </Link>
        <View style={styles.textContainer}>
          <Link href={{ pathname: ROUTES.VIDEO, params: { id: video.uuid, backend } }}>
            <Typography
              fontWeight="Medium"
              color={colors.theme900}
              fontSize={isDesktop ? "sizeMd" : "sizeSm"}
              numberOfLines={4}
              style={{ textDecorationLine: isHovered ? "underline" : undefined }}
            >
              {video.name}
            </Typography>
          </Link>
        </View>
      </Pressable>
      <View style={styles.restInfoContainer}>
        <ChannelLink
          href={{ pathname: `/${ROUTES.CHANNEL}`, params: { channel: video.channel?.name, backend } }}
          text={video.channel?.displayName}
        />
        <Typography fontSize="sizeXS" fontWeight="Medium" color={colors.themeDesaturated500}>
          {`${video.publishedAt ? formatDistanceToNow(video.publishedAt, { addSuffix: true, locale: LANGUAGE_OPTIONS.find(({ value }) => value === i18n.language)?.dateLocale }) : ""} • ${t("views", { count: video.views })}`}
        </Typography>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    gap: spacing.sm,
    height: "auto",
    maxWidth: "100%",
  },
  linkWrapper: { flex: 1 },
  pressableContainer: { gap: spacing.md },
  restInfoContainer: { gap: spacing.xs, paddingHorizontal: spacing.sm },
  textContainer: { gap: spacing.sm, paddingHorizontal: spacing.sm },
});
