const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signup = (req, res) => {
  try {
    const { password, email } = req.body;

    if (password.trim() === "" || email.trim() === "") {
      return res.status(400).json({
        codigo: "0",
        error: "Ingrese pass y email",
      });
    }

    // si el user ser guardo con exito
    const id = 10;
    const token = jwt.sign({ id, email }, process.env.API_KEY, {
      expiresIn: process.env.TOKEN_EXPIRES_IN,
    });

    return res
      .status(201)
      .json({ password: bcrypt.hashSync(password, 10), email, token });
  } catch (error) {
    return res.status(400).json({
      codigo: "0",
      error,
    });
  }
};

module.exports.login = (req, res) => {
  try {
    const { password, email } = req.body;
    if (password.trim() === "" || email.trim() === "") {
      return res.status(400).json({
        codigo: "0",
        error: "Ingrese pass y email",
      });
    }

    const existeUser = true;

    if (!existeUser) {
      return res.status(401).json({
        codigo: "0",
        mensaje:
          "¡Tu email o contraseña son incorrectos, por favor, veríficalo!",
      });
    }

    const usuarioExistente = {
      id: 10,
      password: "$2b$10$4W9Z.BNDqczLmoVzIh6hJOTpBP0ZW7FMqYHBAg1wpETJ1eKudxohC",
      email: "otromas@q.com",
      name: "David Ferrer",
    };

    if (bcrypt.compareSync(password, usuarioExistente.password)) {
      const token = jwt.sign(
        {
          email: usuarioExistente.email,
          id: usuarioExistente.id,
          name: usuarioExistente.name,
        },
        process.env.API_KEY,
        { expiresIn: process.env.TOKEN_EXPIRES_IN }
      );

      return res.status(200).json({
        codigo: "1",
        token,
      });
    } else {
      return res.status(200).json({
        codigo: "0",
        mensaje:
          "¡Tu email o contraseña son incorrectos, por favor, veríficalo!",
      });
    }
  } catch (error) {
    console.log(`error`, error);
    return res.status(400).json({
      codigo: "0",
      error,
    });
  }
};

/* 
"password": "$2b$10$LJMfkMvkLcYAVEZtXuQX/O8Z4WfLv1efz4lOXFYztvILthMDRc2I6",
"email": "otromas@q.com",
*/
