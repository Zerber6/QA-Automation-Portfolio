import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { CatalogPage } from './CatalogPage.js';

describe('Переход на страницу "Стиральные машины"', function() {
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

  it('Успешный переход в раздел "Стиральные машины" через боковое меню Каталога', async () => {
    const CATALOG_URL = `${config.baseUrl}/product-category/catalog/`;
    const EXPECTED_PATH = '/catalog/appliances/wash/';
    const CATEGORY_NAME = 'стиральные машины';

    // 1. Открываем каталог
    await driver.get(CATALOG_URL);
    
    // 2. Получаем элемент 
    const washLink = await catalogPage.getWashingMachinesLink(until, config.timeout);
    
    // 3. Кликаем по нему
    await washLink.click();
    
    // 4. Ожидаем смену URL
    await driver.wait(
      until.urlContains(EXPECTED_PATH), 
      config.timeout,
      'Страница "Стиральные машины" не загрузилась вовремя'
    );
    
    // 5. Проверка URL с приведением к нижнему регистру
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(EXPECTED_PATH.toLowerCase());

    // 6. Проверяем активную категорию и её текст
    const activeCategoryLocator = By.css('.current-cat');
    await driver.wait(until.elementLocated(activeCategoryLocator), config.timeout);
    const activeCategory = await driver.findElement(activeCategoryLocator);
    
    const categoryText = await activeCategory.getText();
    const classAttr = await activeCategory.getAttribute('class');

    expect(classAttr).to.include('current-cat');
    expect(categoryText.toLowerCase()).to.include(CATEGORY_NAME.toLowerCase());
 
  });
});