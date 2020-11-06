import "../styles/globals.scss";
import UserMatchesProvider from "context/UserMatchesProvider";

function MyApp({ Component, pageProps }) {
  return (
    <UserMatchesProvider>
      <Component {...pageProps} />
    </UserMatchesProvider>
  );
}

export default MyApp;
