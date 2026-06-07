import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { CatalogPage } from './CatalogPage.js';

describe('Переход на страницу "Телефоны"', function() {
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

  it('Успешный переход в раздел "Телефоны" через боковое меню Каталога', async () => {
    const CATALOG_URL = `${config.baseUrl}/product-category/catalog/`;
    const EXPECTED_PATH = '/catalog/electronics/phones/';
    const EXPECTED_TEXT = 'Телефоны';

    // 1. Открываем страницу каталога
    await driver.get(CATALOG_URL);
    

    // 2. Получаем ссылку 
    const phonesLink = await catalogPage.getPhonesLink(until, config.timeout);
    

    // 3. Проверяем текст элемента перед кликом (как и было в твоём тесте)
    const linkText = await phonesLink.getText();
    expect(linkText.toLowerCase()).to.include(EXPECTED_TEXT.toLowerCase());
    
    // 4. Кликаем по ней
    await phonesLink.click();
    

    // 5. Ожидаем смену URL
    await driver.wait(until.urlContains(EXPECTED_PATH), config.timeout);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include(EXPECTED_PATH);

    // 6. Проверяем, что категория стала активной
    const activeCategoryLocator = By.css('.current-cat');
    await driver.wait(until.elementLocated(activeCategoryLocator), config.timeout);
    
    const activeCategory = await driver.findElement(activeCategoryLocator);
    const classAttr = await activeCategory.getAttribute('class');
    expect(classAttr).to.include('current-cat');

  });
});