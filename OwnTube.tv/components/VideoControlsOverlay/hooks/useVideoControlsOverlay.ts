import { useLocalSearchParams, useRouter } from "expo-router";
import { RootStackParams } from "../../../app/_layout";
import { ROUTES } from "../../../types";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { useMemo, useState } from "react";
import { VideoControlsOverlayProps } from "../VideoControlsOverlay";

export const useVideoControlsOverlay = ({
  isPlaying,
  shouldReplay,
  availableDuration,
  duration,
  position,
}: Required<
  Pick<VideoControlsOverlayProps, "isPlaying" | "shouldReplay" | "availableDuration" | "duration" | "position">
>) => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.VIDEO]>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const router = useRouter();
  const [isSeekBarFocused, setIsSeekBarFocused] = useState(false);

  const centralIconName = useMemo(() => {
    return isPlaying ? "Pause" : shouldReplay ? "Restart" : "Play";
  }, [isPlaying, shouldReplay]);

  const { percentageAvailable, percentagePosition } = useMemo(() => {
    return {
      percentageAvailable: (availableDuration / duration) * 100,
      percentagePosition: (position / duration) * 100,
    };
  }, [availableDuration, duration, position]);

  const handlePressBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate({ pathname: `/${ROUTES.HOME}`, params: { backend } });
    }
  };

  return {
    isSeekBarFocused,
    setIsSeekBarFocused,
    handlePressBack,
    percentageAvailable,
    percentagePosition,
    centralIconName,
    t,
    colors,
    backend,
    router,
  };
};
