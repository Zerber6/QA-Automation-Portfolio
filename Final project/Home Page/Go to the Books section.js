import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { HomePage } from './HomePage.js';

describe('Навигация по вложенному меню на Главной странице', function() {
  let driver;
  let homePage;

  this.timeout(config.mochaTimeout * 2);

  before(async () => {
    driver = await config.getDriver();
    homePage = new HomePage(driver);
  });

  after(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('Успешно перейти в раздел "Книги" через раскрывающееся подменю', async () => {
    const BOOKS_CATEGORY_PATH = '/product-category/catalog/books/';
      

    // 1. Открываем главную страницу
    await driver.get(config.baseUrl);
    

    // 2. Имитируем ховер пользователя: наводим мышь на пункт "Каталог"
    await homePage.hoverOverCatalogMenu();

    // 3. Ждем, когда в DOM появится ссылка на Книги, и находим её
    const booksLink = await driver.wait(
      until.elementLocated(homePage.booksSubMenuLink),
      config.timeout
    );

    // Дополнительно ждем, чтобы элемент стал физически видимым на экране (после завершения CSS-анимации)
    await driver.wait(until.elementIsVisible(booksLink), config.timeout);

    // 4. Кликаем по пункту "Книги"
    await booksLink.click();

    // 5. Ожидаем, что URL поменяется на категорию книг
    await driver.wait(
      until.urlContains(BOOKS_CATEGORY_PATH),
      config.timeout,
      'Страница книг не загрузилась вовремя'
    );

    // 6. Безопасная проверка финального URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(BOOKS_CATEGORY_PATH.toLowerCase());

  });
});
