import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gg.Bloodgroup',
  appName: 'Blooddonation',
  webDir: 'www',
server: {
    androidScheme: 'https'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: [
        'sound',
        'badge',
        'alert'
      ],
    },
    Filesystem: {
      permissions: ["storage"],
    },
    SplashScreen: {
      "launchAutoHide": true,
      "launchShowDuration": 0
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon',
      iconColor: '#FF0000',
    },

  }, "cordova": {
    "preferences": {
      "LottieFullScreen": "true",
      "LottieHideAfterAnimationEnd": "true",
      "LottieAnimationLocation": "public/assets/splash.json",
    }
  }
};
export default config;
