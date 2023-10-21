const express = require('express');
const eventRouter = express.Router();
const controller = require('../controllers/eventsController');
const { fileUpload } = require('../middleware/fileUpload');

// GET /events - send all events to the user
eventRouter.get('/', controller.index)

// GET /events/new - send html for creating a new event
eventRouter.get('/new', controller.newEvent);

// POST /events - create a new event and redirect user back to all of the events
eventRouter.post('/', fileUpload, controller.postEvent);

// GET /events/:id - send details for the event with the given id
eventRouter.get('/:id', controller.getEventById);

// GET /events/:id/edit - send details for the event that will be edited with the given id
eventRouter.get('/:id/edit', controller.editEvent);

// PUT /events/:id - update the event with the given id and redirect user back to all of the event with the given id
eventRouter.put('/:id', fileUpload, controller.updateEvent)

// DELETE /events/:id - delete the event with the given id
eventRouter.delete('/:id', controller.deleteEvent)


module.exports = eventRouter;