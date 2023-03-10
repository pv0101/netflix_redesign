import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "../hooks/useAuth";
import { RecoilRoot } from 'recoil'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // RecoilRoot is also higher order component, wraps whole application
    <RecoilRoot>
      {/* AuthProvider Higher order component, wraps whole application? */}
      <AuthProvider>
        {/* Component is our whole application. Wrapped inside of AuthProvider. At any level of the application we have access to our useAuth hook.  */}
        <Component {...pageProps} />
      </AuthProvider>
    </RecoilRoot>
  );
}
export default MyApp;
