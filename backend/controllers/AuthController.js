import { createUser } from "../models/user.js";
import { validateUser } from "../utils/validation.js";
import expressAsyncHandler from "express-async-handler";

export const signupController = expressAsyncHandler(async (req, res) => {
  const { email = "", user_name = "", password = "" } = req.body;
  await validateUser(req.body);
  await createUser({ email: email, user_name: user_name, password: password });
  res.status(201).json({ success: true, message: "User created successfully" });
});

// export const loginController = async (req, res) => {
//   const { email = "" } = req.body;
//   const queryResult = await checkEmailExist({ email: email });
//   if (queryResult?.length > 0) {
//     const userData = queryResult?.[0];
//     const userAgent = req.headers["user-agent"];
//     const clientIP = req.headers["x-forwarded-for"] || req.ip;
//     const user_id = userData?.user_id;
//     const created_at = getCurrentUTCTimestamp();
//     const session_id = generateSessionId();
//     const jwtToken = generateJWT({
//       created_at,
//       sessionId: session_id,
//       email,
//       created_at,
//     });
//     const sessionCreationResp = await createSessionQuery({
//       created_at,
//       session_id,
//       user_id,
//       token: jwtToken,
//     });
//     if (!sessionCreationResp || sessionCreationResp.info.queriedHost === null) {
//       res.json({
//         status: {
//           success: false,
//         },
//       });
//     } else {
//       res.cookie("session_created_at", created_at, {
//         httpOnly: true, // HTTP-only, prevents access via JavaScript
//         secure: true, // For https set true
//         maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
//         sameSite: "None",
//       });
//       res.cookie("session_id", session_id, {
//         httpOnly: true, // HTTP-only, prevents access via JavaScript
//         secure: true, // For https set true
//         maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
//         sameSite: "None",
//       });
//       res.json({
//         userData,
//         userAgent,
//         clientIP,
//         status: {
//           success: true,
//         },
//       });
//     }
//   } else {
//     // const queryResult = await addUserQuery({ email, username });
//     res.send("User not found");
//   }
// };
// export const signupController = async (req, res) => {
//   const { email = "", user_name = "", password = "" } = req.body;
//   const queryResult = await checkEmailExist({ email: email });
//   if (queryResult?.length > 0) {
//     const userData = queryResult?.[0];
//     const userAgent = req.headers["user-agent"];
//     const clientIP = req.headers["x-forwarded-for"] || req.ip;
//     const user_id = userData?.user_id;
//     const created_at = getCurrentUTCTimestamp();
//     const session_id = generateSessionId();
//     const jwtToken = generateJWT({
//       created_at,
//       sessionId: session_id,
//       email,
//       created_at,
//     });
//     const sessionCreationResp = await createSessionQuery({
//       created_at,
//       session_id,
//       user_id,
//       token: jwtToken,
//     });
//     if (!sessionCreationResp || sessionCreationResp.info.queriedHost === null) {
//       res.json({
//         status: {
//           success: false,
//         },
//       });
//     } else {
//       res.cookie("session_created_at", created_at, {
//         httpOnly: true, // HTTP-only, prevents access via JavaScript
//         secure: true, // For https set true
//         maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
//         sameSite: "None",
//       });
//       res.cookie("session_id", session_id, {
//         httpOnly: true, // HTTP-only, prevents access via JavaScript
//         secure: true, // For https set true
//         maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
//         sameSite: "None",
//       });
//       res.json({
//         userData,
//         userAgent,
//         clientIP,
//         status: {
//           success: true,
//         },
//       });
//     }
//   } else {
//     // const queryResult = await addUserQuery({ email, username });
//     res.send("User not found");
//   }
// };
