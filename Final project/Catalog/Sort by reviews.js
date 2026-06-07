import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { SortPage } from './SortPage.js';

describe('Тест поля сортировки товаров (По отзывам)', function () {
  let driver;
  let sortPage;

  this.timeout(config.mochaTimeout * 2);

  before(async function () {
    driver = await config.getDriver();
    sortPage = new SortPage(driver);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('Успешная сортировка товаров по рейтингу/отзывам', async function () {
      
    const EXPECTED_TEXT = 'По отзывам';

    // 1. Открываем каталог товаров
    await driver.get(`${config.baseUrl}/product-category/catalog/`);
    

    // 2. Выбираем сортировку по отзывам ("rating")  метод
    await sortPage.selectSortByValue(until, 'rating', config.timeout);
    

    // 3. ЖДЕМ ОБНОВЛЕНИЯ СТРАНИЦЫ: Бэкенд обязан дописать параметр в URL
    await driver.wait(
      until.urlContains('orderby=rating'), 
      config.timeout,
      'Бэкенд не перестроил страницу под сортировку по отзывам/рейтингу'
    );

    // 4. Проверяем, что параметр действительно в URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('orderby=rating');

    // 5. Проверяем, что в выпадающем списке горит нужная опция
    const selectedText = await sortPage.getSelectedOptionText(until, config.timeout);
    expect(selectedText.toLowerCase()).to.include(EXPECTED_TEXT.toLowerCase());

  });
});