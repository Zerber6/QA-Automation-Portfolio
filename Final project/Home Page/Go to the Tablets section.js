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

  it('Успешно перейти в раздел "Планшеты" через цепочку Каталог -> Электроника', async () => {
    const PAD_CATEGORY_PATH = '/product-category/catalog/electronics/pad/';
      

    // 1. Открываем главную страницу
    await driver.get(config.baseUrl);
    

    // 2. Запускаем ховер-скрипт перемещения мыши к планшетам
    const tabletsMenuLink = await homePage.hoverAndNavigateToTablets(until, config.timeout);

    // 3. Кликаем по пункту подменю "Планшеты"
    await tabletsMenuLink.click();

    // 4. Ожидаем смены URL на раздел планшетов
    await driver.wait(
      until.urlContains(PAD_CATEGORY_PATH),
      config.timeout,
      'Страница разделов "Планшеты" не загрузилась вовремя'
    );

    // 5. Финальная проверка актуального URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(PAD_CATEGORY_PATH.toLowerCase());

  });
});