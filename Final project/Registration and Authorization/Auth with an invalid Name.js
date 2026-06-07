import { until } from 'selenium-webdriver';
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
     

    const invalidUser = '12309';
    const invalidPass = '123';
    const expectedError = 'Неизвестное имя пользователя';

    // Вся логика авторизации теперь в одну строчку !
    await loginPage.login(invalidUser, invalidPass);     

    // Ожидаем появление элемента ошибки, используя локатор из LoginPage
    const errorElement = await driver.wait(
      until.elementLocated(loginPage.errorList), 
      config.timeout
    );

    // Берем текст ошибки
    const errorText = await errorElement.getText();

    // Проверка
    expect(errorText.toLowerCase()).to.include(expectedError.toLowerCase());
  });
});