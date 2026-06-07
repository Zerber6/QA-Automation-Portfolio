import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { CatalogPage } from './CatalogPage.js';

describe('Переход на страницу "Одежда"', function() {
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

  it('Успешный переход в раздел "Одежда" через боковое меню Каталога', async () => {
    const CATALOG_URL = `${config.baseUrl}/product-category/catalog/`;
    const CLOTHES_PATH = '/catalog/clothes/';      

    // 1. Открываем страницу каталога
    await driver.get(CATALOG_URL);
    
    // 2. Находим ссылку на "Одежду" 
    const clothesLink = await catalogPage.getClothingLink(until, config.timeout);

    // 3. Кликаем по ней
    await clothesLink.click();

    // 4. Ожидаем, пока URL станет правильным
    await driver.wait(
      until.urlContains(CLOTHES_PATH),
      config.timeout,
      'Страница "Одежда" не загрузилась вовремя'
    );

    // 5. Проверяем URL в нижнем регистре
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(CLOTHES_PATH.toLowerCase());

    // 6. Проверяем, что пункт в боковом меню подсветился как активный
    const activeCategoryLocator = By.css('li.cat-item.current-cat');
    await driver.wait(until.elementLocated(activeCategoryLocator), config.timeout);
    const activeCategory = await driver.findElement(activeCategoryLocator);
    
    const classAttr = await activeCategory.getAttribute('class');
    expect(classAttr).to.include('current-cat');

  });
});