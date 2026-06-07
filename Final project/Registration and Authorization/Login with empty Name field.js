import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { LoginPage } from './LoginPage.js';

describe('Проверка ошибки при попытке входа без имени пользователя', function() {
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

  it('Отобразить ошибку о необходимости имени пользователя', async () => {
    await driver.get(config.loginUrl);

    const testPassword = '123';
    const expectedError = 'Имя пользователя обязательно';

    // 1. Находим и заполняем только пароль
    const passwordInput = await driver.findElement(loginPage.passwordField);
    await passwordInput.clear();
    await passwordInput.sendKeys(testPassword);

    // 2. Нажимаем кнопку входа
    const loginButton = await driver.findElement(loginPage.loginButton);
    await loginButton.click();

    // Ожидаем появление элемента ошибки
    const errorElement = await driver.wait(
      until.elementLocated(loginPage.errorList), 
      config.timeout
    );

    const errorText = await errorElement.getText();
    console.log('Обнаруженное сообщение:', errorText);

    // Регистронезависимая проверка
    expect(errorText.toLowerCase()).to.include(expectedError.toLowerCase());
    
  });
});