import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { CatalogPage } from './CatalogPage.js';

describe('Переход на страницу "Планшеты"', function() {
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

  it('Успешный переход в раздел "Планшеты" через боковое меню Каталога', async () => {
    const CATALOG_URL = `${config.baseUrl}/product-category/catalog/`;
    const EXPECTED_PATH = '/catalog/electronics/pad/';
    const CATEGORY_NAME = 'Планшеты';

    // 1. Открываем страницу каталога
    await driver.get(CATALOG_URL);
    
    // 2. Находим ссылку "Планшеты" 
    const tabletsLink = await catalogPage.getTabletsLink(until, config.timeout);
    
    // 3. Получаем текст ссылки для будущей проверки перед кликом
    const categoryLinkText = await tabletsLink.getText();
    expect(categoryLinkText.toLowerCase()).to.include(CATEGORY_NAME.toLowerCase());

    // 4. Кликаем по ней
    await tabletsLink.click();
    
    // 5. Ожидаем смену URL
    await driver.wait(
      until.urlContains(EXPECTED_PATH),
      config.timeout,
      'Страница "Планшеты" не загрузилась вовремя'
    );
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include(EXPECTED_PATH);

    // 6. Проверяем активное состояние через стабильный CSS-селектор
    const activeCategoryLocator = By.css('.current-cat');
    await driver.wait(until.elementLocated(activeCategoryLocator), config.timeout);
    
    const activeCategory = await driver.findElement(activeCategoryLocator);
    const activeText = await activeCategory.getText();
    
    // Проверяем, что активная категория — это именно планшеты
    expect(activeText.toLowerCase()).to.include(CATEGORY_NAME.toLowerCase());

  });
});