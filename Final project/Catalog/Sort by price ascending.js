import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { SortPage } from './SortPage.js';

describe('Тест поля сортировки товаров (По возрастанию цены)', function () {
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

  it('Успешная сортировка товаров по возрастанию цены', async function () {
      
    const EXPECTED_TEXT = 'По возрастанию цены';

    // 1. Открываем страницу каталога
    await driver.get(`${config.baseUrl}/product-category/catalog/`);
    

    // 2. Выбираем сортировку по цене ("price") через надежный клик в Page Object
    await sortPage.selectSortByValue(until, 'price', config.timeout);
    

    // 3. ЖДЕМ ОБНОВЛЕНИЯ СТРАНИЦЫ: Бэкенд должен дописать параметр в URL
    await driver.wait(
      until.urlContains('orderby=price'), 
      config.timeout,
      'Бэкенд не перестроил страницу под сортировку по цене'
    );

    // 4. Проверяем, что URL изменился корректно
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('orderby=price');

    // 5. Проверяем, что в выпадающем списке активен нужный текст
    const selectedText = await sortPage.getSelectedOptionText(until, config.timeout);
    expect(selectedText.toLowerCase()).to.include(EXPECTED_TEXT.toLowerCase());

  });
});