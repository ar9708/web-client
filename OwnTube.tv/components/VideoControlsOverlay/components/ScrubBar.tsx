import { StyleSheet, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useEffect, useMemo, useState } from "react";
import { Typography } from "../../Typography";
import { getHumanReadableDuration } from "../../../utils";
import { borderRadius, spacing } from "../../../theme";

interface ScrubBarProps {
  percentagePosition: number;
  percentageAvailable?: number;
  onDrag: (position: number) => void;
  length: number;
  isExpanded: boolean;
  variant: "volume" | "seek";
  onUpdate?: () => void;
}

const INDICATOR_SIZE = 12;
const HALF_INDICATOR_SIZE = INDICATOR_SIZE / 2;
const SEEK_HINT_OFFSET = 26;
const SEEK_HINT_COLOR = "#151E29";

export const ScrubBar = ({
  percentageAvailable,
  percentagePosition,
  onDrag,
  length,
  isExpanded,
  variant,
  onUpdate,
}: ScrubBarProps) => {
  const { colors } = useTheme();
  const [visibleWidth, setVisibleWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [scrubberPosition, setScrubberPosition] = useState(0);

  const handleTapOrPan = (x: number) => {
    if (visibleWidth < x || x < 0) {
      return;
    }

    setScrubberPosition(x > HALF_INDICATOR_SIZE ? x - HALF_INDICATOR_SIZE : 0);
  };

  const setPosition = (x: number) => {
    const newX = visibleWidth <= x ? visibleWidth : x < 0 ? 0 : x;

    const newPositionRelation = (newX - HALF_INDICATOR_SIZE) / visibleWidth;

    onDrag(Math.floor(newPositionRelation * length));
  };

  const pan = Gesture.Pan()
    .onUpdate(({ x }) => {
      onUpdate?.();
      handleTapOrPan(x);
    })
    .onStart(() => setIsDragging(true))
    .onEnd(({ x }) => {
      setPosition(x);
      setIsDragging(false);
    })
    .minDistance(0)
    .runOnJS(true);

  useEffect(() => {
    if (!isDragging) {
      setScrubberPosition((visibleWidth / 100) * percentagePosition);
    }
  }, [percentagePosition, visibleWidth]);

  const seekHint = useMemo(() => {
    const newPosition = scrubberPosition - SEEK_HINT_OFFSET;
    const hintMs = scrubberPosition / visibleWidth;

    return {
      text: getHumanReadableDuration(length * (hintMs > 0 ? hintMs : 0)),
      position: newPosition < 0 ? 0 : newPosition,
    };
  }, [scrubberPosition, visibleWidth, length]);

  const indicatorPosition = useMemo(() => {
    return scrubberPosition > HALF_INDICATOR_SIZE ? scrubberPosition - HALF_INDICATOR_SIZE : 0;
  }, [scrubberPosition]);

  const colorVariant = useMemo(() => {
    return {
      volume: {
        position: colors.white94,
        indicator: colors.white94,
      },
      seek: {
        position: colors.theme600,
        indicator: colors.theme600,
      },
    }[variant];
  }, [variant, colors]);

  return (
    <View style={styles.gestureHandlerContainer}>
      <GestureDetector gesture={pan}>
        <View collapsable={false} style={styles.scrubBarHitSlop}>
          <View
            style={[
              styles.scrubBarContainer,
              {
                backgroundColor: colors.white25,
              },
            ]}
            onLayout={(event) => setVisibleWidth(event.nativeEvent.layout.width)}
          >
            {isDragging && variant === "seek" && (
              <View
                style={[
                  styles.seekTime,
                  {
                    backgroundColor: SEEK_HINT_COLOR,
                    left: seekHint.position,
                  },
                ]}
              >
                <Typography fontSize="sizeXS" color={colors.white94} fontWeight="Medium">
                  {seekHint.text}
                </Typography>
              </View>
            )}
            {isExpanded && (
              <View
                style={[
                  styles.indicator,
                  {
                    backgroundColor: isDragging ? colors.white94 : colorVariant.indicator,
                    left: indicatorPosition,
                  },
                ]}
              />
            )}
            <View
              style={[
                styles.percentageAvailableBar,
                {
                  backgroundColor: colors.white80,
                  width: `${percentageAvailable || 0}%`,
                },
              ]}
            />
            <View
              style={[
                styles.percentagePositionBar,
                {
                  backgroundColor: colorVariant.position,
                  width: scrubberPosition,
                  height: isExpanded ? 6 : 4,
                },
              ]}
            />
          </View>
        </View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  gestureHandlerContainer: {
    alignItems: "center",
    height: spacing.md,
    position: "relative",
    width: "100%",
  },
  indicator: {
    borderRadius: borderRadius.radiusSm,
    height: INDICATOR_SIZE,
    position: "absolute",
    top: -spacing.xs,
    width: INDICATOR_SIZE,
    zIndex: 4,
  },
  percentageAvailableBar: {
    height: spacing.xs,
    left: 0,
    position: "absolute",
    zIndex: 1,
  },
  percentagePositionBar: {
    zIndex: 2,
  },
  scrubBarContainer: {
    alignItems: "center",
    flexDirection: "row",
    height: spacing.xs,
    width: "100%",
  },
  scrubBarHitSlop: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  seekTime: {
    borderRadius: borderRadius.radiusMd,
    padding: spacing.xs,
    position: "absolute",
    top: -32,
  },
});
