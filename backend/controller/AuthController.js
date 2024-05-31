import { addUserQuery, checkEmailExist } from "../queries/AuthQueries.js";
import { generateSessionId } from "../resources/helper.js";


export const loginController = async (req, res) => {
  const { email = "", username = "" } = req.body;
  const cookies = req.cookies;
  const queryResult = await checkEmailExist({ email: email });
  if (queryResult?.length > 0) {
    const userData = queryResult?.[0];
    const userAgent = req.headers["user-agent"];
    const clientIP = req.ip;
    const sessionId = generateSessionId();
    res.cookie("sessionId", sessionId, {
      httpOnly: true, // HTTP-only, prevents access via JavaScript
      secure: true, // For https set true
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
      sameSite: "None",
    });
    res.json({ userData, userAgent, clientIP });
  } else {
    const queryResult = await addUserQuery({ email, username });
    res.send("User not found");
  }
};
