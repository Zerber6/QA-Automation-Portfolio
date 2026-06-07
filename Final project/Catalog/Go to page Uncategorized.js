import { By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { CatalogPage } from './CatalogPage.js';

describe('Переход на страницу "Без категории"', function() {
  let driver;
  let catalogPage;

  this.timeout(config.mochaTimeout * 2);

  before(async () => {
    driver = await config.getDriver();
    catalogPage = new CatalogPage(driver);
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('Успешный переход в раздел "Без категории" через боковое меню Каталога', async () => {
    // Полный URL каталога на базе baseUrl из конфига
    const CATALOG_URL = `${config.baseUrl}/product-category/catalog/`;
    const UNCATEGORIZED_PATH = '/product-category/uncategorized/';

    // 1. Переходим сразу на страницу каталога
    await driver.get(CATALOG_URL);
    
    // 2. Находим ссылку на категорию "Без категории" 
    const uncategorizedLink = await catalogPage.getUncategorizedLink(until, config.timeout);

    // 3. Кликаем по ссылке
    await uncategorizedLink.click();

    // 4. Ожидаем смены URL на нужную категорию
    await driver.wait(
      until.urlContains(UNCATEGORIZED_PATH),
      config.timeout,
      'Страница "Без категории" не загрузилась вовремя'
    );

    // 5. Финальная проверка актуального URL в нижнем регистре
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(UNCATEGORIZED_PATH.toLowerCase());

  });
});