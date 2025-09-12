import { expect, type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async assertOnPage() {
    await expect(this.page).toHaveURL(/.*cart.html/);
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async removeProductFromCart(productName: string) {
    const product = this.cartItems.filter({ hasText: productName });
    await product.locator('button.cart_button').click();
  }

  async assertProductIsRemoved(productName: string) {
    await expect(this.cartItems.filter({ hasText: productName })).not.toBeVisible();
  }

  async goToCheckout() {
    await this.checkoutButton.click();
  }
}
