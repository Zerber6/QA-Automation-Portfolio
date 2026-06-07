import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { CatalogPage } from './CatalogPage.js';

describe('Переход на страницу "Часы"', function() {
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

  it('Успешный переход в раздел "Часы" через боковое меню Каталога', async () => {
    const CATALOG_URL = `${config.baseUrl}/product-category/catalog/`;
    const WATCH_CATEGORY_URL_PART = '/catalog/electronics/watch/';
    const EXPECTED_TITLE = 'часы';      

    // 1. Открываем каталог
    await driver.get(CATALOG_URL);
    
    // 2. Получаем ссылку на "Часы" 
    const watchesLink = await catalogPage.getWatchesLink(until, config.timeout);
    
    // 3. Кликаем по ней
    await watchesLink.click();
    
    // 4. Ожидаем смену URL
    await driver.wait(
      until.urlContains(WATCH_CATEGORY_URL_PART), 
      config.timeout,
      'Страница "Часы" не загрузилась вовремя'
    );
    
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include(WATCH_CATEGORY_URL_PART);

    // 5. Проверяем активную категорию и её текст
    const activeCategoryLocator = By.css('.current-cat');
    await driver.wait(until.elementLocated(activeCategoryLocator), config.timeout);
    const activeCategory = await driver.findElement(activeCategoryLocator);
    
    const categoryText = await activeCategory.getText();
    const classAttr = await activeCategory.getAttribute('class');

    expect(classAttr).to.include('current-cat');
    expect(categoryText.toLowerCase()).to.include(EXPECTED_TITLE);

  });
});