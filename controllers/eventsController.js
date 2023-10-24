const model = require("../models/eventsModel");
const { DateTime } = require("luxon");

exports.index = async (req, res, next) => {
  const categories = await model.collection.distinct('category');
  const events = await model.find().lean().catch(err => next(err));
  events.forEach(event => {
    event.startDate = DateTime.fromJSDate(event.startDate).toLocaleString(
      DateTime.DATETIME_MED
    );
    event.endDate = DateTime.fromJSDate(event.endDate).toLocaleString(
        DateTime.DATETIME_MED
    );
  })
  const categoryEvents = categories.map(category => {
    return { title: category, events: events.filter(event => event.category === category) }
  })
  res.render('events/index', { categoryEvents })
};

exports.newEvent = (req, res) => {
  res.render("./events/newEvent");
};

exports.postEvent = (req, res, next) => {
  let event = new model(req.body);

  let image = "/images/";
  if (!req.file) {
    event.image = "/images/fillerImage.jpg"
  } else {
    event.image = image + req.file.filename;
  }

  event.save()
    .then((event) => {
      res.redirect("/events");
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err)
    })
};

exports.getEventById = (req, res, next) => {
  let id = req.params.id;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid event id from here");
    err.status = 400;
    return next(err);
  }

  model.findById(id)
    .lean()
    .then(event => {
      event.startDate = DateTime.fromJSDate(event.startDate).toLocaleString(
        DateTime.DATETIME_MED
      );
      event.endDate = DateTime.fromJSDate(event.endDate).toLocaleString(
        DateTime.DATETIME_MED
      );
      res.render("./events/event", { event });
    })
    .catch(err => {
      next(err)
    })
};

exports.editEvent = (req, res, next) => {
  let id = req.params.id;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid event id");
    err.status = 400;
    return next(err);
  }

  model.findById(id)
    .lean()
    .then(event => {
      if (event) {
        event.startDate = DateTime.fromJSDate(event.startDate).toISO({
          includeOffset: false,
        });
        event.endDate = DateTime.fromJSDate(event.endDate).toISO({
          includeOffset: false,
        });
        res.render("./events/edit", { event });
      } else {
        let err = new Error("Cannot find a event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch(err => {
      next(err);
    })
};

exports.updateEvent = (req, res, next) => {
  let id = req.params.id;
  let event = req.body;
  if (req.file) {
    event.image = `/images/${req.file.filename}`;
  } else {
    model.findById(id)
      .then(foundEvent => {
        event.image = foundEvent.image;
      })
      .catch(error => {
        let err = new Error("Cannot find image file");
        error.message = err
        error.status = 404;
        next(error);
      });
  }

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid event id");
    err.status = 400;
    return next(err);
  }

  model.findByIdAndUpdate(id, event, {useFindAndModify: false, runValidators: true})
    .then(event => {
      if (event) {
        res.redirect("/events/" + id);
      } else {
        let err = new Error("Cannot find a event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

exports.deleteEvent = (req, res, next) => {
  let id = req.params.id;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid event id");
    err.status = 400;
    return next(err);
  }
  
  model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(event => {
      if (event) {
        res.redirect("/events");
      } else {
        let err = new Error("Cannot find a event with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err)
    })
  
};
