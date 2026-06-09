window.Validation = {
  isValidName: function(name) {
    return typeof name === 'string' && name.trim().length > 0;
  }
};

// For Node.js/Jest environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.Validation;
}
