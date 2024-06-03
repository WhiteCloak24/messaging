import cookieParser from "cookie-parser";
import cookie from "cookie";

export function getCurrentUTCTimestamp() {
  return Date.now();
}
export function parseCookies({ cookies = null }) {
  if (!cookies) return null;
  return cookieParser.JSONCookies(cookie.parse(cookies));
}
export function generateSessionId(length = 16) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let sessionId = "";

  for (let i = 0; i < length; i++) {
    sessionId += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return sessionId;
}

export function generateJWT({ email = "", sessionId = "", created_at = "" }) {
  const token = jwt.sign(
    {
      email,
      sessionId,
      created_at,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: 24 * 60 * 60 * 1000,
    }
  );
  return token;
}
export function createSession(length = 32) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let sessionId = "";

  for (let i = 0; i < length; i++) {
    sessionId += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return sessionId;
}
