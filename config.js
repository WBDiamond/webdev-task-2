module.exports = {
  port: 8080,
  recordsPerPage: 5,
  accessibleProperties: [
    'place',
    'isVisited',
    'description',
  ],
  debug: true,
  errorMessages: {
    RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
    INVALID_INPUT_PARAMETERS: 'INVALID_INPUT_PARAMETERS',
  },
};
