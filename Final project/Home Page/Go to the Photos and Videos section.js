import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { HomePage } from './HomePage.js';

describe('Сложная навигация по многоуровневому меню', function() {
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

  it('Успешно перейти в раздел "Фото/видео" через цепочку меню Каталог -> Электроника', async () => {
    const PHOTO_VIDEO_PATH = '/photo_video/';

    // 1. Открываем главную страницу сайта
    await driver.get(config.baseUrl);
    

    // 2. Запускаем наш сложный поэтапный ховер-маршрут по меню
    const photoVideoMenuLink = await homePage.hoverAndNavigateToPhotoVideo(until, config.timeout);

    // 3. Кликаем по пункту "Фото/видео"
    await photoVideoMenuLink.click();

    // 4. Ожидаем, что URL изменится на нужный нам раздел
    await driver.wait(
      until.urlContains(PHOTO_VIDEO_PATH),
      config.timeout,
      'Страница Фото/видео не загрузилась вовремя'
    );

    // 5. Безопасная финальная проверка актуального URL
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl.toLowerCase()).to.include(PHOTO_VIDEO_PATH.toLowerCase());

  });
});