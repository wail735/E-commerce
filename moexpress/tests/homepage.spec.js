import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage and display main elements', async ({ page }) => {
    // Naviguer vers la page d'accueil
    await page.goto('/');

    // Vérifier que le titre de la page (onglet du navigateur) contient MoExpress (ou le nom de votre app)
    // Note: adaptez ceci si votre titre de page est différent
    await expect(page).toHaveTitle(/MoExpress|Vite/);

    // Vérifier la présence d'une barre de recherche (en assumant qu'elle a le placeholder 'Search...')
    // Note: le placeholder peut être différent selon votre langue par défaut
    const searchInput = page.getByPlaceholder(/Search|Rechercher/i).first();
    await expect(searchInput).toBeVisible();

    // Vérifier qu'il y a un lien pour se connecter ou voir le profil
    const profileIcon = page.locator('a[href="/profile"], a[href="/login"]').first();
    await expect(profileIcon).toBeVisible();
    
    // Vous pouvez ajouter plus de tests spécifiques à votre interface ici
  });
});
