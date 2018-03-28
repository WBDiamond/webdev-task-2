const Record = require('../models/record');
const { RECORD_NOT_FOUND, INVALID_INPUT_PARAMETERS } = require('../../config').errorMessages;

exports.create = (req, res) => {
  const record = new Record(req.body);
  record.save();

  res.json(record.toJSON());
};

exports.list = (req, res) => {
  const { sort, sortBy, order, page } = req.query;
  if (sort && page) {
    Record.getSorted({ sort, sortBy, order });
    res.json(Record.getPage(page).map(record => record.toJSON()));
    return;
  }
  if (sort) {
    res.json(Record.getSorted({ sort, sortBy, order }).map(record => record.toJSON()));
    return;
  }
  if (page) {
    res.json(Record.getPage(page).map(record => record.toJSON()));
    return;
  }
  res.json(Record.getAll().map(record => record.toJSON()));
};

exports.search = (req, res) => {
  if (!req.query.substring) {
    res.status(400).send(INVALID_INPUT_PARAMETERS);
  }
  res.json(Record.searchByDescription(req.query.substring).map(record => record.toJSON()));
};

exports.update = (req, res) => {
  const { id } = req.query;
  const updatedProps = req.body;
  if (!(id && updatedProps)) {
    res.status(400).send(INVALID_INPUT_PARAMETERS);
    return;
  }
  const updated = Record.update(id, updatedProps).toJSON();
  if (!updated) {
    res.status(404).send(RECORD_NOT_FOUND);
    return;
  }
  if (updated.error) {
    res.status(400).send(updated.error);
  } else {
    res.json(updated);
  }
};

exports.move = (req, res) => {
  if (!req.query) {
    res.status(400).send(INVALID_INPUT_PARAMETERS);
    return;
  }
  const { id, direction } = req.query;
  if (Record.move({ id, direction })) {
    res.sendStatus(200);
  } else {
    res.status(404).send(RECORD_NOT_FOUND);
  }
};

exports.remove = (req, res) => {
  if (req.query.all) {
    Record.deleteAll();
    res.sendStatus(200);
    return;
  }
  if (!req.body.ids) {
    res.status(400).send(INVALID_INPUT_PARAMETERS);
    return;
  }
  if (Record.deleteChunk(req.body.ids)) {
    res.sendStatus(200);
  } else {
    res.status(404).send(RECORD_NOT_FOUND);
  }
};
