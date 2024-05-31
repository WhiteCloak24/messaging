import { getCurrentUTCTimestamp } from "../commons/index.js";
import { addUserQuery, checkEmailExist, createSessionQuery } from "../queries/AuthQueries.js";
import { generateJWT, generateSessionId } from "../resources/helper.js";

export const loginController = async (req, res) => {
  const { email = "", username = "" } = req.body;
  const queryResult = await checkEmailExist({ email: email });
  if (queryResult?.length > 0) {
    const userData = queryResult?.[0];
    const userAgent = req.headers["user-agent"];
    const clientIP = req.ip;
    const user_id = userData?.user_id;
    const created_at = getCurrentUTCTimestamp();
    const session_id = generateSessionId();
    const jwtToken = generateJWT({ created_at, sessionId: session_id, email });
    const sessionCreationResp = await createSessionQuery({ created_at, session_id, user_id, token: jwtToken });
    if (!sessionCreationResp || sessionCreationResp.info.queriedHost === null) {
      res.json({
        status: {
          success: false,
        },
      });
    } else {
      res.cookie("session_id", session_id, {
        httpOnly: true, // HTTP-only, prevents access via JavaScript
        secure: true, // For https set true
        maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
        sameSite: "None",
      });
      res.json({
        userData,
        userAgent,
        clientIP,
        status: {
          success: true,
        },
      });
    }
  } else {
    // const queryResult = await addUserQuery({ email, username });
    res.send("User not found");
  }
};
