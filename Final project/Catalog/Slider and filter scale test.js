import { until, By } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';

describe('Тест ползунка и шкалы фильтрации цен (7 сценариев)', function () {
  let driver;

  // Увеличиваем таймаут, так как тестов теперь целых 7 и они UI-емкие
  this.timeout(config.mochaTimeout * 6);

  before(async function () {
    driver = await config.getDriver();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  // Набор тестовых данных на 7 шагов
  const testCases = [
    { shiftX: 10, description: 'на 10px' },
    { shiftX: 50, description: 'на 50px' },
    { shiftX: 100, description: 'на 100px' },
    { shiftX: 150, description: 'на 150px' },
    { shiftX: 200, description: 'на 200px' },
    { shiftX: 250, description: 'на 250px' },
    { shiftX: 300, description: 'на 300px' }
  ];

  // Динамически создаем 7 тестов в цикле
  testCases.forEach(({ shiftX, description }) => {
    it(`Сценарий: Фильтрация при сдвиге ползунка ${description}`, async function () {
        

      // 1. Открываем страницу каталога перед каждым тестом для чистоты эксперимента
      await driver.get(`${config.baseUrl}/product-category/catalog/`);
      
      // Локаторы элементов слайдера
      const handleLocator = By.css('.widget_price_filter span.ui-slider-handle:nth-of-type(1)');
      const submitBtnLocator = By.css('.widget_price_filter button[type="submit"].button');

      // 2. Ждем и находим левый ползунок
      const handle = await driver.wait(until.elementLocated(handleLocator), config.timeout);
      await driver.wait(until.elementIsVisible(handle), config.timeout);
   
      // 3. Честное перетаскивание мышкой через Actions
      const actions = driver.actions({ bridge: true });
      await actions.dragAndDrop(handle, { x: shiftX, y: 0 }).perform();

      // 4. Нажимаем кнопку «Фильтр»
      const applyButton = await driver.findElement(submitBtnLocator);
      await applyButton.click();
      
      // 5. Проверяем, что в URL подставились параметры фильтрации цен бэкендом
      await driver.wait(until.urlContains('min_price'), config.timeout);
      const currentUrl = await driver.getCurrentUrl();
      
      expect(currentUrl).to.include('min_price');
      expect(currentUrl).to.include('max_price');

      // 6. Проверяем, что контейнер с товарами обновился и присутствует на странице
      const productsContainer = By.css('ul.products');
      await driver.wait(until.elementLocated(productsContainer), config.timeout);
      
      console.log(`✓ Тест со сдвигом на ${shiftX}px из 320px успешно выполнен.`);
  
    });
  });
});