const { response } = require("express");
const { populate } = require("../models/Event");

const Event = require("../models/Event");

const newEvent = async (req, res = response) => {
  const evento = new Event(req.body);

  try {
    evento.user = req.uid;
    const eventSave = await evento.save();

    res.status(201).json({ ok: true, evento: eventSave });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "error en crear evento",
    });
  }
};

const getEvents = async (req, res = response) => {
  const eventos = await Event.find().populate("user", "name");
  try {
    res.status(200).json({
      ok: true,
      msg: "eventos cargados  correctamente",
      eventos: eventos,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "error en mostrar eventos",
    });
  }
};

const uploadEvent = async (req, res = response) => {
  const eventID = req.params.id;
  const uid = req.uid;
  try {
    const evento = await Event.findById(eventID);

    if (!evento)
      return res.status(404).json({
        ok: false,
        msg: "evento no existe por ese id",
      });

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "no tiene permisos para editar el evento",
      });
    }

    const newEvent = {
      ...req.body,
      user: uid,
    };

    const eventUpload = await Event.findByIdAndUpdate(eventID, newEvent, {
      new: true,
    });

    res.status(200).json({
      ok: true,
      msg: " evento actualizado correctamente",
      eventID,
      evento: eventUpload,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "error en actualizar evento",
    });
  }
};

const deleteEvent = async (req, res = response) => {
  const eventID = req.params.id;
  const uid = req.uid;
  try {
    const evento = await Event.findById(eventID);

    if (!evento)
      return res.status(404).json({
        ok: false,
        msg: "evento no existe por ese id",
      });

    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "no tiene permisos para eliminar el evento",
      });
    }

    await Event.findByIdAndDelete(eventID);

    res.status(200).json({
      ok: true,
      msg: "evento eliminado correctamente",
    });
  } catch (error) {
    return res.status(200).json({
      ok: false,
      msg: "error al eliminar evento",
    });
  }
};

module.exports = {
  newEvent,
  getEvents,
  uploadEvent,
  deleteEvent,
};
