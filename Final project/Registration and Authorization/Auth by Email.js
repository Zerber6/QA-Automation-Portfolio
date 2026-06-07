import { Builder, until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';      
import { LoginPage } from './LoginPage.js';

describe('Авторизация на сайте', function() {
  let driver;
  let loginPage;

  // Используем глобальный таймаут из нашего конфига
  this.timeout(config.mochaTimeout);

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    loginPage = new LoginPage(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('Выполнить вход с валидными данными (Email)', async () => {
    // 1. Открываем страницу аккаунта из конфига
    await driver.get(config.loginUrl);

    // 2. Используем данные существующего пользователя    
    const userEmail = '12325@gmail.com'; // Данные из твоего теста
    const userPass = config.credentials.password; // Берем пароль из конфига

    // Заполняем логин
    const loginField = await driver.findElement(loginPage.usernameField);
    await loginField.sendKeys(userEmail);

    // Заполняем пароль
    const passField = await driver.findElement(loginPage.passwordField);
    await passField.sendKeys(userPass);

    // Жмем кнопку входа
    const loginBtn = await driver.findElement(loginPage.loginButton);
    await loginBtn.click();

    // 3. Ожидание завершения авторизации
    await driver.wait(until.urlContains('/my-account/'), config.timeout);
    
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include('/my-account/'.toLowerCase());
  });
});