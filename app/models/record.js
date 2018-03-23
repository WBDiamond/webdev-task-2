const uuid = require('uuid/v4');
const move = require('array-move');

const { recordsPerPage, accessibleProperties } = require('../../config');

const storage = [];

const sorters = {
  alph: ({ order, sortBy }) => {
    if (order === 'asc') {
      return (a, b) => a[sortBy].localeCompare(b[sortBy]);
    }
    return (a, b) => -a[sortBy].localeCompare(b[sortBy]);
  },
  date: ({ order }) => {
    if (order === 'asc') {
      return (a, b) => {
        if (a.creationDate > b.creationDate) {
          return 1;
        } else if (a.creationDate < b.creationDate) {
          return -1;
        }
        return 0;
      };
    }
    return (a, b) => {
      if (a.creationDate > b.creationDate) {
        return -1;
      } else if (a.creationDate < b.creationDate) {
        return 1;
      }
      return 0;
    };
  },
};

class Record {
  constructor({
    place, description, isVisited = false,
  }) {
    this.place = place;
    this.description = description;
    this.isVisited = isVisited === 'true';
    this.id = uuid();
    this.creationDate = new Date();
    this.error = null;
  }

  static getAll() {
    return storage;
  }

  static getSorted({ sort, sortBy = 'place', order = 'asc' }) {
    // eslint-disable-next-line no-prototype-builtins
    if (sorters.hasOwnProperty(sort)) {
      return storage.sort(sorters[sort]({ sortBy, order }));
    }
    return Record.getAll();
  }

  static getPage(page) {
    if ((page - 1) * recordsPerPage <= storage.length) {
      return storage.slice((page - 1) * recordsPerPage, page * recordsPerPage);
    }
    return storage.slice(
      (storage.length % recordsPerPage) * recordsPerPage,
      ((storage.length % recordsPerPage) + 1) * recordsPerPage,
    );
  }

  static searchByDescription(substring) {
    return storage.filter(record => record.description.indexOf(substring) !== -1);
  }

  static update(id, updatedProps) {
    const record = storage.find(element => element.id === id);
    if (!record) {
      return false;
    }
    Object.keys(updatedProps).forEach((prop) => {
      // eslint-disable-next-line no-prototype-builtins
      if (!record.hasOwnProperty(prop)) {
        if (!this.error) {
          this.error = [];
        }
        this.error.append(`Record's ${id} property '${prop}' doesn't exist`);
      }
      if (!accessibleProperties.includes(prop)) {
        if (!this.error) {
          this.error = [];
        }
        this.error.append(`Record's ${id} property '${prop}' is not accessible`);
      }
      if (prop === 'isVisited') {
        record[prop] = updatedProps[prop] === 'true';
      } else {
        record[prop] = updatedProps[prop];
      }
      return true;
    });

    return record;
  }

  static delete(id) {
    const recordIndex = storage.findIndex(record => record.id === id);
    if (recordIndex === -1) {
      return false;
    }

    storage.splice(recordIndex, 1);
    return true;
  }

  static deleteAll() {
    storage.length = 0;
    return true;
  }

  static move({ id, direction }) {
    const recordIndex = storage.findIndex(record => record.id === id);
    if (recordIndex === -1) {
      return false;
    }
    if (direction === 'up') {
      move.mut(storage, recordIndex, recordIndex - 1);
      return true;
    }

    if (direction === 'down') {
      move.mut(storage, recordIndex, recordIndex + 1);
      return true;
    }
    return false;
  }

  toJSON() {
    return {
      place: this.place,
      description: this.description,
      isVisited: this.isVisited,
      id: this.id,
      date: this.creationDate.toLocaleDateString('en-US'),
    };
  }

  save() {
    storage.push(this);
  }
}

module.exports = Record;
