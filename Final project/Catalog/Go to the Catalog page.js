import { until, By } from 'selenium-webdriver'; 
import { expect } from 'chai';
import { config } from './config.js';
import { CatalogPage } from './CatalogPage.js';

describe('Переход на страницу "Каталог"', function() {
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

  it('Успешно кликнуть по активной ссылке "Каталог" в боковом меню', async () => {
    const CATALOG_URL = `${config.baseUrl}/product-category/catalog/`;
    const EXPECTED_PATH = '/product-category/catalog/';      

    // 1. Открываем страницу общего каталога
    await driver.get(CATALOG_URL);
    
    // 2. Находим ссылку "Каталог" через наш Page Object
    const catalogLink = await catalogPage.getRootCatalogLink(until, config.timeout);

    // 3. Кликаем по ней
    await catalogLink.click();

    // 4. Проверяем, что URL соответствует ожидаемому
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(EXPECTED_PATH.toLowerCase());

    // 5. Проверяем, что элемент бокового меню сохранил статус активного (.current-cat)
    const activeCatLocator = By.css('.current-cat');
    await driver.wait(until.elementLocated(activeCatLocator), config.timeout);
    const activeCatElement = await driver.findElement(activeCatLocator);
    
    const classAttribute = await activeCatElement.getAttribute('class');
    expect(classAttribute).to.include('current-cat');

  });
});