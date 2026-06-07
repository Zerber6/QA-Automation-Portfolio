import { Builder, until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';      
import { LoginPage } from './LoginPage.js'; 

describe('Регистрация с некорректным паролем', function() {
  let driver;
  let loginPage;

  // Берем таймаут 30000 из конфига
  this.timeout(config.mochaTimeout);

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    loginPage = new LoginPage(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('Ошибка при регистрации без пароля', async () => {
    // 1. Переходим на страницу регистрации через конфиг
    await driver.get(config.registerUrl);

    // 2. Генерируем короткие данные
    const tempUser = config.getDynamicUser();

    // 3. Вводим имя пользователя
    const usernameInput = await driver.findElement(loginPage.regUsernameField);
    await usernameInput.sendKeys(tempUser.username);

    // 4. Вводим email
    const emailInput = await driver.findElement(loginPage.regEmailField);
    await emailInput.sendKeys(tempUser.email);

    // 5. Жмем кнопку регистрации
    const registerButton = await driver.findElement(loginPage.registerButton);
    await registerButton.click();

    // 6. Ждем появления ошибки
    const errorElement = await driver.wait(
      until.elementLocated(loginPage.errorList),
      config.timeout // 10000 из конфига
    );

    const errorText = await errorElement.getText();

    // 7. Проверка текста ошибки
    const expectedError = 'Введите пароль для регистрации';
    expect(errorText.toLowerCase()).to.include(expectedError.toLowerCase());
  });
});