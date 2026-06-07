import { By } from 'selenium-webdriver';

export class HomePage {
  constructor(driver) {
    this.driver = driver;
  }

  // ==========================================
  // ЛОКАТОРЫ (БАЗА ЭЛЕМЕНТОВ С КЛАССАМИ И ID)
  // ==========================================
  get slickSlides() { return By.css('.slick-slide'); }
  get nextButton() { return By.css('.slick-next'); }
  get viewBooksButton() { return By.css('.promo-link-btn'); }
  get catalogMenuLink() { return By.css('#menu-primary-menu a[href*="catalog"]'); }
  get promoButtons() { return By.css('span.promo-link-btn, .promo-link-btn'); }
  get mainCartMenuLink() { return By.css('#menu-primary-menu a[href*="/cart/"]'); }
  get myAccountMenuLink() { return By.css('#menu-primary-menu a[href*="/my-account/"]'); }

  // Подменю 2-го уровня (Выпадают при наведении на Каталог)
  get booksSubMenuLink() { return By.css('.sub-menu a[href*="books"]'); }
  get clothesSubMenuLink() { return By.css('.sub-menu a[href*="clothes"]'); }
  get electronicsSubMenuLink() { return By.css('.sub-menu a[href*="electronics"]'); }
  get appliancesSubMenuLink() { return By.css('.sub-menu a[href*="appliances"]'); }

  // Подменю 3-го уровня (Выпадают из Электроники и Бытовой техники)
  get phonesSubMenuLink() { return By.css('.sub-menu a[href*="phones"]'); }
  get photoVideoSubMenuLink() { return By.css('.sub-menu a[href*="photo_video"]'); }
  get refrigeratorsSubMenuLink() { return By.css('.sub-menu a[href*="refrigerators"]'); }
  get tabletsSubMenuLink() { return By.css('.sub-menu a[href*="pad"]'); }
  get tvSubMenuLink() { return By.css('.sub-menu a[href*="/tv/"]'); }
  get washMachinesSubMenuLink() { return By.css('.sub-menu a[href*="wash"]'); }
  get watchesSubMenuLink() { return By.css('.sub-menu a[href*="watch"]'); }


  // ==========================================
  // МЕТОДЫ ДЛЯ РАБОТЫ С СТРАНИЦЕЙ
  // ==========================================

  // Карусель: получить слайд по индексу
  getSlideByIndex(index) { 
    return By.css(`.slick-slide[data-slick-index="${index}"]`); 
  }

  // Карусель: плавный скролл к слайду
  async scrollSlideIntoView(index) {
    const slide = await this.driver.findElement(this.getSlideByIndex(index));
    await this.driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center"});', slide);
  }

  // Карусель: клик по кнопке "Вперед" через JS
  async jsClickNext() {
    const nextBtn = await this.driver.findElement(this.nextButton);
    await this.driver.executeScript('arguments[0].click();', nextBtn);
  }

  // Найти промо-кнопку ("Просмотреть") по индексу и плавно скроллить к ней
  async scrollToPromoButtonByIndex(index) {
    const buttons = await this.driver.findElements(this.promoButtons);
    if (buttons.length <= index) {
      throw new Error(`Не удалось найти промо-кнопку с индексом ${index}. Всего кнопок: ${buttons.length}`);
    }
    const targetButton = buttons[index];
    await this.driver.executeScript('arguments[0].scrollIntoView({behavior: "smooth", block: "center"});', targetButton);
    return targetButton;
  }

  // Простой ховер: наведение мыши на корень "Каталог"
  async hoverOverCatalogMenu() {
    const catalogLink = await this.driver.findElement(this.catalogMenuLink);
    const actions = this.driver.actions({ bridge: true });
    await actions.move({ origin: catalogLink }).perform();
  }


  // ==========================================
  // СЛОЖНЫЕ МАРШРУТЫ НАВИГАЦИИ (ХОВЕРЫ)
  // ==========================================

  // 1. Маршрут: Каталог -> Электроника -> Телефоны
  async hoverAndNavigateToPhones(until, timeout) {
    const actions = this.driver.actions({ bridge: true });

    const catalogLink = await this.driver.findElement(this.catalogMenuLink);
    await actions.move({ origin: catalogLink }).perform();
    await this.driver.sleep(1000);

    const electronicsLink = await this.driver.wait(until.elementLocated(this.electronicsSubMenuLink), timeout);
    await this.driver.wait(until.elementIsVisible(electronicsLink), timeout);
    await actions.move({ origin: electronicsLink }).perform();
    await this.driver.sleep(1000);

    const phonesLink = await this.driver.wait(until.elementLocated(this.phonesSubMenuLink), timeout);
    await this.driver.wait(until.elementIsVisible(phonesLink), timeout);
    return phonesLink;
  }

  // 2. Маршрут: Каталог -> Электроника -> Фото/видео
  async hoverAndNavigateToPhotoVideo(until, timeout) {
    const actions = this.driver.actions({ bridge: true });

    const catalogLink = await this.driver.findElement(this.catalogMenuLink);
    await actions.move({ origin: catalogLink }).perform();
    await this.driver.sleep(1000);

    const electronicsLink = await this.driver.wait(until.elementLocated(this.electronicsSubMenuLink), timeout);
    await this.driver.wait(until.elementIsVisible(electronicsLink), timeout);
    await actions.move({ origin: electronicsLink }).perform();
    await this.driver.sleep(1000);

    const photoVideoLink = await this.driver.wait(until.elementLocated(this.photoVideoSubMenuLink), timeout);
    await this.driver.wait(until.elementIsVisible(photoVideoLink), timeout);
    return photoVideoLink;
  }

  // 3. Маршрут: Каталог -> Электроника -> Планшеты
  async hoverAndNavigateToTablets(until, timeout) {
    const actions = this.driver.actions({ bridge: true });

    const catalogLink = await this.driver.findElement(this.catalogMenuLink);
    await actions.move({ origin: catalogLink }).perform();
    await this.driver.sleep(1000);

    const electronicsLink = await this.driver.wait(until.elementLocated(this.electronicsSubMenuLink), timeout);
    await this.driver.wait(until.elementIsVisible(electronicsLink), timeout);
    await actions.move({ origin: electronicsLink }).perform();
    await this.driver.sleep(1000);

    const tabletsLink = await this.driver.wait(until.elementLocated(this.tabletsSubMenuLink), timeout);
    await this.driver.wait(until.elementIsVisible(tabletsLink), timeout);
    return tabletsLink;
  }

  // 4. Маршрут: Каталог -> Бытовая техника -> Холодильники (ПОЛНОСТЬЮ ИСПРАВЛЕН!)
  async hoverAndNavigateToRefrigerators(until, timeout) {
    const actions = this.driver.actions({ bridge: true });

    // Шаг 1: Наведение на Каталог
    const catalogLink = await this.driver.findElement(this.catalogMenuLink);
    await actions.move({ origin: catalogLink }).perform();
    await this.driver.sleep(1000);

    // Шаг 2: Наведение на Бытовую технику (this. добавлен, мусор удален)
    const appliancesLink = await this.driver.wait(until.elementLocated(this.appliancesSubMenuLink), timeout);
    await this.driver.wait(until.elementIsVisible(appliancesLink), timeout);
    await actions.move({ origin: appliancesLink }).perform();
    await this.driver.sleep(1000);

    // Шаг 3: Ожидание Холодильников
    const refrigeratorsLink = await this.driver.wait(until.elementLocated(this.refrigeratorsSubMenuLink), timeout);
    await this.driver.wait(until.elementIsVisible(refrigeratorsLink), timeout);
    return refrigeratorsLink;
  }

    // НАШ НОВЫЙ МАРШРУТ: Ведём мышку сквозь Каталог и Электронику к Телевизорам
    async hoverAndNavigateToTVs(until, timeout) {
    const actions = this.driver.actions({ bridge: true });

    // 1. Наводим мышь на Каталог
    const catalogLink = await this.driver.findElement(this.catalogMenuLink);
    await actions.move({ origin: catalogLink }).perform();
    await this.driver.sleep(1000);

    // 2. Ждем и наводим мышь на Электронику
    const electronicsLink = await this.driver.wait(
      until.elementLocated(this.electronicsSubMenuLink),
      timeout
    );
    await this.driver.wait(until.elementIsVisible(electronicsLink), timeout);
    await actions.move({ origin: electronicsLink }).perform();
    await this.driver.sleep(1000);

    // 3. Ждем появления ссылки на Телевизоры
    const tvLink = await this.driver.wait(
      until.elementLocated(this.tvSubMenuLink),
      timeout
    );
    await this.driver.wait(until.elementIsVisible(tvLink), timeout);
    
    return tvLink; // Возвращаем готовый элемент для клика!
  }

  // НАШ НОВЫЙ МАРШРУТ: Ведём мышку сквозь Каталог и Бытовую технику к Стиральным машинам
  async hoverAndNavigateToWashingMachines(until, timeout) {
    const actions = this.driver.actions({ bridge: true });

    // 1. Наводим мышь на Каталог
    const catalogLink = await this.driver.findElement(this.catalogMenuLink);
    await actions.move({ origin: catalogLink }).perform();
    await this.driver.sleep(1000);

    // 2. Ждем и наводим мышь на Бытовую технику
    const appliancesLink = await this.driver.wait(
      until.elementLocated(this.appliancesSubMenuLink),
      timeout
    );
    await this.driver.wait(until.elementIsVisible(appliancesLink), timeout);
    await actions.move({ origin: appliancesLink }).perform();
    await this.driver.sleep(1000);

    // 3. Ждем появления ссылки на Стиральные машины
    const washLink = await this.driver.wait(
      until.elementLocated(this.washMachinesSubMenuLink),
      timeout
    );
    await this.driver.wait(until.elementIsVisible(washLink), timeout);
    
    return washLink; // Возвращаем готовый элемент для клика!
  }

  // НАШ ФИНАЛЬНЫЙ МАРШРУТ: Ведём мышку сквозь Каталог и Электронику к Часам
  async hoverAndNavigateToWatches(until, timeout) {
    const actions = this.driver.actions({ bridge: true });

    // 1. Наводим мышь на Каталог
    const catalogLink = await this.driver.findElement(this.catalogMenuLink);
    await actions.move({ origin: catalogLink }).perform();
    await this.driver.sleep(1000);

    // 2. Ждем и наводим мышь на Электронику
    const electronicsLink = await this.driver.wait(
      until.elementLocated(this.electronicsSubMenuLink),
      timeout
    );
    await this.driver.wait(until.elementIsVisible(electronicsLink), timeout);
    await actions.move({ origin: electronicsLink }).perform();
    await this.driver.sleep(1000);

    // 3. Ждем появления ссылки на Часы
    const watchesLink = await this.driver.wait(
      until.elementLocated(this.watchesSubMenuLink),
      timeout
    );
    await this.driver.wait(until.elementIsVisible(watchesLink), timeout);
    
    return watchesLink; // Возвращаем элемент для клика
  }

  // ВОЗВРАЩАЕМ МЕТОД ДЛЯ КНИГ: скроллит к первой промо-кнопке (индекс 0)
  async scrollToViewBooksButton() {
    const buttons = await this.driver.findElements(this.promoButtons);
    if (buttons.length === 0) {
      throw new Error("Не найдено ни одной промо-кнопки на главной странице!");
    }
    const targetButton = buttons[0]; // Книги всегда первые
    await this.driver.executeScript(
      'arguments[0].scrollIntoView({behavior: "smooth", block: "center"});', 
      targetButton
    );
    return targetButton;
  }
}