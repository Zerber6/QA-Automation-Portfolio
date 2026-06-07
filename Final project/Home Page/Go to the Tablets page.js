import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { HomePage } from './HomePage.js';

describe('Переход к разделу планшетов', function() {
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

  it('Перейти на страницу с планшетами после клика по второй кнопке "Просмотреть"', async () => {
    const PAD_CATEGORY_PATH = '/product-category/catalog/electronics/pad/';
      
    const TARGET_BUTTON_INDEX = 1; // Индекс 1 — это вторая кнопка в массиве (раздел планшетов)

    // 1. Открываем главную страницу сайта
    await driver.get(config.baseUrl);
    

    // Ждем полной загрузки документа
    await driver.wait(
      () => driver.executeScript('return document.readyState').then(ready => ready === 'complete'),
      config.timeout
    );

    // 2. Ждем появления хотя бы одной промо-кнопки в DOM
    await driver.wait(until.elementLocated(homePage.promoButtons), config.timeout);

    // 3. Плавно скроллим экран ко второй промо-кнопке (индекс 1)
    const tabletSectionButton = await homePage.scrollToPromoButtonByIndex(TARGET_BUTTON_INDEX);
    
    // Ожидаем, пока кнопка станет физически видимой на экране после скролла
    await driver.wait(until.elementIsVisible(tabletSectionButton), config.timeout);

    // 4. Кликаем по кнопке «Просмотреть» раздела планшетов
    await tabletSectionButton.click();

    // 5. Ожидаем изменения URL на категорию планшетов (pad)
    await driver.wait(
      until.urlContains(PAD_CATEGORY_PATH),
      config.timeout,
      'Страница планшетов не загрузилась вовремя'
    );

    // 6. Финальная проверка актуального URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(PAD_CATEGORY_PATH.toLowerCase());

  });
});