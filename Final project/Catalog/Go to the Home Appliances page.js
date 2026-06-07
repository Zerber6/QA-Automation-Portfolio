import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { CatalogPage } from './CatalogPage.js';

describe('Переход на страницу "Бытовая техника"', function() {
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

  it('Успешный переход в раздел "Бытовая техника" через боковое меню Каталога', async () => {
    const CATALOG_URL = `${config.baseUrl}/product-category/catalog/`;
    const EXPECTED_PATH = '/catalog/appliances/';

    // 1. Открываем страницу каталога
    await driver.get(CATALOG_URL);
    

    // 2. Находим ссылку "Бытовая техника" 
    const appliancesLink = await catalogPage.getAppliancesLink(until, config.timeout);

    // 3. Кликаем по ней
    await appliancesLink.click();

    // 4. Ожидаем смену URL
    await driver.wait(
      until.urlContains(EXPECTED_PATH),
      config.timeout,
      'Страница "Бытовая техника" не загрузилась вовремя'
    );

    // 5. Проверка URL в нижнем регистре
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(EXPECTED_PATH.toLowerCase());

    // 6. Дополнительная проверка: проверяем текст главного заголовка на странице
    const titleLocator = By.css('.entry-title');
    await driver.wait(until.elementLocated(titleLocator), config.timeout);
    const pageTitle = await driver.findElement(titleLocator).getText();
    expect(pageTitle.toLowerCase()).to.include('бытовая техника');

  });
});