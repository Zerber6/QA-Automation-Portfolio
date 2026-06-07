import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { SortPage } from './SortPage.js';

describe('Тест поля сортировки товаров', function () {
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

  it('Успешная сортировка товаров по новизне (Последние)', async function () {
    const EXPECTED_SORT_TEXT = 'Последние';

    // 1. Открываем каталог
    await driver.get(`${config.baseUrl}/product-category/catalog/`);
    

    // 2. Выбираем сортировку по новизне ("date") 
    await sortPage.selectSortByValue(until, 'date', config.timeout);
    

    // 3. Ждем, когда бэкенд обновит URL и добавит параметр сортировки
    await driver.wait(
      until.urlContains('orderby=date'), 
      config.timeout, 
      'Бэкенд не перестроил страницу под сортировку "date"'
    );

    // 4. Проверяем, что URL действительно изменился
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('orderby=date');

    // 5. Проверяем, что в самом дропдауне визуально выбрана правильная опция
    const selectedText = await sortPage.getSelectedOptionText(until, config.timeout);
    expect(selectedText.toLowerCase()).to.include(EXPECTED_SORT_TEXT.toLowerCase());

  });
});