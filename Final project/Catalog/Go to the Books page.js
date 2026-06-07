import { By, until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { CatalogPage } from './CatalogPage.js';

describe('Переход на страницу "Книги"', function() {
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

  it('Успешный переход в раздел "Книги" через боковое меню Каталога', async () => {
    const CATALOG_URL = `${config.baseUrl}/product-category/catalog/`;
    const BOOKS_PATH = '/product-category/catalog/books/';

    // 1. Открываем страницу общего каталога
    await driver.get(CATALOG_URL);
    
    // 2. Находим ссылку на категорию "Книги" 
    const booksLink = await catalogPage.getBooksLink(until, config.timeout);

    // 3. Кликаем по ссылке "Книги"
    await booksLink.click();

    // 4. Ожидаем смены URL на раздел книг
    await driver.wait(
      until.urlContains(BOOKS_PATH),
      config.timeout,
      'Страница "Книги" не загрузилась вовремя'
    );

    // 5. Проверка актуального URL в нижнем регистре
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(BOOKS_PATH.toLowerCase());

    // 6. Дополнительная проверка: убеждаемся, что категория в боковом меню стала активной (.current-cat)
    const activeCategoryLocator = By.css('.cat-item.current-cat');
    await driver.wait(until.elementLocated(activeCategoryLocator), config.timeout);
    const activeCategory = await driver.findElement(activeCategoryLocator);
    
    const activeCategoryClass = await activeCategory.getAttribute('class');
    expect(activeCategoryClass.toLowerCase()).to.include('current-cat');

  });
});