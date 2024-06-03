import cookieParser from "cookie-parser";
import cookie from "cookie";
import bcrypt from "bcrypt";

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

const saltRounds = 90; // Number of salt rounds

export const hashPassword = async ({ password }) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

export const verifyPassword = async ({ password, hashedPassword }) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
};
