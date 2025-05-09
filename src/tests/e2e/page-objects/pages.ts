import { expect, type Page, type Locator } from "@playwright/test";

/**
 * Base page object class that all page objects inherit from
 */
export class BasePage {
  readonly page: Page;
  readonly url: string;

  constructor(page: Page, url: string) {
    this.page = page;
    this.url = url;
  }

  async goto() {
    await this.page.goto(this.url);
  }

  async waitForPageLoad() {
    // Wait for main content to be visible
    await this.page.waitForSelector("main", { state: "visible" });
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `./screenshots/${name}.png` });
  }
}

/**
 * HomePage page object representing the index page
 */
export class HomePage extends BasePage {
  readonly welcomeMessage: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page, "/");
    this.welcomeMessage = page.getByRole("heading", { level: 1 });
    this.loginButton = page.getByRole("link", { name: /login/i });
  }

  async expectPageToBeLoaded() {
    await expect(this.welcomeMessage).toBeVisible();
  }

  async navigateToLogin() {
    await this.loginButton.click();
  }
}

/**
 * LoginPage page object representing the login page
 */
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, "/login");
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.submitButton = page.getByRole("button", { name: /sign in/i });
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}

/**
 * FlashcardsPage page object representing the flashcards page
 */
export class FlashcardsPage extends BasePage {
  readonly flashcardList: Locator;
  readonly generateButton: Locator;

  constructor(page: Page) {
    super(page, "/flashcards");
    this.flashcardList = page.locator('[data-testid="flashcard-list"]');
    this.generateButton = page.getByRole("link", { name: /generate/i });
  }

  async expectFlashcardsToBePresent() {
    await expect(this.flashcardList).toBeVisible();
  }

  async navigateToGenerateFlashcards() {
    await this.generateButton.click();
  }
}

/**
 * GeneratePage page object representing the generate flashcards page
 */
export class GeneratePage extends BasePage {
  readonly sourceTextInput: Locator;
  readonly generateButton: Locator;
  readonly flashcardProposalList: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page, "/generate");
    this.sourceTextInput = page.locator('[data-testid="source-text-input"]');
    this.generateButton = page.getByRole("button", { name: /generate/i });
    this.flashcardProposalList = page.locator('[data-testid="flashcard-proposal-list"]');
    this.saveButton = page.getByRole("button", { name: /save/i });
  }

  async generateFlashcards(sourceText: string) {
    await this.sourceTextInput.fill(sourceText);
    await this.generateButton.click();
  }

  async expectFlashcardProposalsToBePresent() {
    await expect(this.flashcardProposalList).toBeVisible();
  }

  async saveFlashcards() {
    await this.saveButton.click();
  }
}
