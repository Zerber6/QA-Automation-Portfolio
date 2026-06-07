import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { HomePage } from './HomePage.js';

describe('Переход к разделу фотоаппаратов', function() {
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

  it('Перейти на страницу с фотоаппаратами после клика по третьей кнопке "Просмотреть"', async () => {
      
    const TARGET_BUTTON_INDEX = 2; // Индекс 2 — это третья кнопка в массиве

    // 1. Открываем главную страницу сайта
    await driver.get(config.baseUrl);
    
    // Ждем полной загрузки документа
    await driver.wait(
      () => driver.executeScript('return document.readyState').then(ready => ready === 'complete'),
      config.timeout
    );

    // 2. Ждем появления хотя бы одной промо-кнопки в DOM
    await driver.wait(until.elementLocated(homePage.promoButtons), config.timeout);

    // 3. Плавно скроллим экран к третьей промо-кнопке (индекс 2)
    const cameraSectionButton = await homePage.scrollToPromoButtonByIndex(TARGET_BUTTON_INDEX);
    
    // Ожидаем, пока кнопка станет физически видимой после скролла
    await driver.wait(until.elementIsVisible(cameraSectionButton), config.timeout);

    // 4. Кликаем по кнопке «Просмотреть» раздела фото/видео
    await cameraSectionButton.click();

    // 5. Ожидаем изменения URL на категорию фото и видео
    await driver.wait(
      until.urlContains('photo_video'),
      config.timeout,
      'Страница фото/видео товаров не загрузилась'
    );

    // 6. Финальная проверка актуального URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include('photo_video');

  });
});