import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { LoginPage } from './LoginPage.js';

describe('Авторизация - показ пароля', function() {
  let driver;
  let loginPage;

  this.timeout(config.mochaTimeout);

  before(async () => {
    driver = await config.getDriver();
    loginPage = new LoginPage(driver);
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('Показать пароль при нажатии на иконку', async () => {
    // 1. Открываем страницу и замираем для контроля
    await driver.get(config.loginUrl);

    const testPassword = '123456';

    // 2. Находим поле пароля  и вводим текст
    const passwordInput = await driver.findElement(loginPage.passwordField);
    await passwordInput.sendKeys(testPassword);

    // 3. Ждем появления иконки "глаза" на странице
    const showPasswordIcon = await driver.wait(
      until.elementLocated(By.css('span.show-password-input')), 
      config.timeout
    );
    
    // 4. Кликаем по иконке показа пароля
    await showPasswordIcon.click();

    // Получаем текущий тип поля для ассерта
    const type = await passwordInput.getAttribute('type');
    
    // Проверка, что тип поля сменился с password на text
    expect(type.toLowerCase()).to.equal('text', 'Тип поля должен измениться на text');
    
  });
});