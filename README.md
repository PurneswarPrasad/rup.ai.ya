# rup.AI.ya

This is the SIMPLEST expense tracker that you or any Indian could ever ask for!

## Setup Steps:

• Uses a GROQ-API for a web assistant & Google Client ID for O-Auth
  - GROQ : https://console.groq.com/home
  - Google Client ID : https://console.cloud.google.com/ and go ahead with the integrated Gemini assistant for any help.

• Clone the project and create a `.env` file in your root directory and paste them with these names:
  - `VITE_GROQ_API_KEY`
  - `VITE_GOOGLE_CLIENT_ID`
  - `VITE_REDIRECT_URI=http://localhost:8080/auth/callback`

• `npm install`

• `npm run dev`

And your savings go boom! 💥

## PLEASE NOTE:
• Authentication for this branch has been done on purely frontend using Google's OAuth PKCE(Proof Key for Code Exchange) flow, which involves client secret passing and not recommended for sensitive endpoints. This is suitable for SPAs.

