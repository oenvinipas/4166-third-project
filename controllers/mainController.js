const model = require("../models/eventsModel");

exports.renderIndex = (req, res) => {
  let events = model.find();
  res.render("index", { events });
};

exports.renderAbout = (req, res) => {
  res.render("about");
};

exports.renderContact = (req, res) => {
  res.render("contact");
};
