import { Pressable, StyleSheet, View } from "react-native";
import { Logo } from "../../components/Svg";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { InfoFooter, PlatformCard, SourceSelect, Typography } from "../../components";
import { useBreakpoints } from "../../hooks";
import { Spacer } from "../../components/shared/Spacer";
import { spacing } from "../../theme";
import { Screen } from "../../layouts";
import { useState } from "react";
import { useAppConfigContext } from "../../contexts";

export const LandingScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { isDesktop } = useBreakpoints();
  const [isInstanceSelectVisible, setIsInstanceSelectVisible] = useState(false);
  const { featuredInstances } = useAppConfigContext();

  return (
    <Screen style={{ padding: 0, paddingTop: isDesktop ? spacing.xxxl : spacing.xxl }}>
      <View style={[styles.container, { maxWidth: isDesktop ? "38%" : "95%" }]}>
        <Logo textColor={colors.theme950} width={isDesktop ? "125.5" : "90"} height={isDesktop ? "56" : "40"} />
        <Spacer height={spacing.xl} />
        <Typography
          style={styles.centeredText}
          fontWeight="Bold"
          fontSize={isDesktop ? "sizeXXL" : "sizeXL"}
          color={colors.theme900}
        >
          {t("welcomeText")}
        </Typography>
        <Spacer height={12} />
        <Typography
          style={styles.centeredText}
          fontWeight="Regular"
          fontSize={isDesktop ? "sizeLg" : "sizeMd"}
          color={colors.theme800}
        >
          {t("welcomeDescriptionText")}
        </Typography>
      </View>
      <Spacer height={isDesktop ? spacing.xxxl : spacing.xxl} />
      <Typography fontWeight="Bold" fontSize={isDesktop ? "sizeXL" : "sizeLg"}>
        {t("exploreVideoSites")}
      </Typography>
      <Spacer height={isDesktop ? spacing.xxl : spacing.xl} />
      <View style={styles.platformsContainer}>
        {featuredInstances?.map((platform, index) => (
          <View
            key={index}
            style={{ width: isDesktop ? 392 : 344, alignSelf: "flex-start", height: isDesktop ? 164 : 132 }}
          >
            <PlatformCard {...platform} />
          </View>
        ))}
      </View>
      <Spacer height={spacing.lg} />
      <Pressable onPress={() => setIsInstanceSelectVisible(true)}>
        <Typography style={{ textDecorationLine: "underline" }}>{t("otherSites")}</Typography>
      </Pressable>
      {isInstanceSelectVisible && <SourceSelect />}
      <InfoFooter showBuildInfo />
    </Screen>
  );
};

const styles = StyleSheet.create({
  centeredText: { textAlign: "center" },
  container: { alignItems: "center" },
  platformsContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    gap: spacing.md,
    justifyContent: "center",
    width: "76%",
  },
});
