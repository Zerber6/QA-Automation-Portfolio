import { Builder, until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';      
import { LoginPage } from './LoginPage.js'; 

describe('Регистрация пользователя', function() {
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

  it('Зарегистрировать пользователя и подтвердить успешную регистрацию', async () => {
    await driver.get(config.registerUrl);

    // Вызываем функцию из config.js
    const newUser = config.getDynamicUser(); 

    // 1. Вводим имя
    const usernameInput = await driver.findElement(By.css('#reg_username'));
    await usernameInput.sendKeys(newUser.username);
 

    // 2. Вводим email
    const emailInput = await driver.findElement(By.css('#reg_email'));
    await emailInput.sendKeys(newUser.email); 
 

    // 3. Вводим пароль
    const passwordInput = await driver.findElement(By.css('#reg_password'));
    await passwordInput.sendKeys(newUser.password);
 

    const registerButton = await driver.findElement(By.css('button[name="register"]'));
    await registerButton.click();
 

    const successLocator = By.css('.content-page, .woocommerce-message');
    const successMessageElement = await driver.wait(
      until.elementLocated(successLocator), 
      config.timeout 
    );

    const successText = await successMessageElement.getText();
    expect(successText.toLowerCase()).to.include('регистрация завершена'.toLowerCase());
  });
});