window.AgendaLogic = {
  calculateDailyProgress: function(medsArray) {
    if (!medsArray || medsArray.length === 0) return { taken: 0, total: 0, progress: 0 };
    const total = medsArray.length;
    const taken = medsArray.filter(m => m.status === 'tomado').length;
    const progress = Math.round((taken / total) * 100);
    return { taken, total, progress };
  },
  
  countDelayedMeds: function(medsArray) {
    if (!medsArray) return 0;
    return medsArray.filter(m => m.status === 'atrasado').length;
  },

  isTimePassed: function(timeStr) {
    if (!timeStr) return false;
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    if (currentHours > hours) return true;
    if (currentHours === hours && currentMinutes >= minutes) return true;
    return false;
  }
};

// For Node.js/Jest environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.AgendaLogic;
}
