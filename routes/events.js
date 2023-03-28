const express = require("express");
const { check } = require("express-validator");
const {
  getEvents,
  newEvent,
  uploadEvent,
  deleteEvent,
} = require("../controllers/events");
const { isDate } = require("../helpers/isDate");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const router = express.Router();

router.use(validarJWT);

/**
 *
 * Events routes
 * /api/event
 */
router.post(
  "/",
  [
    check("title", "el titulo es obligatorio").not().isEmpty(),
    check("start", "fecha de inicio es obligatorio").custom(isDate),
    check("end", "fecha de finalizacion es obligatorio").custom(isDate),

    validarCampos,
  ],
  newEvent
);
router.get("/", getEvents);

router.put("/:id", uploadEvent);

router.delete("/:id", deleteEvent);

module.exports = router;
