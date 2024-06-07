const express = require('express');
const app = express();
const port = 3004;

app.get('/', async (req, res) => {
    const postData = {
      token:
        '70d58cf109429b8eb537ec59b0e73bbb0d510ed2060becb0b27edbec9590f2159294dfe3a3445b5ed0bf89de97e5ee47e8e34724b0afe85c02058cc128e58d46',
      uid: '19350498-1',
      oid: 'Lifebox-chile',
    };
  
    try {
      const response = await fetch('http://localhost:3000/api/sso/login', {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        redirect: 'follow',
      });
  
      if (response.redirected) {
        res.redirect(response.url);
      } else {
        const responseBody = await response.text();
        res.status(response.status).send(responseBody);
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('An error occurred');
    }
  });
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
  