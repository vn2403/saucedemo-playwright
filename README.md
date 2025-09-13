# Murmuration - Senior QA Engineer Hiring Exercise

This project contains an automated test suite for the Sauce Labs demo website (https://www.saucedemo.com/) as part of the hiring assessment. The tests are built using Playwright with TypeScript and follow the Page Object Model (POM) design pattern.

## Table of Contents

- [Installation](#installation)
- [Running the Tests](#running-the-tests)
- [Project Structure](#project-structure)
- [Answers to Questions](#answers-to-questions)

Just a couple of things to get started:

- Node.js: Make sure you have Node.js on your machine. The LTS version is always a safe bet.
- A code editor: I'd recommend VS Code, it has a great Playwright extension that makes life easier.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd playwright-assessment
    ```
2.  **Install dependencies:**
    This project uses `npm` to manage dependencies.
    ```bash
    npm install
    ```
3.  **Install Playwright browsers:**
    The first time you install Playwright, you'll need to download the browser binaries.
    ```bash
    npx playwright install
    ```

## Running the Tests

You can run the full suite of tests using the following commands:

- **Run all tests in headless mode:**

  ```bash
  npm test
  ```

  or

  ```bash
  npx playwright test
  ```

- **Run all tests in headed mode (to watch the browser):**

  ```bash
  npm run test:headed
  ```

- **View the HTML report:**
  After a test run is complete, an HTML report is generated in the `playwright-report` directory. You can view it with:
  ```bash
  npm run report
  ```

## Project Structure

The project is organized using the Page Object Model (POM) to ensure the code is scalable and maintainable.

- `/pages`: Contains the Page Object classes. Each class represents a page of the application and encapsulates the locators and methods to interact with that page.
  - `LoginPage.ts`
  - `ProductsPage.ts`
  - `CartPage.ts`
  - `CheckoutPage.ts`
- `/tests`: Contains the test files (`specs`). Each file groups related tests (e.g., login, checkout).
  - `login.spec.ts`
  - `products.spec.ts`
  - `cart.spec.ts`
  - `checkout.spec.ts`
- `playwright.config.ts`: The main configuration file for Playwright.
- `package.json`: Defines project dependencies and scripts.

---

## Answers to Questions

### 1. Why did you choose the testing framework you did?

I chose **Playwright** for this assessment for several key reasons:

- **Modern Architecture:** Playwright is built on a modern architecture that interacts directly with browser protocols, making it fast, reliable, and less prone to flakiness compared to older frameworks like Selenium.
- **Auto-Waits:** It has built-in auto-waiting mechanisms, which means I don't need to add explicit waits (`sleeps`), leading to more stable and faster tests.
- **Cross-Browser Support:** It offers excellent first-party support for Chromium, Firefox, and WebKit, allowing for comprehensive cross-browser testing with a single API.
- **Rich Feature Set:** Playwright comes with powerful tools out-of-the-box, including a test runner, assertions, reporting, tracing, and screenshot/video recording, which simplifies the setup process.
- **Developer Experience:** The API is intuitive and well-documented. Features like the Codegen tool and Trace Viewer significantly speed up test creation and debugging.

### 2. Have you used any design patterns? (e.g., Page Object, Factory, Singleton)

Yes, I have used the **Page Object Model (POM)** design pattern.

The codebase is structured with a `/pages` directory containing classes that model the pages of the application (e.g., `LoginPage`, `ProductsPage`). This pattern helps to:

- **Improve Maintainability:** By separating test logic from UI interaction logic, UI changes only require updates in the corresponding page object, not in every test that uses that UI element.
- **Increase Reusability:** Methods in the page objects can be reused across multiple tests.
- **Enhance Readability:** Tests become cleaner and more descriptive, as they call high-level methods like `loginPage.login(...)` instead of low-level UI interactions.

### 3. What are other tests you would recommend creating for this example?

Beyond the required tests, I would recommend creating tests for:

- **Visual Regression Testing:** To catch unintended UI changes, especially for a retail site where visual presentation is key.
- **Accessibility Testing:** Using a library like `axe-playwright` to ensure the site is usable by people with disabilities (WCAG compliance).
- **Performance Testing:** While Playwright isn't a dedicated load testing tool, it can be used to capture basic performance metrics (e.g., page load times, Lighthouse scores) for critical user flows.
- **Edge Case Scenarios:**
  - Testing with a cart that has every single item added.
  - Attempting to checkout with an empty cart.
  - Testing the sorting functionality with products that have the same price.
  - Directly navigating to pages that should require authentication (e.g., `/inventory.html`) without being logged in.
- **API Level Testing:** Testing the backend APIs directly to verify data integrity and business logic without the overhead of the UI.

### 4. How would you validate security aspects of the site?

I would focus on several key areas:

- **Authentication and Session Management:**
  - Verify that secure (HTTPS) cookies are used for session tokens.
  - Check that logging out properly invalidates the session token on the server-side.
  - Ensure that password fields do not support autocomplete and that sensitive data is not stored in local storage.
  - Test for brute-force vulnerabilities on the login page (e.g., account lockout after multiple failed attempts).
- **Input Validation:**
  - Test for Cross-Site Scripting (XSS) by injecting simple scripts (`<script>alert('XSS')</script>`) into input fields like the checkout form and verifying they are properly sanitized (not executed).
  - Test for SQL Injection by entering SQL-like syntax in input fields.
- **Access Control:**
  - Verify that a standard user cannot access administrative endpoints or pages (if any exist).
  - Ensure a user cannot view another user's order details by manipulating URL parameters.
- **Dependency Scanning:** Use tools like `npm audit` to check for known vulnerabilities in third-party libraries.

### 5. Could you find a bug on the test site?

Yes, I found a few minor issues and one potential bug:

- **Potential Bug:** The sorting functionality for "Price (low to high)" and "Price (high to low)" appears to work correctly. However, if two items had the exact same price, the secondary sort order is not defined. While not a breaking bug, a robust implementation would have a consistent secondary sort (e.g., by name) to prevent items from randomly swapping positions on re-sort.
- **Minor UI Issue:** When an error message appears on the login page or checkout page, it pushes the content down, causing a layout shift. This is not ideal from a user experience perspective.
- **Data Integrity:** The application state is not always cleared on logout. For example, if you add items to the cart, log out, and then log back in _as a different user_, the items from the previous session might still be in the cart. In a real-world application, a user's cart should be tied to their specific account. This could be considered a bug.
