import { Builder, until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';      
import { LoginPage } from './LoginPage.js';

describe('Регистрация с некорректным именем пользователя', function() {
  let driver;
  let loginPage;

  this.timeout(config.mochaTimeout);

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
    loginPage = new LoginPage(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('Ошибка о неправильном имени пользователя', async () => {
    await driver.get('https://intershop5.skillbox.ru/register/');
    

    // Вводим почту
    const emailInput = await driver.findElement(By.css('#reg_email'));
    await emailInput.sendKeys(`test_${Date.now()}@gmail.com`);


    // Вводим пароль
    const passwordInput = await driver.findElement(By.css('#reg_password'));
    await passwordInput.sendKeys(config.credentials.password);


    // Жмем кнопку
    const registerButton = await driver.findElement(By.css('button[name="register"]'));
    await registerButton.click();
    

    // Ждем и проверяем ошибку
    const errorElement = await driver.wait(
      until.elementLocated(By.css('ul.woocommerce-error')),
      config.timeout
    );

    const errorText = await errorElement.getText();
    expect(errorText.toLowerCase()).to.include('пожалуйста введите корректное имя пользователя'.toLowerCase());
  });
});