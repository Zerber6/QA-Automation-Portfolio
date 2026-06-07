import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { HomePage } from './HomePage.js'; // Подключаем нашу обновленную страницу

describe('Переход на страницу с книгами', function() {
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

  it('Перейти на страницу с книгами после клика по кнопке "Просмотреть"', async () => {
    const BOOKS_CATEGORY_PATH = '/product-category/catalog/books/';

    // 1. Открываем главную страницу
    await driver.get(config.baseUrl);
    
    // Ожидаем полной загрузки документа через JS
    await driver.wait(
      () => driver.executeScript('return document.readyState').then(ready => ready === 'complete'),
      config.timeout
    );

    // 2. Ждем появления промо-кнопки на странице
    const viewButton = await driver.wait(
      until.elementLocated(homePage.viewBooksButton), 
      config.timeout
    );

    // 3. Плавно скроллим экран до этой кнопки
    const viewBooksBtn = await homePage.scrollToPromoButtonByIndex(0);
    await driver.wait(until.elementIsVisible(viewButton), config.timeout);

    // 4. Эмулируем реальный клик пользователя
    await viewBooksBtn.click();

    // 5. Ожидаем, что URL поменяется и будет содержать путь к книгам
    await driver.wait(
      until.urlContains(BOOKS_CATEGORY_PATH),
      config.timeout
    );

    // 6. Финальная безопасная проверка URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(BOOKS_CATEGORY_PATH.toLowerCase());

  });
});