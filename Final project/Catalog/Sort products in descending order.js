import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { SortPage } from './SortPage.js';

describe('Тест поля сортировки товаров (По убыванию цены)', function () {
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

  it('Успешная сортировка товаров по убыванию цены', async function () {
      
    const EXPECTED_TEXT = 'По убыванию цены';

    // 1. Открываем страницу каталога
    await driver.get(`${config.baseUrl}/product-category/catalog/`);
    

    // 2. Выбираем сортировку по убыванию цены ("price-desc") через метод Page Object
    await sortPage.selectSortByValue(until, 'price-desc', config.timeout);
    

    // 3. ЖДЕМ ОБНОВЛЕНИЯ СТРАНИЦЫ: Бэкенд должен дописать параметр в URL
    await driver.wait(
      until.urlContains('orderby=price-desc'), 
      config.timeout,
      'Бэкенд не перестроил страницу под сортировку по убыванию цены'
    );

    // 4. Проверяем, что URL изменился корректно
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('orderby=price-desc');

    // 5. Проверяем, что в выпадающем списке активен нужный текст
    const selectedText = await sortPage.getSelectedOptionText(until, config.timeout);
    expect(selectedText.toLowerCase()).to.include(EXPECTED_TEXT.toLowerCase());

  });
});