import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';      
import { LoginPage } from './LoginPage.js'; 

describe('Авторизация пользователя (Невалидный Пароль)', function() {
  let driver;
  let loginPage;

  this.timeout(config.mochaTimeout);

  before(async () => {
    driver = await config.getDriver();
    loginPage = new LoginPage(driver); 
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('Показать ошибку при вводе невалидных данных', async () => {
    await driver.get(config.loginUrl);

    // Тестовые данные (перенесли локально для наглядности)
    const validUser = '12325';
    const invalidPass = '123';
    const expectedError = 'Веденный пароль для пользователя 12325 неверный';
    
    // 1. Вводим логин
    const usernameInput = await driver.findElement(loginPage.usernameField);
    await usernameInput.clear();
    await usernameInput.sendKeys(validUser);

    // 2. Вводим невалидный пароль
    const passwordInput = await driver.findElement(loginPage.passwordField);
    await passwordInput.clear();
    await passwordInput.sendKeys(invalidPass);

    // 3. Нажимаем кнопку входа
    const loginButton = await driver.findElement(loginPage.loginButton);
    await loginButton.click();

    // Ожидаем появление элемента ошибки
    const errorElement = await driver.wait(
      until.elementLocated(loginPage.errorList), 
      config.timeout
    );

    // Получаем текст и проверяем его
    const errorText = await errorElement.getText();
    expect(errorText.toLowerCase()).to.include(expectedError.toLowerCase());
    
  });
});