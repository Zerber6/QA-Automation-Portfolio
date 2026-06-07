# Web Automation Project: Shopping Cart Validation

This repository contains an automated test suite designed using the **Page Object Model (POM)** pattern. The project automates the validation of critical shopping cart workflows, ensuring consistent element rendering and data integrity across various viewports.

---

## Key Features

*   **Page Object Model Architecture**: Strict separation between test logic and UI locators for maximum maintainability.
*   **Robust Dynamic Locators**: Built using advanced structural CSS-selectors (`td.product-thumbnail img`, `button[name="apply_coupon"]`) avoiding fragile absolute paths.
*   **Visual Step Highlighting**: Integrated JavaScript execution (`executeScript`) that dynamically highlights verified web elements in real-time for transparent visual debugging.

---

## Tech Stack

*   **Language**: JavaScript (ES6+)
*   **Framework**: Selenium WebDriver
*   **Environment**: Node.js, VS Code, Git Bash

---

## Installation & Setup

1. **Clone the repository:**

   git clone https://github.com/Zerber6/QA-Automation-Portfolio.git

2. Install all project dependencies: npm install

3. Commands for running tests:

* `npm run test:all` - Runs all tests
* `npm run test:home` - Runs all tests for the Home page
* `npm run test:catalog` - Runs all tests for the Product Catalog
* `npm run test:cart` - Runs all tests for the Shopping Cart
* `npm run test:auth/reg` - Runs all tests for Authorization and Registration
* `npm run test:order` - Runs all tests for Order Processing


# Автоматизация тестирования интернет-магазина (E2E)

Проект содержит комплекс автоматизированных тестов для проверки ключевого функционала современного веб-приложения (интернет-магазина). Тесты написаны с фокусом на стабильность, высокую скорость выполнения и масштабируемость архитектуры.

## Стек технологий
* **Язык программирования:** JavaScript (Node.js)
* **Инструмент автоматизации:** Selenium WebDriver
* **Архитектурный паттерн:** Page Object Model (POM)

## Особенности архитектуры проекта
* **Page Object Pattern:** Вся логика взаимодействия с элементами страниц (Каталог, Сортировка, Оформление заказа) вынесена в отдельные классы. Это обеспечивает легкую поддержку кода при изменении UI сайта.
* **Борьба с хрупкими локаторами:** Тесты адаптированы для работы в реальных условиях. Вместо жестких пауз (ACTION_PAUSE) реализованы динамические ожидания элементов, что делает прогоны быстрыми и стабильными.
* **Покрытие бизнес-сценариев:**
  * Скроллинг и взаимодействие со сложными компонентами интерфейса (слайдеры).
  * Динамическая сортировка товаров в каталоге с автоматической проверкой результатов.
  * Сквозной (End-to-End) сценарий покупки: от работы с каталогом до выбора способов оплаты.

## Как запустить тесты локально

1. Клонируйте репозиторий:

   git clone https://github.com/Zerber6/QA-Automation-Portfolio.git

2. Установите все зависимости проекта: npm install

3. Команды для запуска тестов:

* `npm run test:all` - Запускает все проверки
* `npm run test:home` - Запускает все проверки для Главной страницы
* `npm run test:catalog` - Запускает все проверки для Каталога Товаров
* `npm run test:cart` - Запускает все проверки для Корзины товаров
* `npm run test:auth/reg` - Запускает все проверки для Авторизации и Регистрации
* `npm run test:order` - Запускает все проверки для Оформления Заказов
