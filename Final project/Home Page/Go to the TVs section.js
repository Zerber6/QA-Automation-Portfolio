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

  it('Успешно перейти в раздел "Телевизоры" через цепочку Каталог -> Электроника', async () => {
    const TV_CATEGORY_PATH = '/electronics/tv/';
      

    // 1. Открываем главную страницу
    await driver.get(config.baseUrl);
    

    // 2. Запускаем ховер-скрипт перемещения мыши к телевизорам
    const tvMenuLink = await homePage.hoverAndNavigateToTVs(until, config.timeout);

    // 3. Кликаем по пункту подменю "Телевизоры"
    await tvMenuLink.click();

    // 4. Ожидаем, что URL изменится на нужный нам раздел
    await driver.wait(
      until.urlContains(TV_CATEGORY_PATH),
      config.timeout,
      'Страница разделов "Телевизоры" не загрузилась вовремя'
    );

    // 5. Финальная проверка актуального URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(TV_CATEGORY_PATH.toLowerCase());

  });
});