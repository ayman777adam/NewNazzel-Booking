const { chromium } = require('playwright');
const axios = require('axios');

const WEBHOOK_URL = "https://ayman777adam.app.n8n.cloud/webhook/ce48f815-2bba-4a1c-8f51-f788e2fd1740";

(async () => {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  // 1) Login to Nazeel
  await page.goto("https://pms.nazeel.net/Pages/Login.aspx", { waitUntil: "networkidle" });

  await page.fill('input[name="txtUserName"]', "ayman5252");
  await page.fill('input[name="txtPassword"]', "3765255");

  // Select year = this year
  const year = new Date().getFullYear().toString();
  await page.selectOption('select[name="ddlYear"]', year);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle" }),
    page.click("#btnLogin")
  ]);

  // 2) Choose company
  await page.waitForSelector("#CompanyListTable");

  const targetCompany = "إليت للشقق المخدومة - الكورنيش";

  const row = page.locator(`xpath=//tr[.//*[contains(text(), "${targetCompany}")]]//a`);
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: "networkidle" }),
    row.first().click()
  ]);

  // 3) Navigate to apartments dashboard
  await page.goto("https://pms.nazeel.net/Pages/Management/ManageApartmentsInfo.aspx?tab=ChangeStatus", {
    waitUntil: "networkidle"
  });

  await page.waitForSelector("#ContentPlaceHolder1_divMainContent");

  // 4) Screenshot
  const screenshot = await page.screenshot({ fullPage: true });

  // 5) Send screenshot to n8n webhook
  await axios.post(
    WEBHOOK_URL,
    { image: screenshot.toString("base64") },
    { headers: { "Content-Type": "application/json" } }
  );

  await browser.close();
})();
