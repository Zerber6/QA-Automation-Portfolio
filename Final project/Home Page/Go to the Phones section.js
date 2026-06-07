import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { HomePage } from './HomePage.js';

describe('Сложная навигация по многоуровневому меню', function() {
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

  it('Успешно перейти в раздел "Телефоны" через Каталог -> Электроника', async () => {
    const PHONES_CATEGORY_PATH = '/product-category/catalog/electronics/phones/';
      

    // 1. Открываем главную страницу
    await driver.get(config.baseUrl);
    

    // 2. Запускаем наш сложный ховер-маршрут по меню
    const phonesMenuLink = await homePage.hoverAndNavigateToPhones(until, config.timeout);

    // 3. Кликаем по пункту "Телефоны"
    await phonesMenuLink.click();

    // 4. Ожидаем, что URL изменится на раздел телефонов
    await driver.wait(
      until.urlContains(PHONES_CATEGORY_PATH),
      config.timeout,
      'Страница категории "Телефоны" не загрузилась вовремя'
    );

    // 5. Финальная проверка актуального URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(PHONES_CATEGORY_PATH.toLowerCase());

  });
});