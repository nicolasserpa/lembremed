const Components = require('../js/components.js');

describe('Components Logic', () => {
  describe('escapeHTML', () => {
    it('should escape dangerous HTML characters', () => {
      const input = '<script>alert("XSS & hacking");</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS &amp; hacking&quot;);&lt;/script&gt;';
      expect(Components.escapeHTML(input)).toBe(expected);
    });

    it('should escape single quotes', () => {
      const input = "It's a test";
      const expected = 'It&#039;s a test';
      expect(Components.escapeHTML(input)).toBe(expected);
    });

    it('should handle null and undefined', () => {
      expect(Components.escapeHTML(null)).toBe('');
      expect(Components.escapeHTML(undefined)).toBe('');
    });

    it('should convert non-string values to strings and escape them', () => {
      expect(Components.escapeHTML(123)).toBe('123');
      expect(Components.escapeHTML(true)).toBe('true');
    });

    it('should return an empty string for an empty string input', () => {
      expect(Components.escapeHTML('')).toBe('');
    });
  });
});
