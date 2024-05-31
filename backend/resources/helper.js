// const InsertQuery = await client.execute(`INSERT INTO test.users (
//     firstname,
//     lastname,
//     email
//     )
//     VALUES (
//       'First',
//       'Name',
//       '${email}'
//     )
//   ;`);

export function generateSessionId(length = 32) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let sessionId = '';

  for (let i = 0; i < length; i++) {
    sessionId += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return sessionId;
}