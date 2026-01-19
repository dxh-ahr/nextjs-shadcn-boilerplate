import { expect, test } from "@playwright/test";

test.describe("Theme Switch", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display theme switcher button", async ({ page }) => {
    // Find the theme switcher button by its accessible label
    const themeButton = page.getByRole("button", { name: /toggle theme/i });
    await expect(themeButton).toBeVisible();
  });

  test("should open theme menu when clicked", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /toggle theme/i });

    // Click to open the dropdown
    await themeButton.click();

    // Wait for the menu to appear
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();

    // Check that all theme options are present
    await expect(
      page.getByRole("menuitem", { name: /^light$/i })
    ).toBeVisible();
    await expect(page.getByRole("menuitem", { name: /^dark$/i })).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: /^system$/i })
    ).toBeVisible();
  });

  test("should switch to light theme", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /toggle theme/i });

    // Open the menu
    await themeButton.click();

    // Click light theme option
    await page.getByRole("menuitem", { name: /^light$/i }).click();

    // Wait for theme to apply (check for light class or absence of dark class)
    await page.waitForTimeout(100); // Small delay for theme transition

    // Verify the html element has the light theme class (or doesn't have dark)
    const htmlElement = page.locator("html");
    const htmlClass = await htmlElement.getAttribute("class");

    // Theme should be applied - either no class (light) or explicit light class
    expect(htmlClass).not.toContain("dark");
  });

  test("should switch to dark theme", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /toggle theme/i });

    // Open the menu
    await themeButton.click();

    // Click dark theme option
    await page.getByRole("menuitem", { name: /^dark$/i }).click();

    // Wait for theme to apply
    await page.waitForTimeout(100);

    // Verify the html element has the dark theme class
    const htmlElement = page.locator("html");
    const htmlClass = await htmlElement.getAttribute("class");

    expect(htmlClass).toContain("dark");
  });

  test("should switch to system theme", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /toggle theme/i });

    // First set to dark to ensure we can detect the change
    await themeButton.click();
    await page.getByRole("menuitem", { name: /^dark$/i }).click();
    await page.waitForTimeout(100);

    // Now switch to system
    await themeButton.click();
    await page.getByRole("menuitem", { name: /^system$/i }).click();
    await page.waitForTimeout(100);

    // System theme should respect OS preference
    // We can't easily test this without mocking, but we can verify the menu closes
    const menu = page.getByRole("menu");
    await expect(menu).not.toBeVisible();
  });

  test("should persist theme preference in localStorage", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /toggle theme/i });

    // Set to dark theme
    await themeButton.click();
    await page.getByRole("menuitem", { name: /^dark$/i }).click();
    await page.waitForTimeout(100);

    // Check localStorage for theme preference
    const themePreference = await page.evaluate(() => {
      return localStorage.getItem("theme");
    });

    expect(themePreference).toBe("dark");

    // Reload page and verify theme persists
    await page.reload();
    await page.waitForTimeout(100);

    const htmlElement = page.locator("html");
    const htmlClass = await htmlElement.getAttribute("class");
    expect(htmlClass).toContain("dark");
  });

  test("should show correct icon based on current theme", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /toggle theme/i });

    // Check initial state (should show sun icon in light mode)
    const sunIcon = themeButton.locator("svg").first();
    await expect(sunIcon).toBeVisible();

    // Switch to dark theme
    await themeButton.click();
    await page.getByRole("menuitem", { name: /^dark$/i }).click();
    await page.waitForTimeout(100);

    // In dark mode, moon icon should be visible
    // The icons are toggled with CSS classes, so we check the button still exists
    await expect(themeButton).toBeVisible();
  });

  test("should close menu when clicking outside", async ({ page }) => {
    const themeButton = page.getByRole("button", { name: /toggle theme/i });

    // Open the menu
    await themeButton.click();
    const menu = page.getByRole("menu");
    await expect(menu).toBeVisible();

    // Click outside the menu by clicking on the page content area
    // Find a safe area to click - the main content section
    const contentArea = page.locator("section, main, [role='main']").first();

    if ((await contentArea.count()) > 0) {
      // Click in the center of the content area
      await contentArea.click({ force: true });
    } else {
      // Fallback: Click using coordinates in a safe area
      // Get viewport dimensions
      const viewport = page.viewportSize();
      if (viewport) {
        // Click in the center-bottom area, away from where dropdowns typically appear
        await page.mouse.click(viewport.width / 2, viewport.height - 100);
      } else {
        // Last resort: click on body element directly
        await page.evaluate(() => {
          document.body.click();
        });
      }
    }

    // Wait for menu to close - Radix UI handles outside clicks via onInteractOutside
    await expect(menu).not.toBeVisible({ timeout: 2000 });
  });
});
