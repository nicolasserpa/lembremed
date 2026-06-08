const AgendaLogic = require('../js/agenda_logic.js');

describe('Agenda Logic', () => {
  const mockMeds = [
    { name: 'Med A', status: 'tomado' },
    { name: 'Med B', status: 'tomado' },
    { name: 'Med C', status: 'atrasado' },
    { name: 'Med D', status: 'pendente' }
  ];

  describe('calculateDailyProgress', () => {
    it('should return 0 progress if no meds', () => {
      expect(AgendaLogic.calculateDailyProgress([])).toEqual({ taken: 0, total: 0, progress: 0 });
      expect(AgendaLogic.calculateDailyProgress(null)).toEqual({ taken: 0, total: 0, progress: 0 });
    });

    it('should correctly calculate taken count and percentage', () => {
      const result = AgendaLogic.calculateDailyProgress(mockMeds);
      expect(result.taken).toBe(2);
      expect(result.total).toBe(4);
      expect(result.progress).toBe(50); // 2/4 = 50%
    });

    it('should exclude "cancelado" and "ignorado" from the total', () => {
      const mixedMeds = [
        { name: 'Med A', status: 'tomado' },
        { name: 'Med B', status: 'cancelado' },
        { name: 'Med C', status: 'ignorado' },
        { name: 'Med D', status: 'pendente' }
      ];
      const result = AgendaLogic.calculateDailyProgress(mixedMeds);
      expect(result.taken).toBe(1);
      expect(result.total).toBe(2); // Only A and D count
      expect(result.progress).toBe(50); // 1/2 = 50%
    });

    it('should return 0 progress if all meds are excluded', () => {
      const excludedMeds = [
        { name: 'Med A', status: 'cancelado' },
        { name: 'Med B', status: 'ignorado' }
      ];
      const result = AgendaLogic.calculateDailyProgress(excludedMeds);
      expect(result.taken).toBe(0);
      expect(result.total).toBe(0);
      expect(result.progress).toBe(0);
    });
  });

  describe('countDelayedMeds', () => {
    it('should return 0 if no delayed meds', () => {
      const allTaken = [
        { name: 'Med A', status: 'tomado' },
        { name: 'Med B', status: 'tomado' }
      ];
      expect(AgendaLogic.countDelayedMeds(allTaken)).toBe(0);
    });

    it('should count only delayed meds', () => {
      expect(AgendaLogic.countDelayedMeds(mockMeds)).toBe(1);
    });
  });
});
