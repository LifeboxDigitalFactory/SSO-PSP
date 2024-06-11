const express = require('express');
const app = express();
const port = 3004;

app.get('/', async (req, res) => {
  // Aqui debes ingresar los valores oid que te entregamos, junto con algún identificador de usuario (uid)
  // y un token que debes generar siguiendo las instrucciones del manual de integración SSO de la PSP.

  const postData = {
    token: 'ingresa_tu_token_aqui',
    uid: 'ingresa_tu_uid_aqui',
    oid: 'ingresa_tu_oid_aqui',
  };

  try {
    // Una vez que tengas los datos listos, puedes hacer una petición POST a la URL de login de la PSP.
    const response = await fetch('https://psp.lifebox.cl/api/sso/login', {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      redirect: 'follow',
    });

    // Si la respuesta es un redirect, entonces redirigimos al usuario a la URL que nos entregó la PSP.
    if (response.redirected) {
      res.redirect(response.url);
    } else {
      // Si no, devolvemos el contenido de la respuesta al usuario.
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
