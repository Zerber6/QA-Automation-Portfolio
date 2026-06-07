import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { ProductPage } from './ProductPage.js';

describe('Поиск товара "Ведро" на сайте', function() {
  let driver;
  let productPage;

  // Используем общий таймаут из конфигуратора
  this.timeout(config.mochaTimeout * 2);

  before(async () => {
    driver = await config.getDriver();
    productPage = new ProductPage(driver);
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('Выполнить поиск ведра и успешно перейти на страницу Lada', async () => {
    const SEARCH_QUERY = 'Ведро';
    const EXPECTED_PRODUCT_URL = 'https://intershop5.skillbox.ru/product/lada/';     

    // 1. Открываем базовый URL сайта
    await driver.get(config.baseUrl);   

    // 2. Находим поле поиска, кликаем по нему и вводим запрос
    const searchInput = await driver.findElement(productPage.searchField);
    await searchInput.click();
    await searchInput.sendKeys(SEARCH_QUERY);

    // 3. Находим кнопку отправки поиска и кликаем
    const searchButton = await driver.findElement(productPage.searchSubmitButton);
    await searchButton.click();

    // 4. Ожидаем, что URL изменится на страницу товара
    await driver.wait(
      until.urlIs(EXPECTED_PRODUCT_URL),
      config.timeout
    );

    // 5. Проверяем финальный URL 
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.equal(EXPECTED_PRODUCT_URL.toLowerCase());

  });
});