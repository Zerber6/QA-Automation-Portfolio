import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { CatalogPage } from './CatalogPage.js';

describe('Переход на страницу "Холодильники"', function() {
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

  it('Успешный переход в раздел "Холодильники" через боковое меню Каталога', async () => {
    const CATALOG_URL = `${config.baseUrl}/product-category/catalog/`;
    const EXPECTED_PATH = '/catalog/appliances/refrigerators/';

    // 1. Открываем страницу каталога
    await driver.get(CATALOG_URL);
    

    // 2. Получаем ссылку на "Холодильники" 
    const fridgeLink = await catalogPage.getRefrigeratorsLink(until, config.timeout);

    // 3. Кликаем по ней
    await fridgeLink.click();

    // 4. Ожидаем смену URL
    await driver.wait(
      until.urlContains(EXPECTED_PATH),
      config.timeout,
      'Страница "Холодильники" не загрузилась вовремя'
    );

    // 5. Проверка URL в нижнем регистре
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(EXPECTED_PATH.toLowerCase());

    // 6. Проверяем, что пункт меню подсветился как активный (.current-cat)
    const activeCategoryLocator = By.css('.cat-item-21.current-cat');
    await driver.wait(until.elementLocated(activeCategoryLocator), config.timeout);
    const activeCategory = await driver.findElement(activeCategoryLocator);
    
    const classAttr = await activeCategory.getAttribute('class');
    expect(classAttr).to.include('current-cat');

  });
});