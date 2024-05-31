import cookieParser from "cookie-parser";
import cookie from "cookie";

export function getCurrentUTCTimestamp() {
  return Date.now();
}
export function parseCookies({ cookies = null }) {
  if (!cookies) return null;
  return cookieParser.JSONCookies(cookie.parse(cookies));
}
