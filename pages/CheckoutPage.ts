import { expect, type Locator, type Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  // Step One
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step Two
  readonly itemTotalLabel: Locator;
  readonly finishButton: Locator;

  // Complete
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.itemTotalLabel = page.locator('.summary_subtotal_label');
    this.finishButton = page.locator('[data-test="finish"]');
    this.completeHeader = page.locator('.complete-header');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async assertInformationError(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toHaveText(message);
  }

  async assertItemTotal(expectedTotal: string) {
    await expect(this.itemTotalLabel).toContainText(expectedTotal);
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async assertOrderComplete() {
    await expect(this.page).toHaveURL(/.*checkout-complete.html/);
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }
}
