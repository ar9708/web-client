import { StyleSheet, View } from "react-native";
import { spacing } from "../theme";
import { Button } from "./shared";
import { useShareButton } from "../hooks/useShareButton";

export const AppDesktopHeader = () => {
  const { handleToggleShareModal } = useShareButton();

  return (
    <View style={styles.container} pointerEvents="box-none">
      <Button onPress={handleToggleShareModal} contrast="low" style={styles.button} icon="Share" />
    </View>
  );
};

const styles = StyleSheet.create({
  button: { alignSelf: "flex-end", height: 36, paddingVertical: 6 },
  container: {
    height: 60,
    paddingLeft: spacing.lg,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xl,
    position: "absolute",
    top: 0,
    width: "100%",
  },
});
