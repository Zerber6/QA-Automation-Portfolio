import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { CatalogPage } from './CatalogPage.js';

describe('Переход на страницу "Электроника"', function() {
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

  it('Успешный переход в раздел "Электроника" через боковое меню Каталога', async () => {
    const CATALOG_URL = `${config.baseUrl}/product-category/catalog/`;
    const EXPECTED_PATH = '/catalog/electronics/';

    // 1. Открываем страницу каталога
    await driver.get(CATALOG_URL);
    

    // 2. Находим ссылку "Электроника" 
    const electronicsLink = await catalogPage.getElectronicsLink(until, config.timeout);

    // 3. Кликаем по ней
    await electronicsLink.click();

    // 4. Ожидаем смену URL
    await driver.wait(
      until.urlContains(EXPECTED_PATH),
      config.timeout,
      'Страница "Электроника" не загрузилась вовремя'
    );

    // 5. Безопасная проверка URL в нижнем регистре
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(EXPECTED_PATH.toLowerCase());

    // 6. Проверяем, что активная категория подсвечена и содержит правильный текст
    const activeCategoryLocator = By.css('.current-cat');
    await driver.wait(until.elementLocated(activeCategoryLocator), config.timeout);
    const activeCategory = await driver.findElement(activeCategoryLocator);
    
    // Проверка текста категории
    const categoryText = await activeCategory.getText();
    expect(categoryText.toLowerCase()).to.include('электроника');
    
    // Проверка класса активности
    const classAttr = await activeCategory.getAttribute('class');
    expect(classAttr).to.include('current-cat');

 
  });
});