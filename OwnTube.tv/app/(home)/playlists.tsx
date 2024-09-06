import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import Head from "expo-router/head";
import { Playlists } from "../../screens";

export default function playlists() {
  const { t } = useTranslation();

  return (
    <>
      {Platform.select({
        default: null,
        web: (
          <Head>
            <title>{t("playlistsPageTitle")}</title>
            <meta name="description" content={`${t("appName")} ${t("playlistsPageTitle").toLowerCase()}`} />
          </Head>
        ),
      })}
      <Playlists />
    </>
  );
}