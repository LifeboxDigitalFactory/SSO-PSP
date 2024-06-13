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

app.get('/auto-set-token', async (req, res) => {
  // También puedes hacer una petición a la PSP para que te entregue un token, y luego hacer la petición de login.
  // Para esto, debes enviar un POST a la URL de la PSP con el uid (algún id de usuario inscrito en el proyecto) y key de tu organización.
  const postDataToken = {
    uid: 'ingresa_el_id_de_tu_usuario_aqui',
    key: 'ingresa_la_key_de_tu_organización_aqui',
  };

  try {
    // Hacemos la petición POST para obtener el token.
    const tokenPromiseResponse = await fetch('http://psp.lifebox.cl/api/sso/get-token', {
      method: 'POST',
      body: JSON.stringify(postDataToken),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    // Obtenemos el token de la respuesta.
    const tokenResponse = await tokenPromiseResponse.json();

    // Ahora que tenemos el token, podemos hacer la petición de login.
    const postData = {
      token: tokenResponse.token,
      uid: 'ingresa_tu_uid_aqui',
      oid: 'ingresa_tu_oid_aqui',
    };

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
