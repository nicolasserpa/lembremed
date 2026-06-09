const Validation = require('../js/validation.js');

describe('Validation Logic', () => {
  describe('isValidName', () => {
    it('should return false for empty or whitespace-only names', () => {
      expect(Validation.isValidName('')).toBe(false);
      expect(Validation.isValidName('   ')).toBe(false);
      expect(Validation.isValidName(null)).toBe(false);
      expect(Validation.isValidName(undefined)).toBe(false);
    });

    it('should return true for valid names', () => {
      expect(Validation.isValidName('John Doe')).toBe(true);
      expect(Validation.isValidName('Alice')).toBe(true);
    });
  });
});
