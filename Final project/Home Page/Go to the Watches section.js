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

  it('Успешно перейти в раздел "Часы" через цепочку Каталог -> Электроника', async () => {
    const WATCH_CATEGORY_PATH = '/catalog/electronics/watch/';

    // 1. Открываем главную страницу
    await driver.get(config.baseUrl);
    

    // 2. Запускаем ховер-скрипт перемещения мыши к часам
    const watchesMenuLink = await homePage.hoverAndNavigateToWatches(until, config.timeout);

    // 3. Кликаем по пункту подменю "Часы"
    await watchesMenuLink.click();

    // 4. Ожидаем смены URL на нужную категорию
    await driver.wait(
      until.urlContains(WATCH_CATEGORY_PATH),
      config.timeout,
      'Страница разделов "Часы" не загрузилась вовремя'
    );

    // 5. Финальная проверка актуального URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(WATCH_CATEGORY_PATH.toLowerCase());

  });
});