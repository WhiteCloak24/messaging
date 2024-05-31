import { addUserQuery, checkEmailExist } from "../queries/AuthQueries.js";
import jwt from "jsonwebtoken";

const SECRET_KEY = "askldhnaskhdkasdkasndlsakd234ewq90ei";

const session = new Map();

export const loginController = async (req, res) => {
  const { email = "", username = "" } = req.body;
  const cookies = req.cookies;
  console.log({ cookies });
  const queryResult = await checkEmailExist({ email: email });
  if (queryResult?.length > 0) {
    const userData = queryResult?.[0];
    const userAgent = req.headers["user-agent"];
    const clientIP = req.ip;
    const token = jwt.sign({ clientIP, userAgent }, SECRET_KEY, { expiresIn: "300" });
    res.cookie("sessionId", token, {
      httpOnly: true, // HTTP-only, prevents access via JavaScript
      secure: true, // For https set true
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiry
      sameSite: "None",
    });
    res.json({ userData, userAgent, clientIP });
  } else {
    const queryResult = await addUserQuery({ email, username });
    console.log(queryResult);
    res.send("User not found");
  }
};
