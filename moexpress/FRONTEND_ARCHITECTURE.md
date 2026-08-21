# Architecture Frontend - MoExpress

Ce document décrit l'architecture complète du frontend de l'application e-commerce **MoExpress**.

## 1. Stack Technologique

Le projet est basé sur des technologies modernes pour garantir des performances optimales et une bonne expérience de développement :

- **Framework Core** : [React](https://react.dev/) (v19)
- **Outil de Build / Bundler** : [Vite](https://vitejs.dev/) (v8)
- **Routage** : [React Router DOM](https://reactrouter.com/) (v7)
- **Style & UI** : [Tailwind CSS](https://tailwindcss.com/) (v3)
- **Icônes** : [Lucide React](https://lucide.dev/) & React Icons
- **Animations** : [GSAP](https://gsap.com/)
- **Requêtes HTTP** : Axios

## 2. Structure des Dossiers (`src/`)

L'architecture suit une approche modulaire standard pour React, séparant clairement les responsabilités :

```text
src/
├── assets/
│   ├── fonts/
│   │   ├── Bricolage_Grotesque/
│   │   │   ├── BricolageGrotesque-VariableFont_opsz,wdth,wght.ttf
│   │   │   ├── OFL.txt
│   │   │   ├── README.txt
│   │   │   └── static/
│   │   │       └── BricolageGrotesque-Bold.ttf
│   │   └── DM_Sans/
│   │       ├── DMSans-Italic-VariableFont_opsz,wght.ttf
│   │       ├── DMSans-VariableFont_opsz,wght.ttf
│   │       ├── OFL.txt
│   │       ├── README.txt
│   │       └── static/
│   │           ├── DMSans-Bold.ttf
│   │           ├── DMSans-Light.ttf
│   │           ├── DMSans-Medium.ttf
│   │           ├── DMSans-SemiBold.ttf
│   │           └── DMSans-SemiBoldItalic.ttf
│   ├── images/
│   │   ├── hero1.jpeg
│   │   ├── hero2.jpeg
│   │   └── hero3.jpeg
│   └── logos/
│       ├── logo.png
│       └── logof.png
├── components/
│   ├── CategoryBar.jsx
│   ├── Footer.jsx
│   ├── HeroBanner.jsx
│   ├── Loader.jsx
│   ├── Modal.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── Rating.jsx
│   └── SearchBar.jsx
├── context/
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   ├── LanguageContext.jsx
│   ├── ThemeContext.jsx
│   └── WishlistContext.jsx
├── data/
│   ├── categories.js
│   ├── products.js
│   ├── translations.js
│   └── users.js
├── layouts/
│   └── MainLayout.jsx
├── pages/
│   ├── Cart.jsx
│   ├── CategoryPage.jsx
│   ├── Checkout.jsx
│   ├── FlashDeals.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── NotFound.jsx
│   ├── Orders.jsx
│   ├── ProductDetails.jsx
│   ├── Products.jsx
│   ├── Profile.jsx
│   ├── Register.jsx
│   ├── SearchResults.jsx
│   ├── SellerDashboard.jsx
│   └── Wishlist.jsx
├── routes/
│   └── AppRoutes.jsx
├── App.css
├── App.jsx
├── index.css
└── main.jsx
```

## 3. Gestion de l'État (State Management)

L'état global de l'application est géré de manière native en utilisant l'**API Context** de React. Cela permet d'éviter l'utilisation de bibliothèques externes lourdes (comme Redux) tout en gardant une architecture propre.

Les contextes disponibles dans `src/context/` :
- **`AuthContext`** : Gestion de l'authentification de l'utilisateur (connexion, déconnexion, session).
- **`CartContext`** : Gestion du panier d'achat (ajout, suppression, modification des quantités, calcul du total).
- **`WishlistContext`** : Gestion de la liste de souhaits (favoris) des utilisateurs.
- **`ThemeContext`** : Gestion du thème (Mode Sombre / Mode Clair).
- **`LanguageContext`** : Gestion de l'internationalisation (i18n) pour le support multilingue (Anglais, Français, Arabe).

## 4. Routage (Routing)

Le routage est géré par **React Router DOM**. La configuration principale se trouve dans `src/routes/AppRoutes.jsx` et enveloppée par un Layout global (`MainLayout.jsx`).

Exemples de pages (`src/pages/`) :
- `Home.jsx` : Page d'accueil.
- `Products.jsx` & `CategoryPage.jsx` : Listes de produits filtrées.
- `ProductDetails.jsx` : Page de description détaillée d'un produit.
- `Cart.jsx` & `Checkout.jsx` : Processus d'achat.
- `Login.jsx` & `Register.jsx` : Pages d'authentification.
- `Profile.jsx` & `Orders.jsx` : Espace utilisateur.

## 5. Composants UI (Components)

Les composants de l'interface utilisateur (`src/components/`) sont conçus pour être réutilisables et isolés. Ils utilisent abondamment Tailwind CSS pour le style.

Composants clés :
- `Navbar.jsx` : Barre de navigation principale (inclut la recherche, le sélecteur de langue/thème et les liens).
- `ProductCard.jsx` : Carte affichant un produit (image, prix, note, bouton d'ajout au panier).
- `HeroBanner.jsx` : Bannière promotionnelle pour la page d'accueil.
- `Footer.jsx` : Pied de page de l'application.
- `CategoryBar.jsx` : Barre de navigation secondaire pour les catégories.

## 6. Données et Internationalisation (Data)

En l'absence d'un backend complet pour l'instant, l'application utilise des données simulées (mock) situées dans `src/data/` :
- `products.js` : Catalogue complet des produits.
- `categories.js` : Liste des catégories disponibles.
- `translations.js` : Dictionnaire de traductions contenant toutes les chaînes de texte pour l'anglais (`en`), le français (`fr`) et l'arabe (`ar`). Ces données sont exploitées par le `LanguageContext`.

## 7. Style et Thème

- **Tailwind CSS** : Utilisé de manière utilitaire directement dans les attributs `className` des composants React.
- **Dark Mode** : Tailwind est configuré pour supporter le mode sombre (via la classe `dark` sur la balise `<html>` ou `<body>`). Le basculement est géré par `ThemeContext`.
- **Typographie** : Les polices personnalisées (Bricolage Grotesque, DM Sans) sont stockées dans `src/assets/fonts/` et chargées globalement.
