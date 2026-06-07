import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { HomePage } from './HomePage.js';

describe('Переход на страницу "Корзина"', function() {
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

  it('Успешно перейти на страницу "Корзина" при клике через главное меню', async () => {
    const CART_PATH = '/cart/';

    // 1. Открываем главную страницу сайта
    await driver.get(config.baseUrl);
    
    // 2. Ожидаем появления ссылки на корзину в DOM и находим её
    const cartLink = await driver.wait(
      until.elementLocated(homePage.mainCartMenuLink), 
      config.timeout
    );

    // Убеждаемся, что элемент виден пользователю, и фиксируем взгляд
    await driver.wait(until.elementIsVisible(cartLink), config.timeout);   

    // 3. Реалистичный клик по ссылке
    await cartLink.click();

    // 4. Ожидаем загрузки страницы корзины по её URL
    await driver.wait(
      until.urlContains(CART_PATH),
      config.timeout,
      'Страница корзины не загрузилась вовремя'
    );

    // 5. Безопасная проверка актуального URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(CART_PATH.toLowerCase());

  });
});