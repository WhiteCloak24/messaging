import { checkUserExist, createUser, createUserSession } from "../models/user.js";
import { generateJWT, generateSessionId, getCurrentUTCTimestamp, hashPassword, verifyPassword } from "../utils/index.js";
import { validateUser, validateUserLogin } from "../utils/validation.js";
import expressAsyncHandler from "express-async-handler";

export const signupController = expressAsyncHandler(async (req, res) => {
  const { email = "", user_name = "", password = "" } = req.body;
  await validateUser(req.body);
  const hashedPassword = await hashPassword({ password });
  await createUser({ email: email?.toLowerCase(), user_name: user_name, password: hashedPassword });
  res.status(201).json({ success: true, message: "User created successfully" });
});
export const loginController = expressAsyncHandler(async (req, res) => {
  const { email = "", password = "" } = req.body;
  await validateUserLogin(req.body);
  const userData = await checkUserExist({ email: email });
  if (userData?.length > 0) {
    const refUserData = userData?.[0];
    const hashedPassword = refUserData.password;
    const isVerifiedPass = await verifyPassword({ hashedPassword, password });
    if (isVerifiedPass) {
      const user_agent = req.headers["user-agent"];
      const client_ip = req.headers["x-forwarded-for"] || req.ip;
      const user_id = refUserData?.user_id;
      const session_created_at = getCurrentUTCTimestamp();
      const session_id = generateSessionId();
      const jwt_token = generateJWT({
        session_created_at,
        session_id,
        email,
        client_ip,
        user_agent,
        user_id,
      });
      const sessionCreationResp = await createUserSession({
        user_id,
        session_created_at,
        jwt_token,
        session_id,
      });
      if (!sessionCreationResp || sessionCreationResp.info.queriedHost === null) {
        res.status(404).json({ success: true, message: "Unable to create session" });
      } else {
        res.cookie("session_created_at", session_created_at, {
          httpOnly: true, // HTTP-only, prevents access via JavaScript
          secure: true, // For https set true
          maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
          sameSite: "None",
        });
        res.cookie("session_id", session_id, {
          httpOnly: true, // HTTP-only, prevents access via JavaScript
          secure: true, // For https set true
          maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
          sameSite: "None",
        });
        res.status(200).json({ success: true, data: { user_id, email }, message: "User Logged in successfully" });
      }
    } else {
      res.status(404).json({ success: true, message: "Invalid password" });
    }
  } else {
    res.status(404).json({ success: true, message: "Email not found" });
  }
});
