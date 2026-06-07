import { By } from 'selenium-webdriver';

export class SortPage {
  constructor(driver) {
    this.driver = driver;
  }

  // Главный выпадающий список сортировки
  get sortSelect() {
    return By.css('select.orderby');
  }

  // Добавь это внутрь класса SortPage, если хочешь иметь прямой селектор:
  get defaultSortOption() {
  return By.css('option[value="menu_order"]');
}

  // Метод выбора сортировки по её value (date, price, price-desc и т.д.)
  async selectSortByValue(until, value, timeout) {
    const selectElement = await this.driver.wait(until.elementLocated(this.sortSelect), timeout);
    await selectElement.click(); // Открываем список

    const optionLocator = By.css(`option[value="${value}"]`);
    const optionElement = await this.driver.wait(until.elementLocated(optionLocator), timeout);
    await optionElement.click(); // Кликаем по нужной опции
  }

  // Получить текст текущей выбранной опции
  async getSelectedOptionText(until, timeout) {
    const selectedOptionLocator = By.css('select.orderby option:checked');
    const element = await this.driver.wait(until.elementLocated(selectedOptionLocator), timeout);
    return await element.getText();
  }
}