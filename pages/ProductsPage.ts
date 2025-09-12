import { expect, type Locator, type Page } from '@playwright/test';

export class ProductsPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly sortDropdown: Locator;
  readonly inventoryItems: Locator;
  readonly addToCartButton: Locator;
  readonly removeFromCartButton: Locator;
  readonly shoppingCartLink: Locator;
  readonly burgerMenuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.sortDropdown = page.locator('.product_sort_container');
    this.inventoryItems = page.locator('.inventory_item');
    this.addToCartButton = page.locator('button.btn_inventory');
    this.removeFromCartButton = page.locator('button.btn_secondary');
    this.shoppingCartLink = page.locator('.shopping_cart_link');
    this.burgerMenuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async assertOnPage() {
    await expect(this.page).toHaveURL(/.*inventory.html/);
    await expect(this.pageTitle).toHaveText('Products');
    //await expect(this.sortDropdown).toBeVisible();
  }

  async addProductToCart(productName: string) {
    const product = this.inventoryItems.filter({ hasText: productName });
    await product.locator('button.btn_inventory').click();
  }

  async removeProductFromCart(productName: string) {
    const product = this.inventoryItems.filter({ hasText: productName });
    await product.locator('button.btn_secondary').click();
  }

  async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames(): Promise<string[]> {
    return this.inventoryItems.locator('.inventory_item_name').allInnerTexts();
  }

  async getProductPrices(): Promise<number[]> {
    const pricesText = await this.inventoryItems.locator('.inventory_item_price').allInnerTexts();
    return pricesText.map((price) => parseFloat(price.replace('$', '')));
  }

  async navigateToProductDetail(productName: string) {
    await this.inventoryItems
      .filter({ hasText: productName })
      .locator('.inventory_item_name')
      .click();
  }

  async getCartBadgeCount(): Promise<string> {
    return this.shoppingCartLink.locator('.shopping_cart_badge').innerText();
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }

  async logout() {
    await this.burgerMenuButton.click();
    await this.logoutLink.click();
  }
}
