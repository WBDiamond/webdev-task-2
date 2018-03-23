const Record = require('../models/record');

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
    res.sendStatus(400);
  }
  res.json(Record.searchByDescription(req.query.substring).map(record => record.toJSON()));
};

exports.update = (req, res) => {
  const { id } = req.query;
  const updatedProps = req.body;
  if (!(id && updatedProps)) {
    res.sendStatus(400);
    return;
  }
  const updated = Record.update(id, updatedProps).toJSON();
  if (!updated) {
    res.sendStatus(404);
    return;
  }
  if (updated.error) {
    res.sendStatus(400).send(updated.error);
  } else {
    res.json(updated);
  }
};

exports.move = (req, res) => {
  if (!req.query) {
    res.sendStatus(400);
    return;
  }
  const { id, direction } = req.query;
  if (Record.move({ id, direction })) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};

exports.remove = (req, res) => {
  if (req.query.all) {
    Record.deleteAll();
    res.sendStatus(200);
    return;
  }
  if (!req.body.id) {
    res.sendStatus(400);
    return;
  }
  if (Record.delete(req.body.id)) {
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};
