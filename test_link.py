import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()

        # Open Patient Tab
        page1 = await context.new_page()
        await page1.goto('http://localhost:8000')

        # Patient Registration
        await page1.wait_for_selector('#btn-flow-1')
        await page1.fill('#reg-name', 'Maria Silva')
        await page1.fill('#reg-age', '65')
        await page1.click('#btn-flow-1')
        await page1.click('.role-card[data-role="paciente"]')
        await page1.click('#btn-flow-2')
        await page1.click('#btn-flow-3')

        await asyncio.sleep(1)
        patient_code = await page1.evaluate('localStorage.getItem("lembremed_patient_code")')
        print(f"Patient Code: {patient_code}")

        # Open Caregiver Tab
        page2 = await context.new_page()
        await page2.goto('http://localhost:8000')

        # Caregiver Registration
        await page2.wait_for_selector('#btn-flow-1')
        await page2.fill('#reg-name', 'Joao Caregiver')
        await page2.fill('#reg-age', '40')
        await page2.click('#btn-flow-1')
        await page2.click('.role-card[data-role="cuidador"]')
        await page2.click('#btn-flow-2')
        await page2.click('#btn-flow-3')

        # Click the link button which sets display to block
        await page2.evaluate('showScreen("screen-11")')
        await asyncio.sleep(0.5)

        # Ensure the element is visible by forcing it to be visible if needed or just using evaluate
        await page2.evaluate('document.getElementById("link-patient-code").value = "{}"'.format(patient_code))
        await page2.evaluate('document.getElementById("btn-link-patient-by-code").click()')

        # Check for success or error message
        await asyncio.sleep(1)
        success_msg = await page2.inner_text('#link-patient-success')
        error_msg = await page2.inner_text('#link-patient-error')

        print(f"Success Message: {success_msg}")
        print(f"Error Message: {error_msg}")

        # Check localStorage on caregiver side
        sync_data = await page2.evaluate('localStorage.getItem("lembremed_sync_patients")')
        print(f"Sync Data: {sync_data}")

        await browser.close()

asyncio.run(main())
