// generate_screenshots.js
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const outputDir = path.resolve(__dirname, 'assets', 'screenshots');
  if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Repassa os logs do console do navegador para o seu terminal para depuração rápida
  page.on('console', msg => {
    console.log(`[Navegador] ${msg.text()}`);
  });

  await page.setViewport({ width: 1280, height: 1000, deviceScaleFactor: 2 });

  const indexPath = `file://${path.resolve(__dirname, 'index.html')}`;
  console.log('Carregando a aplicação estática...');
  await page.goto(indexPath, { waitUntil: 'networkidle0' });

  // Aguarda até que o appState (léxico ou global) esteja disponível na página
  console.log('Aguardando inicialização do appState...');
  try {
    await page.waitForFunction(() => {
      return (typeof appState !== 'undefined' && appState !== null) ||
             (typeof window.appState !== 'undefined' && window.appState !== null);
    }, { timeout: 5000 });
    console.log('Mecanismo de estado detectado.');
  } catch (err) {
    console.error('[ERRO] appState não encontrado. Verifique se o js/state.js está carregando corretamente.');
    await browser.close();
    process.exit(1);
  }

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
    { id: 'screen-4', role: 'patient' },
    { id: 'screen-5', role: 'patient' },
    { id: 'screen-6', role: 'patient' }
  ];

  console.log('Iniciando captura de telas...');

  for (const target of screenSequence) {
    // Altera o estado léxico ou de window preservando as demais configurações do mock
    await page.evaluate((role) => {
      let state = null;
      if (typeof appState !== 'undefined') {
        state = appState;
      } else if (typeof window.appState !== 'undefined') {
        state = window.appState;
      }

      if (state) {
        if (!state.user) state.user = {};
        state.user.role = role;
      } else {
        console.error('[Puppeteer] Erro crítico: impossível acessar o objeto de estado.');
      }
    }, target.role);

    // Executa a navegação pela API do roteador
    const navigationSuccess = await page.evaluate((id) => {
      if (typeof window.showScreen === 'function') {
        window.showScreen(id);
        return true;
      }
      return false;
    }, target.id);

    if (!navigationSuccess) {
      console.error(`[ERRO] Falha ao acionar showScreen para a tela: ${target.id}`);
      continue;
    }

    // Espera as transições visuais e renderização de dados estabilizarem
    await new Promise(r => setTimeout(r, 450));

    // Captura exclusivamente o mockup do dispositivo
    const phoneContainer = await page.$('#phone-container');
    if (phoneContainer) {
      const fileName = `screen_${target.id}.png`;
      const outputPath = path.join(outputDir, fileName);

      await phoneContainer.screenshot({ path: outputPath });
      console.log(`[OK] Capturada: ${target.id}`);
    } else {
      console.warn(`[AVISO] #phone-container não encontrado na tela: ${target.id}`);
    }
  }

  await browser.close();
  console.log('Todas as telas foram processadas.');
})();
