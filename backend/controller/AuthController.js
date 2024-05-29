import { addUserQuery, checkEmailExist } from "../queries/AuthQueries.js";

const sessions = new Map();

export const loginController = async (req, res) => {
  const { email = "", username = "" } = req.body;
  const queryResult = await checkEmailExist({ email: email });
  if (queryResult?.length > 0) {
    const userData = queryResult?.[0];
    const userAgent = req.headers["user-agent"];
    const clientIP = req.ip;

    res.json({ userData, userAgent, contentType, clientIP, url });
  } else {
    const queryResult = await addUserQuery({ email, username });
    console.log(queryResult);
    res.send("User not found");
  }
};
