import "../styles/globals.scss";
import UserMatchesProvider from "context/UserMatchesProvider";

import { useEffect } from "react";
import { useRouter } from "next/router";
import * as gtag from "../utils/gtag";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <UserMatchesProvider>
      <Component {...pageProps} />
    </UserMatchesProvider>
  );
}

export default MyApp;
