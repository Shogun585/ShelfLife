import test, { expect } from "@playwright/test";

test('user can register', async({page}) => {
    await page.goto("http://localhost:5173")

    await page.getByRole('button', {
        name : /Enter the neighborhood/i
    }).click()
});