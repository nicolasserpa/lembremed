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

  describe('isValidPhone', () => {
    it('should return false for incomplete phone numbers', () => {
      expect(Validation.isValidPhone('123')).toBe(false);
      expect(Validation.isValidPhone('(11) 9876')).toBe(false);
      expect(Validation.isValidPhone(null)).toBe(false);
    });

    it('should return false for phone numbers with more than 11 digits', () => {
      expect(Validation.isValidPhone('119876543210')).toBe(false); // 12 digits
      expect(Validation.isValidPhone('(11) 98765-43210')).toBe(false); // 12 digits
    });

    it('should return true for valid 10 or 11 digit phones', () => {
      expect(Validation.isValidPhone('(11) 98765-4321')).toBe(true); // 11 digits
      expect(Validation.isValidPhone('(11) 8765-4321')).toBe(true);  // 10 digits
      expect(Validation.isValidPhone('11987654321')).toBe(true);
    });
  });

  describe('maskPhone', () => {
    it('should format 11 digits correctly', () => {
      expect(Validation.maskPhone('11987654321')).toBe('(11) 98765-4321');
    });

    it('should format 10 digits correctly', () => {
      expect(Validation.maskPhone('1187654321')).toBe('(11) 8765-4321');
    });
    
    it('should partially format as user types', () => {
      expect(Validation.maskPhone('11')).toBe('(11');
      expect(Validation.maskPhone('119')).toBe('(11) 9');
      expect(Validation.maskPhone('119876')).toBe('(11) 9876');
    });
  });
});
