import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { HomePage } from './HomePage.js';

describe('Навигация по вложенному меню на Главной странице', function() {
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

  it('Успешно перейти в раздел "Одежда" через раскрывающееся подменю Каталога', async () => {
    const CLOTHES_CATEGORY_PATH = '/product-category/catalog/clothes/';
      

    // 1. Открываем главную страницу
    await driver.get(config.baseUrl);
    

    // 2. Наводим мышь на пункт "Каталог" для вызова sub-menu
    await homePage.hoverOverCatalogMenu();

    // 3. Ждем появления ссылки на Одежду в DOM-дереве
    const clothesLink = await driver.wait(
      until.elementLocated(homePage.clothesSubMenuLink),
      config.timeout
    );

    // Ждем, пока ссылка станет физически видимой на экране, и замираем
    await driver.wait(until.elementIsVisible(clothesLink), config.timeout);

    // 4. Кликаем по пункту "Одежда"
    await clothesLink.click();

    // 5. Ожидаем, что URL изменится и будет содержать путь к одежде
    await driver.wait(
      until.urlContains(CLOTHES_CATEGORY_PATH),
      config.timeout,
      'Страница категории "Одежда" не загрузилась вовремя'
    );

    // 6. Финальная проверка актуального URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(CLOTHES_CATEGORY_PATH.toLowerCase());

  });
});