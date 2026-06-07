import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { HomePage } from './HomePage.js';

describe('Переход на страницу "Мой аккаунт"', function() {
  let driver;
  let homePage;

  this.timeout(config.mochaTimeout * 2);

  before(async () => {
    driver = await config.getDriver();
    homePage = new HomePage(driver);
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('Успешно перейти на страницу "Мой аккаунт" при клике через главное меню', async () => {
    const MY_ACCOUNT_PATH = '/my-account/';
      

    // 1. Открываем главную страницу
    await driver.get(config.baseUrl);
    

    // 2. Ожидаем появления ссылки в DOM и находим её
    const accountLink = await driver.wait(
      until.elementLocated(homePage.myAccountMenuLink),
      config.timeout
    );

    // Проверяем физическую видимость элемента и фиксируем взгляд
    await driver.wait(until.elementIsVisible(accountLink), config.timeout);
    

    // 3. Выполняем клик
    await accountLink.click();

    // 4. Ожидаем смены URL на страницу "/my-account/"
    await driver.wait(
      until.urlContains(MY_ACCOUNT_PATH),
      config.timeout,
      'Страница "Мой аккаунт" не загрузилась вовремя'
    );

    // 5. Безопасная проверка актуального URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(MY_ACCOUNT_PATH.toLowerCase());

  });
});