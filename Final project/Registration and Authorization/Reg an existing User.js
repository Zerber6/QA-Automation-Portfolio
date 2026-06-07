import { Builder, until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';      
import { LoginPage } from './LoginPage.js'; 

describe('Регистрация с существующим логином', function() {
  let driver;
  let loginPage;

  // Берем mochaTimeout (30000) из конфига
  this.timeout(config.mochaTimeout);

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    loginPage = new LoginPage(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('Показать ошибку о существующем логине', async () => {
    // 1. Переходим на страницу регистрации
    await driver.get(config.registerUrl);

    // 2. Вводим данные УЖЕ СУЩЕСТВУЮЩЕГО пользователя
    
    const userField = await driver.findElement(loginPage.regUsernameField);
    await userField.sendKeys(config.credentials.username); 

    const emailField = await driver.findElement(loginPage.regEmailField);
    await emailField.sendKeys(`${config.credentials.username}@mail.ru`); 

    const passField = await driver.findElement(loginPage.regPasswordField);
    await passField.sendKeys(config.credentials.password);

    // 3. Жмем кнопку регистрации
    const regBtn = await driver.findElement(loginPage.registerButton);
    await regBtn.click();

    // 4. Ждем появления ошибки
    const errorElement = await driver.wait(
      until.elementLocated(loginPage.errorList),
      config.timeout
    );
    
    const errorText = await errorElement.getText();

    // 5. Проверка текста ошибки
    const expectedError = 'Учетная запись с таким именем пользователя уже зарегистрирована';
    expect(errorText.toLowerCase()).to.include(expectedError.toLowerCase());
  });
});