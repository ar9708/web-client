import { StyleSheet, View } from "react-native";
import { spacing } from "../theme";
import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "./shared";
import { InstanceInfo } from "./InstanceInfo";
import { DrawerHeaderProps } from "@react-navigation/drawer";

interface AppHeaderProps extends DrawerHeaderProps {
  backend?: string;
}

export const AppHeader = ({ backend, ...props }: AppHeaderProps) => {
  const { colors } = useTheme();
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: top,
          backgroundColor: colors.theme50,
        },
      ]}
    >
      <Button style={styles.menuBtn} onPress={props.navigation.toggleDrawer} icon="Menu" contrast="low" />
      <InstanceInfo backend={backend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xl,
    padding: spacing.sm,
  },
  menuBtn: { height: 36, paddingVertical: 6 },
});