/**
 * Componentização HTML via JS Templates
 * Substitui blocos HTML duplicados por renderização dinâmica
 */

const Components = {
  /**
   * Prevents XSS by escaping dangerous characters
   */
  escapeHTML: function(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },
  
  /**
   * Renderiza a Bottom Navigation baseada no perfil e aba ativa
   * @param {string} role - 'patient' ou 'caregiver'
   * @param {string} activeTab - data-nav da aba ativa
   * @returns {string} HTML string da navegação
   */
  getBottomNav: function(role, activeTab) {
    if (role === 'patient') {
      return `
        <nav class="bottom-nav patient-nav">
          <div class="nav-tab ${activeTab === 'patient-home' ? 'active' : ''}" data-nav="patient-home" tabindex="0" role="link">
            <svg class="icon" viewBox="0 0 24 24" stroke-width="2.5"><use href="#icon-home"/></svg>
            Início
          </div>
          <div class="nav-tab ${activeTab === 'patient-agenda' ? 'active' : ''}" data-nav="patient-agenda" tabindex="0" role="link">
            <svg class="icon" viewBox="0 0 24 24" stroke-width="2.5"><use href="#icon-calendar"/></svg>
            Agenda
          </div>
          <div class="nav-tab ${activeTab === 'patient-meds' ? 'active' : ''}" data-nav="patient-meds" tabindex="0" role="link">
            <svg class="icon" viewBox="0 0 24 24" stroke-width="2.5"><use href="#icon-pill"/></svg>
            Remédios
          </div>
          <div class="nav-tab ${activeTab === 'patient-alerts' ? 'active' : ''}" data-nav="patient-alerts" tabindex="0" role="link">
            <svg class="icon" viewBox="0 0 24 24" stroke-width="2.5"><use href="#icon-bell"/></svg>
            Alertas
          </div>
          <div class="nav-tab ${activeTab === 'patient-settings' ? 'active' : ''}" data-nav="patient-settings" tabindex="0" role="link">
            <svg class="icon" viewBox="0 0 24 24" stroke-width="2.5"><use href="#icon-settings"/></svg>
            Ajustes
          </div>
        </nav>
      `;
    } else {
      return `
        <nav class="bottom-nav">
          <div class="nav-tab ${activeTab === 'pacientes' ? 'active' : ''}" data-nav="pacientes" tabindex="0" role="link">
            <svg class="icon" viewBox="0 0 24 24" stroke-width="2"><use href="#icon-users"/></svg>
            Pacientes
          </div>
          <div class="nav-tab ${activeTab === 'agenda' ? 'active' : ''}" data-nav="agenda" tabindex="0" role="link">
            <svg class="icon" viewBox="0 0 24 24" stroke-width="2"><use href="#icon-calendar"/></svg>
            Agenda
          </div>
          <div class="nav-tab ${activeTab === 'alertas' ? 'active' : ''}" data-nav="alertas" tabindex="0" role="link">
            <svg class="icon" viewBox="0 0 24 24" stroke-width="2"><use href="#icon-bell"/></svg>
            Alertas
          </div>
          <div class="nav-tab ${activeTab === 'config' ? 'active' : ''}" data-nav="config" tabindex="0" role="link">
            <svg class="icon" viewBox="0 0 24 24" stroke-width="2"><use href="#icon-settings"/></svg>
            Config
          </div>
        </nav>
      `;
    }
  }
};

// For Node.js/Jest environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Components;
}
