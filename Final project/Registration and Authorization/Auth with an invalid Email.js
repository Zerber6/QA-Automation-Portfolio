import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';      
import { LoginPage } from './LoginPage.js'; 

describe('Авторизация пользователя (Невалидный Email)', function() {
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
     

    // Тестовые данные
    const invalidEmail = '1309@gmail.com';
    const invalidPass = '123';
    const expectedError = 'Неизвестный адрес почты';

    // 1. Используем стабильные селекторы из LoginPage для ввода данных
    const usernameInput = await driver.findElement(loginPage.usernameField);
    await usernameInput.clear();
    await usernameInput.sendKeys(invalidEmail);
 
    const passwordInput = await driver.findElement(loginPage.passwordField);
    await passwordInput.clear();
    await passwordInput.sendKeys(invalidPass);
 
    // Нажимаем кнопку входа
    const loginButton = await driver.findElement(loginPage.loginButton);
    await loginButton.click();
     
    // 2. Объявляем локатор ошибок прямо тут
    const errorLocator = By.css('ul.woocommerce-error');

    // Ожидаем появление элемента на странице
    const errorElement = await driver.wait(
      until.elementLocated(errorLocator), 
      config.timeout
    );

    // Берем текст ошибки
    const errorText = await errorElement.getText();

    // 3. Проверка
    expect(errorText.toLowerCase()).to.include(expectedError.toLowerCase());
     
  });
});