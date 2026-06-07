import { By } from 'selenium-webdriver';

export class LoginPage {
  constructor(driver) {
    this.driver = driver;
  }

  // ЛОКАТОРЫ АВТОРИЗАЦИИ
  get usernameField() { return By.css('#username'); }
  get passwordField() { return By.css('#password'); }
  get loginButton() { return By.css('button[name="login"]'); }

  // ЛОКАТОРЫ РЕГИСТРАЦИИ (Добавили из твоих новых тестов)
  get regUsernameField() { return By.css('#reg_username'); }
  get regEmailField() { return By.css('#reg_email'); }
  get regPasswordField() { return By.css('#reg_password'); }
  get registerButton() { return By.css('button[name="register"]'); }
  get errorList() { return By.css('ul.woocommerce-error'); }

  // МЕТОДЫ
  async login(user, pass) {
    await this.driver.findElement(this.usernameField).sendKeys(user);
    await this.driver.findElement(this.passwordField).sendKeys(pass);
    await this.driver.findElement(this.loginButton).click();
  }

  async register(email, pass, username = null) {
    if (username) await this.driver.findElement(this.regUsernameField).sendKeys(username);
    await this.driver.findElement(this.regEmailField).sendKeys(email);
    await this.driver.findElement(this.regPasswordField).sendKeys(pass);
    await this.driver.findElement(this.registerButton).click();
  }
}