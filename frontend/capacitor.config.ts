import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "io.ionic.stitched",
  appName: "Stitched",
  webDir: "dist",
  android: { adjustMarginsForEdgeToEdge: "disable" },
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: "DARK",
    },
    SplashScreen: { launchFadeOutDuration: 500 },
    LocalNotifications: {
      //smallIcon: "ic_stat_icon_config_sample" //default icon
      smallIcon: "ic_notif_icon",
      iconColor: "#68696b",
      sound: "",
    },
  },
};

export default config;
