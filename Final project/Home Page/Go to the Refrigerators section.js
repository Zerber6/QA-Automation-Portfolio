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

  it('Успешно перейти в раздел "Холодильники" через Каталог -> Бытовая техника', async () => {
    const REFRIGERATORS_PATH = '/product-category/catalog/appliances/refrigerators/';
      

    // 1. Открываем главную страницу
    await driver.get(config.baseUrl);
    

    // 2. Запускаем сложный ховер-скрипт по меню бытовой техники
    const refrigeratorsMenuLink = await homePage.hoverAndNavigateToRefrigerators(until, config.timeout);

    // 3. Кликаем по пункту "Холодильники"
    await refrigeratorsMenuLink.click();

    // 4. Ожидаем смены URL на искомую категорию
    await driver.wait(
      until.urlContains(REFRIGERATORS_PATH),
      config.timeout,
      'Страница холодильников не загрузилась вовремя'
    );

    // 5. Финальная проверка актуального URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(REFRIGERATORS_PATH.toLowerCase());

  });
});