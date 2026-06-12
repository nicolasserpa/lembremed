const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  // Cria a pasta para os screenshots se não existir
  const outputDir = path.resolve(__dirname, 'assets', 'screenshots');
  if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Define viewport para acomodar bem o mockup de telefone
  await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 2 });

  // Carrega o index.html local
  const indexPath = `file://${path.resolve(__dirname, 'index.html')}`;
  await page.goto(indexPath);

  // Mapeamento exato das telas e permissões extraído do seu router.js
  const screenSequence = [
    // Public Screens
    { id: 'screen-1', role: null },
    { id: 'screen-2', role: null },
    { id: 'screen-3', role: null },

    // Patient Screens
    { id: 'screen-patient-home', role: 'patient' },
    { id: 'screen-patient-meds', role: 'patient' },
    { id: 'screen-patient-alerts', role: 'patient' },
    { id: 'screen-patient-settings', role: 'patient' },

    // Caregiver Screens
    { id: 'screen-7', role: 'caregiver' },
    { id: 'screen-add-patient', role: 'caregiver' },
    { id: 'screen-8', role: 'caregiver' },
    { id: 'screen-9', role: 'caregiver' },
    { id: 'screen-10', role: 'caregiver' },
    { id: 'screen-11', role: 'caregiver' },

    // Shared Screens
    { id: 'screen-4', role: 'patient' }, // using patient role to bypass rbac
    { id: 'screen-5', role: 'patient' },
    { id: 'screen-6', role: 'patient' }
  ];

  console.log('Iniciando captura automatizada das telas...');

  for (const target of screenSequence) {
    // Injeta o estado de role correto no contexto da página para passar pelo RBAC Guard
    // Além de resetar o modo para que dados nativos de mock sejam populados pela app
    await page.evaluate((role) => {
      if (!window.appState) {
        window.appState = { patients: {} };
      }
      if (!window.appState.user) {
        window.appState.user = {};
      }

      // Define a role para passar no Route Guard
      window.appState.user.role = role;

      // Setting app mode to default (not 'pitch') so `initAgendaData()` maps baseline mock data
      window.appState.mode = 'default';

      // Mock some patients base data so other screens that check 'patients' object will render with content
      if (Object.keys(window.appState.patients).length === 0) {
        window.appState.patients = {
          'mock-patient-id': {
             name: 'Dona Maria',
             history: [],
             alerts: [
               { id: 1, type: 'atrasado', message: 'Atrasou a Dipirona', time: '12:00' }
             ]
          }
        };
      }

      // In case we need patientsProfileData to have basic info
      if (!window.patientsProfileData) {
        window.patientsProfileData = {};
      }
      if (!window.patientsProfileData['mock-patient-id']) {
         window.patientsProfileData['mock-patient-id'] = {
           name: 'Dona Maria',
           meds: [
             { name: 'Losartana', dose: '50mg', time: '08:00', status: 'pendente' }
           ]
         };
      }

      // Force reinitalization of agenda data if initAgendaData exists
      if (typeof window.initAgendaData === 'function') {
         window.initAgendaData();
      }
    }, target.role);

    // Dispara a navegação e força a execução do ciclo de vida da tela
    const navigationSuccess = await page.evaluate((id) => {
      if (typeof window.showScreen === 'function') {
        window.showScreen(id);
        return true;
      }
      return false;
    }, target.id);

    if (!navigationSuccess) {
      console.error(`[ERRO] Função showScreen não disponível para a tela: ${target.id}`);
      continue;
    }

    // Espera sutil para garantir que transições de opacidade/CSS terminem e dados sejam renderizados
    await new Promise(r => setTimeout(r, 600));

    // Captura apenas o mock de telefone (#phone-container)
    const phoneContainer = await page.$('#phone-container');
    if (phoneContainer) {
      const fileName = `screen_${target.id}.png`;
      const outputPath = path.join(outputDir, fileName);

      await phoneContainer.screenshot({ path: outputPath });
      console.log(`[OK] Capturada: ${target.id} -> ${fileName}`);
    } else {
      console.warn(`[AVISO] Seletor #phone-container não encontrado ao renderizar: ${target.id}`);
    }
  }

  await browser.close();
  console.log(`Processo finalizado. Screenshots salvos em: ${outputDir}`);
})();
