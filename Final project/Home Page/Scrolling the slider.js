import { until } from 'selenium-webdriver';
import { expect } from 'chai';
import { config } from './config.js';
import { HomePage } from './HomePage.js';

describe('Тестирование карусели на Главной странице', function() {
  let driver;
  let homePage;

  this.timeout(config.mochaTimeout * 2);

  before(async function() {
    driver = await config.getDriver();
    homePage = new HomePage(driver);
  });

  after(async function() {
    if (driver) {
      await driver.quit();
    }
  });

  it('Прокрутка слайдера до слайда с индексом 8', async function() {
    const TARGET_INDEX = 8;
    const CLICK_DELAY = 600; // Микро-пауза (0.6 сек) чтобы JS на сайте успевал обрабатывать клики

    // 1. Открываем главную страницу
    await driver.get(config.baseUrl);

    // 2. Ждем, пока загрузятся слайды карусели
    await driver.wait(until.elementLocated(homePage.slickSlides), config.timeout);

    // 3. Скроллим к началу слайдера
    await homePage.scrollSlideIntoView(-3);
    await driver.sleep(CLICK_DELAY);

    // 4. Кликаем по стрелке в цикле с минимальной технической задержкой
    for (let i = 0; i < TARGET_INDEX; i++) {
      await homePage.jsClickNext(); 
      await driver.sleep(CLICK_DELAY); 
    }

    // Получаем локатор целевого слайда (индекс 8)
    const targetSlideLocator = homePage.getSlideByIndex(TARGET_INDEX);

    // 5. Дожидаемся появления самого элемента в DOM-дереве
    const targetSlide = await driver.wait(
      until.elementLocated(targetSlideLocator), 
      config.timeout
    );

    // 6. Ждем, пока класс слайда обновится и включит в себя 'slick-active'
    await driver.wait(async () => {
      const classAttribute = await targetSlide.getAttribute('class');
      return classAttribute.includes('slick-active');
    }, config.timeout, 'Слайд так и не стал активным после серии кликов');

    // 7. Финальная проверка
    const finalClass = await targetSlide.getAttribute('class');
    console.log(`Классы целевого слайда после завершения анимации: ${finalClass}`);
    
    expect(finalClass).to.include('slick-active', 'Слайд должен быть активным!');
  });
});