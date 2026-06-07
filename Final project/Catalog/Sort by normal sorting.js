import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { SortPage } from './SortPage.js';

describe('Тест поля сортировки товаров (Сброс на дефолт)', function () {
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

  it('Успешный возврат к "Обычной сортировке" после фильтрации по цене', async function () {

    // ИСПРАВЛЕНО: Меняем текст на тот, который реально отдаёт сайт!
    const EXPECTED_SORT_TEXT = 'Обычная сортировка'; 

    // 1. Заходим специально на страницу с уже примененной сортировкой по цене
    const INITIAL_URL = `${config.baseUrl}/product-category/catalog/?orderby=price`;
    await driver.get(INITIAL_URL);
    

    // 2. Сбрасываем сортировку на дефолтную ("menu_order") 
    await sortPage.selectSortByValue(until, 'menu_order', config.timeout);
    

    // 3. ЖДЕМ ОБНОВЛЕНИЯ: Страница должна сбросить orderby=price
    await driver.wait(
      async () => {
        const url = await driver.getCurrentUrl();
        return !url.includes('orderby=price'); // Ждем, пока 'price' исчезнет из URL
      },
      config.timeout,
      'Бэкенд не сбросил сортировку по цене'
    );

    // 4. Проверяем текущий URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.not.include('orderby=price');

    // 5. Проверяем, что в дропдауне активен правильный текст
    const selectedText = await sortPage.getSelectedOptionText(until, config.timeout);
    expect(selectedText.toLowerCase()).to.include(EXPECTED_SORT_TEXT.toLowerCase());

  });
});