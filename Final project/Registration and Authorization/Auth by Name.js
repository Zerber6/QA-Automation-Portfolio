import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';      
import { LoginPage } from './LoginPage.js'; 

describe('Авторизация по имени пользователя', function() {
  let driver;
  let loginPage;

  // Тянем глобальный таймаут (30000) из конфига
  this.timeout(config.mochaTimeout);

  before(async () => {
    // Запускаем наш прокачанный Chrome без табличек об утечках
    driver = await config.getDriver(); 
    loginPage = new LoginPage(driver); // Инициализируем страницу
  });

  after(async () => {
    if (driver) await driver.quit();
  });

it('Успешный вход по валидному логину', async () => {
    await driver.get(config.loginUrl);

    // 1. Вводим логин вручную через локатор из Page Object
    const userField = await driver.findElement(loginPage.usernameField);
    await userField.sendKeys(config.credentials.username);

    // 2. Вводим пароль вручную
    const passField = await driver.findElement(loginPage.passwordField);
    await passField.sendKeys(config.credentials.password);

    // 3. Жмем кнопку
    const loginBtn = await driver.findElement(loginPage.loginButton);
    await loginBtn.click();

    // Проверка URL
    await driver.wait(until.urlContains('/my-account/'), config.timeout);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include('/my-account/'.toLowerCase());
  });
});
