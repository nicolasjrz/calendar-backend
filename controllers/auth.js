const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/User");
const { generateJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {
  const { name, email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "el usuario ya existe",
      });
    }

    usuario = new Usuario(req.body);
    // encriptar pasword

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await usuario.save();

    const token = await generateJWT(usuario._id, usuario.name);

    res
      .status(201)
      .json({ ok: true, uid: usuario._id, name: usuario.name, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Usuario y password invalidos.",
      });
    }

    //confinar los passwords

    const validPassword = bcrypt.compareSync(password, usuario.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    /// generar nuestro JWT

    const token = await generateJWT(usuario._id, usuario.name);

    res.json({ ok: true, uid: usuario._id, name: usuario.name, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador",
      token,
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const { uid, name } = req;

  ///generar nuevo token
  const token = await generateJWT(uid, name);

  res.json({ ok: true, token });
};

module.exports = { crearUsuario, loginUsuario, revalidarToken };
