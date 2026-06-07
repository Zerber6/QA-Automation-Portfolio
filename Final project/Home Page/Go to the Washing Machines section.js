import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { HomePage } from './HomePage.js';

describe('Сложная навигация по многоуровневому меню', function () {
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

  it('Успешно перейти в раздел "Стиральные машины" через Каталог -> Бытовая техника', async () => {
    const WASH_MACHINES_PATH = '/product-category/catalog/appliances/wash/';
      

    // 1. Открываем главную страницу
    await driver.get(config.baseUrl);
    

    // 2. Запускаем ховер-маршрут к стиральным машинам
    const washMenuLink = await homePage.hoverAndNavigateToWashingMachines(until, config.timeout);

    // 3. Кликаем по пункту "Стиральные машины"
    await washMenuLink.click();

    // 4. Ожидаем смены URL на нужную категорию
    await driver.wait(
      until.urlContains(WASH_MACHINES_PATH),
      config.timeout,
      'Страница стиральных машин не загрузилась вовремя'
    );

    // 5. Финальная проверка актуального URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(WASH_MACHINES_PATH.toLowerCase());

  });
});