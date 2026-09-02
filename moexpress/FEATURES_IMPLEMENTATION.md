# Documentation des Fonctionnalités - MoExpress

Ce document explique en détail les fonctionnalités clés de l'application et la manière dont elles sont implémentées techniquement côté client (React).

---

## 1. Internationalisation (Support Multilingue)
- **Description** : L'application supporte plusieurs langues (Anglais, Français, Arabe). L'interface s'adapte dynamiquement sans rechargement de la page.
- **Implémentation** : 
  - **`LanguageContext.jsx`** : Fournit l'état de la langue actuelle (`'en'`, `'fr'`, `'ar'`) et l'enregistre dans le `localStorage` du navigateur pour la persistance.
  - **`translations.js`** : Fichier de données contenant de gros objets JSON (dictionnaires) avec les clés de traduction pour chaque langue.
  - **Fonction `t(key)`** : Un "helper" exposé par le contexte, qui prend une clé en paramètre (ex: `t('add_to_cart')`) et retourne la chaîne correspondante. Les composants s'abonnent à cette fonction via le hook `useLanguage()`.

## 2. Gestion du Thème (Dark / Light Mode)
- **Description** : L'utilisateur peut basculer l'interface en mode sombre ou clair.
- **Implémentation** :
  - **`ThemeContext.jsx`** : Stocke la préférence (`'light'` ou `'dark'`) dans le `localStorage`.
  - **Injection CSS** : Lors du changement, le contexte ajoute ou supprime dynamiquement la classe CSS `dark` sur la balise racine `<html>` (ou `<body>`).
  - **Tailwind CSS** : Le framework Tailwind est configuré avec l'option `darkMode: 'class'`. Ainsi, les composants utilisent des classes comme `bg-white dark:bg-gray-900` pour adapter leurs couleurs automatiquement.

## 3. Panier d'Achat (Cart)
- **Description** : Les utilisateurs peuvent ajouter des produits, modifier les quantités, supprimer des articles et voir le total de la commande calculé en temps réel.
- **Implémentation** :
  - **`CartContext.jsx`** : Gère un tableau d'objets `cartItems` via `useState`.
  - **Fonctions Actions** : Fournit des fonctions `addToCart`, `removeFromCart`, `updateQuantity`, et `clearCart`.
  - **Persistance** : À chaque modification, le tableau est stringifié (JSON) et sauvegardé dans le `localStorage` pour éviter la perte des articles lors de la fermeture de l'onglet.
  - **Dérivés** : Les valeurs `cartTotal` (prix) et `cartCount` (nombre d'articles) sont calculées à la volée.

## 4. Liste de Souhaits (Wishlist / Favoris)
- **Description** : Permet de sauvegarder des produits pour un achat futur en cliquant sur une icône de cœur.
- **Implémentation** :
  - **`WishlistContext.jsx`** : Fonctionne de manière similaire au panier. Il maintient une liste d'articles favoris.
  - **Fonction `toggleWishlist`** : Ajoute l'article s'il n'y est pas, ou le retire s'il est déjà présent.
  - **Indicateurs UI** : Le hook `isInWishlist(productId)` permet aux composants (comme `ProductCard.jsx`) de savoir s'il faut colorer le cœur en rouge.

## 5. Moteur de Recherche et Filtrage
- **Description** : Recherche de produits par texte (barre de recherche), filtre par catégories et par fourchette de prix, et tri (prix croissant/décroissant).
- **Implémentation** :
  - **Recherche textuelle** : Le champ de recherche de la `Navbar` capture le texte et redirige vers la route `/search?q=mot_cle`. La page `SearchResults.jsx` lit ce paramètre d'URL (via `useSearchParams`) et filtre le catalogue global (issu de `src/data/products.js`) avec une méthode `.filter(product => product.name.includes(q))`.
  - **Filtres (Page Produits)** : La page `Products.jsx` possède des états locaux pour la catégorie active, le prix minimum, et le prix maximum. À chaque changement, un tableau dérivé (filtré) est passé à la boucle de rendu pour afficher uniquement les cartes correspondantes.

## 6. Simulation d'Authentification (Auth)
- **Description** : Processus d'inscription, de connexion et gestion du profil utilisateur (côté client).
- **Implémentation** :
  - **`AuthContext.jsx`** : Gère un état `user` (null si déconnecté, ou un objet avec `name`, `email` si connecté). 
  - Actuellement simulé, le processus valide simplement les données en local sans appeler d'API backend (serveur). L'UI gère les changements (affichage du nom de l'utilisateur dans la Navbar, restriction de l'accès à certaines pages).
