const express = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} = require("../controllers/auth");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = express.Router();

router.post(
  "/new",
  [
    check("name", "el nombre es obligatirio").not().isEmpty(),
    check("email", "el email es obligatirio").isEmail(),
    check("password", "el password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  crearUsuario
);

router.post(
  "/",
  [
    check("email", "el email es obligatirio").isEmail(),
    check("password", "el password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginUsuario
);

router.get("/renew", validarJWT, revalidarToken);

module.exports = router;

// check('password',
// `La contraseña debe tener mínimo 8 caracteres.Debe contener una letra minúscula.Debe contener una letra mayúscula.Debe contener un carácter especial.Debe contener mínimo un número.`
// ).isLength({ min: 8 }).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
