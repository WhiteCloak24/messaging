const InsertQuery = await client.execute(`INSERT INTO test.users (
    firstname,
    lastname,
    email
    )
    VALUES (
      'First',
      'Name',
      '${email}'
    )
  ;`);