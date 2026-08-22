import { SplashScreen } from "@/components/splash-loader";

/**
 * Fallback for every route under the app shell. The sidebar and header are
 * already painted by the layout above, so this only fills the content column.
 */
export default function AppLoading() {
  return <SplashScreen />;
}
