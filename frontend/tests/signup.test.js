const axios = require('axios')

describe("Signup 1000 Users", () => {
  const baseUrl = "http://localhost:4000/auth/signup";

  for (let i = 1; i <= 1000; i++) {
    const user_name = `user${i}`;
    const email = `user${i}@example.com`;
    const password = "password123";

    test(`should sign up user ${i}`, async () => {
      const response = await axios.post(baseUrl, {
        user_name,
        email,
        password,
      });
      expect(response.status).toBe(201); // Adjust based on your API response
    });
  }
});
