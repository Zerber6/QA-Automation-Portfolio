import { By } from 'selenium-webdriver';

export class CatalogPage {
  constructor(driver) {
    this.driver = driver;
  }

  // Боковое меню: Ссылка на категорию "Без категории"
  get uncategorizedCategoryLink() { 
    return By.css('.cat-item a[href*="/uncategorized/"]'); 
  }

  // Боковое меню: Ссылка на категорию "Книги"
  get booksCategoryLink() {
    return By.css('.cat-item a[href*="/catalog/books/"]');
  }

  // Боковое меню: Ссылка на сам корень "Каталог"
  get rootCatalogLink() {
    return By.css('.current-cat > a');
  }

  // Боковое меню: Ссылка на категорию "Одежда"
  get clothingCategoryLink() {
    return By.css('li.cat-item a[href*="/catalog/clothes/"]');
  }

  // Боковое меню: Ссылка на категорию "Электроника"
  get electronicsCategoryLink() {
    return By.css('.cat-item-16 > a');
  }

  // Боковое меню: Ссылка на категорию "Бытовая техника"
  get appliancesCategoryLink() {
    return By.css('.cat-item-20 > a');
  }

  // Боковое меню: Ссылка на категорию "Телефоны"
  get phonesCategoryLink() {
    return By.css('.cat-item-24 > a');
  }

  // Боковое меню: Ссылка на категорию "Фото/видео"
  get photoVideoCategoryLink() {
    return By.css('.cat-item-27 > a');
  }

  // Боковое меню: Ссылка на категорию "Холодильники"
  get refrigeratorsCategoryLink() {
    return By.css('.cat-item-21 > a');
  }

  // ДОБАВЛЯЕМ Боковое меню: Ссылка на категорию "Планшеты" 📱📟
  get tabletsCategoryLink() {
    return By.css('.cat-item-26 > a');
  }

  // Боковое меню: Ссылка на категорию "Планшеты"
  get tabletsCategoryLink() {
    return By.css('.cat-item-26 > a');
  }

  // ДОБАВЛЯЕМ Боковое меню: Ссылка на категорию "Телевизоры" 📺
  get tvCategoryLink() {
    return By.css('.cat-item-25 > a');
  }

  // ДОБАВЛЯЕМ Боковое меню: Ссылка на категорию "Стиральные машины" 🧺🧼
  get washingMachinesCategoryLink() {
    return By.css('.cat-item-22 > a');
  }

  // Боковое меню: Ссылка на категорию "Часы" ⌚🕵️‍♂️
  get watchesCategoryLink() {
    return By.css('.cat-item-23 > a');
  }

  // Методы ожиданий элементов...
  async getUncategorizedLink(until, timeout) {
    const link = await this.driver.wait(until.elementLocated(this.uncategorizedCategoryLink), timeout);
    await this.driver.wait(until.elementIsVisible(link), timeout);
    return link;
  }

  async getBooksLink(until, timeout) {
    const link = await this.driver.wait(until.elementLocated(this.booksCategoryLink), timeout);
    await this.driver.wait(until.elementIsVisible(link), timeout);
    return link;
  }

  async getRootCatalogLink(until, timeout) {
    const link = await this.driver.wait(until.elementLocated(this.rootCatalogLink), timeout);
    await this.driver.wait(until.elementIsVisible(link), timeout);
    return link;
  }

  async getClothingLink(until, timeout) {
    const link = await this.driver.wait(until.elementLocated(this.clothingCategoryLink), timeout);
    await this.driver.wait(until.elementIsVisible(link), timeout);
    return link;
  }

  async getElectronicsLink(until, timeout) {
    const link = await this.driver.wait(until.elementLocated(this.electronicsCategoryLink), timeout);
    await this.driver.wait(until.elementIsVisible(link), timeout);
    return link;
  }

  async getAppliancesLink(until, timeout) {
    const link = await this.driver.wait(until.elementLocated(this.appliancesCategoryLink), timeout);
    await this.driver.wait(until.elementIsVisible(link), timeout);
    return link;
  }

  async getPhonesLink(until, timeout) {
    const link = await this.driver.wait(until.elementLocated(this.phonesCategoryLink), timeout);
    await this.driver.wait(until.elementIsVisible(link), timeout);
    return link;
  }

  async getPhotoVideoLink(until, timeout) {
    const link = await this.driver.wait(until.elementLocated(this.photoVideoCategoryLink), timeout);
    await this.driver.wait(until.elementIsVisible(link), timeout);
    return link;
  }

  async getRefrigeratorsLink(until, timeout) {
    const link = await this.driver.wait(until.elementLocated(this.refrigeratorsCategoryLink), timeout);
    await this.driver.wait(until.elementIsVisible(link), timeout);
    return link;
  }

  // ДОБАВЛЯЕМ Ожидание и получение ссылки "Планшеты"
  async getTabletsLink(until, timeout) {
    const link = await this.driver.wait(until.elementLocated(this.tabletsCategoryLink), timeout);
    await this.driver.wait(until.elementIsVisible(link), timeout);
    return link;
  }

  async getTabletsLink(until, timeout) {
    const link = await this.driver.wait(until.elementLocated(this.tabletsCategoryLink), timeout);
    await this.driver.wait(until.elementIsVisible(link), timeout);
    return link;
  }

  // ДОБАВЛЯЕМ Ожидание и получение ссылки "Телевизоры"
  async getTvLink(until, timeout) {
    const link = await this.driver.wait(until.elementLocated(this.tvCategoryLink), timeout);
    await this.driver.wait(until.elementIsVisible(link), timeout);
    return link;
  }

  // ДОБАВЛЯЕМ Ожидание и получение ссылки "Стиральные машины"
  async getWashingMachinesLink(until, timeout) {
    const link = await this.driver.wait(until.elementLocated(this.washingMachinesCategoryLink), timeout);
    await this.driver.wait(until.elementIsVisible(link), timeout);
    return link;
  }

  // Ожидание появления и получение ссылки "Часы"
  async getWatchesLink(until, timeout) {
    const link = await this.driver.wait(until.elementLocated(this.watchesCategoryLink), timeout);
    await this.driver.wait(until.elementIsVisible(link), timeout);
    return link;
  }
}