import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { LoginPage } from './LoginPage.js';

describe('Проверка ошибки при пустом поле пароля', function() {
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

  it('Отобразить сообщение о пустом поле пароля', async () => {
    await driver.get(config.loginUrl);

    const testUser = '12325';
    const expectedError = 'Пароль обязателен';

    // 2. Вводим только логин
    const usernameInput = await driver.findElement(loginPage.usernameField);
    await usernameInput.clear();
    await usernameInput.sendKeys(testUser);

    // 3. Кликаем по кнопке войти
    const loginButton = await driver.findElement(loginPage.loginButton);
    await loginButton.click();

    // Ожидаем появление элемента ошибки
    const errorElement = await driver.wait(
      until.elementLocated(loginPage.errorList), 
      config.timeout
    );
    
    const errorText = await errorElement.getText();

    // Регистронезависимая проверка результатов
    expect(errorText.toLowerCase()).to.include(expectedError.toLowerCase());

  });
});