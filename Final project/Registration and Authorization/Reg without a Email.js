import { Builder, until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';      
import { LoginPage } from './LoginPage.js';

describe('Регистрация: негативные сценарии', function() {
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

  it('Ошибка при регистрации с пустым email', async () => {
    // Переходим на страницу регистрации
    await driver.get('https://intershop5.skillbox.ru/register/');
    
    // Генерируем уникальное имя
    const uniqueName = `user_${Date.now()}`;
    
    // Вводим имя пользователя
    const regName = await driver.findElement(By.css('#reg_username'));
    await regName.sendKeys(uniqueName);


    // Вводим пароль
    const regPass = await driver.findElement(By.css('#reg_password'));
    await regPass.sendKeys(config.credentials.password);


    // Кликаем регистрацию
    const regBtn = await driver.findElement(By.css('button[name="register"]'));
    await regBtn.click();
    

    // Ждем появления ошибки
    const errorElement = await driver.wait(
      until.elementLocated(By.css('ul.woocommerce-error')), 
      config.timeout
    );
    
    const errorText = await errorElement.getText();
    expect(errorText.toLowerCase()).to.include('введите корректный email');
  });
});