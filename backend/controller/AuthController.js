import { addUserQuery, checkEmailExist } from "../queries/AuthQueries.js";

export const loginController = async (req, res) => {
  const { email = "", username = "" } = req.body;
  const queryResult = await checkEmailExist({ email: email });
  if (queryResult?.length > 0) {
    const userData = queryResult?.[0];
    res.json(userData);
  } else {
    const queryResult = await addUserQuery({ email, username });
    console.log(queryResult);
    res.send("User not found");
  }
};
