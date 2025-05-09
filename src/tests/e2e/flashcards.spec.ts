import { test, expect } from "@playwright/test";
import { HomePage, LoginPage, FlashcardsPage, GeneratePage } from "./page-objects/pages";

test.describe("Flashcards Feature", () => {
  test("user should be able to view flashcards", async ({ page }) => {
    // Initialize page objects
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);
    const flashcardsPage = new FlashcardsPage(page);

    // Navigate to homepage
    await homePage.goto();
    await homePage.expectPageToBeLoaded();

    // Navigate to login page
    await homePage.navigateToLogin();

    // Login with test credentials
    await loginPage.login("test@example.com", "password123");

    // Verify redirection to flashcards page
    await flashcardsPage.expectFlashcardsToBePresent();

    // Take screenshot for visual verification
    await page.screenshot({ path: "./screenshots/flashcards-page.png" });
  });

  test("user should be able to generate new flashcards", async ({ page }) => {
    // Initialize page objects
    const loginPage = new LoginPage(page);
    const flashcardsPage = new FlashcardsPage(page);
    const generatePage = new GeneratePage(page);

    // Start directly from login page
    await loginPage.goto();
    await loginPage.login("test@example.com", "password123");

    // Navigate to generate page
    await flashcardsPage.navigateToGenerateFlashcards();

    // Generate new flashcards
    const sourceText =
      "The mitochondria is the powerhouse of the cell. ATP (adenosine triphosphate) is the energy currency of the cell.";
    await generatePage.generateFlashcards(sourceText);

    // Verify flashcard proposals are displayed
    await generatePage.expectFlashcardProposalsToBePresent();

    // Save flashcards
    await generatePage.saveFlashcards();

    // Verify redirection to flashcards page
    await flashcardsPage.expectFlashcardsToBePresent();

    // Compare screenshot to baseline
    await expect(page).toHaveScreenshot("after-generate-flashcards.png");
  });
});
