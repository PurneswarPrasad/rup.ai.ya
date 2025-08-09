import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import pkceChallenge from "pkce-challenge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const startGoogleLogin = async () => {
  // your PKCE code
  const clientId = "59244370203-nrd4pnk7q5k2ob3tscsaj43q1jh4s6ag.apps.googleusercontent.com";
  const redirectUri = import.meta.env.PROD 
  ? "https://rup-ai-ya.vercel.app/auth/callback" 
  : import.meta.env.VITE_GOOGLE_REDIRECT_URI; // your app's redirect URL
  const scope = "openid email profile"; // request identity & email access
  const state = crypto.randomUUID(); // prevent CSRF attacks

  // Generate PKCE code verifier and challenge
  const { code_challenge, code_verifier } = await pkceChallenge();

  // Store verifier and state temporarily in sessionStorage
  sessionStorage.setItem("code_verifier", code_verifier);
  sessionStorage.setItem("oauth_state", state);
  // Build the Google OAuth 2.0 URL
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scope);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", code_challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  // 🔁 Redirect user to Google for login
  window.location.href = authUrl.toString();
};
