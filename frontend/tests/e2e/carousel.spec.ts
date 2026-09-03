import { test, expect } from'@playwright/test';

test.describe('Socially Approved Carousel E2E Flow', () => {
  test('Complete user interaction flow: Browse, open modal, like, share, and close', async ({ page }) => {
    // 1. Load the page
    await page.goto('/');

    // 2. Confirm the outer carousel and header are visible
    await expect(page.getByRole('heading', { name: /Our Bestsellers/i })).toBeVisible();
    const videoCards = page.getByRole('button', { name: /watch video/i });
    await expect(videoCards.first()).toBeVisible();

    // 3. Open a video modal
    await videoCards.first().click();

    // 4. Confirm the modal appears
    const modal = page.getByRole('dialog', { name: /video player carousel modal/i });
    await expect(modal).toBeVisible();

    // 5. Interact with play/pause or mute control
    const muteButton = page.getByRole('button', { name: /(unmute|mute) audio/i }).first();
    await expect(muteButton).toBeVisible();
    await muteButton.click();

    // 6. Like the video
    const likeButton = page.getByRole('button', { name: /(like|unlike) video/i }).first();
    await expect(likeButton).toBeVisible();
    await likeButton.click();

    // 7. Copy/share the video link
    const shareButton = page.getByRole('button', { name: /share video/i }).first();
    await expect(shareButton).toBeVisible();
    await shareButton.click();

    const shareModal = page.getByRole('dialog', { name: /share video/i });
    await expect(shareModal).toBeVisible();
    await page.getByRole('button', { name: /close share menu/i }).click();

    // 8. Close the modal with Escape key
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });
});
