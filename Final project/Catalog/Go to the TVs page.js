import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { CatalogPage } from './CatalogPage.js';

describe('Переход на страницу "Телевизоры"', function() {
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

  it('Переход на страницу и клик по категории "Телевизоры"', async () => {
    const CATALOG_URL = `${config.baseUrl}/product-category/catalog/`;
    const EXPECTED_PATH = '/catalog/electronics/tv/';
    const EXPECTED_CATEGORY_NAME = 'Телевизоры';
      
    // 1. Открываем страницу
    await driver.get(CATALOG_URL);
    
    // 2. Находим ссылку 
    const tvLink = await catalogPage.getTvLink(until, config.timeout);
        
    // 3. Проверка текста перед кликом
    const linkText = await tvLink.getText();
    expect(linkText.toLowerCase()).to.include(EXPECTED_CATEGORY_NAME.toLowerCase());
    
    // 4. Клик
    await tvLink.click();
    
    // 5. Ожидание смены URL
    await driver.wait(until.urlContains(EXPECTED_PATH), config.timeout);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include(EXPECTED_PATH);

    // 6. Проверка активной категории
    const activeCategoryLocator = By.css('.current-cat');
    await driver.wait(until.elementLocated(activeCategoryLocator), config.timeout);
    const activeCategory = await driver.findElement(activeCategoryLocator);
    
    const classAttr = await activeCategory.getAttribute('class');
    expect(classAttr).to.include('current-cat');

  });
});