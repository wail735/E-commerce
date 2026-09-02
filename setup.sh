#!/bin/bash

# ============================================================
# MoExpress Marketplace - Frontend Setup
# React + Vite + Tailwind CSS + React Router + Axios + Lucide
# ============================================================

set -e

PROJECT_NAME="moexpress"

echo ""
echo "=============================================="
echo "   MoExpress - Frontend Installation"
echo "=============================================="
echo ""

# ------------------------------------------------------------
# 1. Vérifier Node.js et npm
# ------------------------------------------------------------

if ! command -v node &> /dev/null
then
    echo "❌ Node.js n'est pas installé."
    echo "👉 Installe Node.js puis relance ce script."
    exit 1
fi

if ! command -v npm &> /dev/null
then
    echo "❌ npm n'est pas installé."
    exit 1
fi

echo "✅ Node.js : $(node -v)"
echo "✅ npm     : $(npm -v)"
echo ""

# ------------------------------------------------------------
# 2. Vérifier si le dossier existe déjà
# ------------------------------------------------------------

if [ -d "$PROJECT_NAME" ]; then
    echo "⚠️ Le dossier '$PROJECT_NAME' existe déjà."
    read -p "Voulez-vous continuer et utiliser ce dossier ? (y/n): " answer

    if [[ "$answer" != "y" && "$answer" != "Y" ]]; then
        echo "❌ Installation annulée."
        exit 1
    fi
else

    # --------------------------------------------------------
    # 3. Création du projet React avec Vite
    # --------------------------------------------------------

    echo "🚀 Création du projet React avec Vite..."

    npm create vite@latest "$PROJECT_NAME" -- --template react

fi

cd "$PROJECT_NAME"

echo ""
echo "📁 Projet : $(pwd)"
echo ""

# ------------------------------------------------------------
# 4. Installation des dépendances
# ------------------------------------------------------------

echo "📦 Installation des dépendances..."

npm install

echo ""
echo "📦 Installation de React Router..."
npm install react-router-dom

echo ""
echo "📦 Installation de Axios..."
npm install axios

echo ""
echo "📦 Installation de Lucide React..."
npm install lucide-react

# ------------------------------------------------------------
# 5. Installation de Tailwind CSS
# ------------------------------------------------------------

echo ""
echo "🎨 Installation de Tailwind CSS..."

npm install -D tailwindcss@3 postcss autoprefixer

echo ""
echo "⚙️ Initialisation de Tailwind CSS..."

npx tailwindcss init -p

# ------------------------------------------------------------
# 6. Configuration Tailwind
# ------------------------------------------------------------

echo ""
echo "🛠️ Configuration de Tailwind CSS..."

cat > tailwind.config.js <<'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF4D20",
        orange: "#FF8A00",
        yellow: "#FFC107",
        dark: "#0B1120",
        gray: "#6B7280",
        light: "#F5F5F5",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },

      boxShadow: {
        card: "0 4px 20px rgba(0, 0, 0, 0.08)",
        orange: "0 8px 25px rgba(255, 77, 32, 0.25)",
      },

      transitionDuration: {
        250: "250ms",
        350: "350ms",
      },
    },
  },
  plugins: [],
}
EOF

# ------------------------------------------------------------
# 7. Configuration PostCSS
# ------------------------------------------------------------

cat > postcss.config.js <<'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# ------------------------------------------------------------
# 8. Vider App.css
# ------------------------------------------------------------

echo ""
echo "🧹 Nettoyage de App.css..."

cat > src/App.css <<'EOF'
EOF

# ------------------------------------------------------------
# 9. Vider index.css puis configurer Tailwind
# ------------------------------------------------------------

echo "🧹 Configuration de index.css..."

cat > src/index.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;

  color: #111827;
  background: #ffffff;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  min-width: 320px;
  min-height: 100vh;
  background: #ffffff;
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}
EOF

# ------------------------------------------------------------
# 10. Vider App.jsx
# ------------------------------------------------------------

echo "🧹 Nettoyage de App.jsx..."

cat > src/App.jsx <<'EOF'
function App() {
  return null
}

export default App
EOF

# ------------------------------------------------------------
# 11. Nettoyage des fichiers inutiles générés par Vite
# ------------------------------------------------------------

echo ""
echo "🧹 Nettoyage des fichiers Vite inutiles..."

rm -f src/assets/react.svg
rm -f public/vite.svg

# ------------------------------------------------------------
# 12. Création de la structure du projet
# ------------------------------------------------------------

echo ""
echo "📁 Création de la structure MoExpress..."

mkdir -p src/assets/images
mkdir -p src/assets/logos

mkdir -p src/components
mkdir -p src/pages
mkdir -p src/context
mkdir -p src/data
mkdir -p src/layouts
mkdir -p src/routes

# ------------------------------------------------------------
# 13. Création des fichiers principaux
# ------------------------------------------------------------

touch src/components/Navbar.jsx
touch src/components/Footer.jsx
touch src/components/ProductCard.jsx
touch src/components/CategoryCard.jsx
touch src/components/SearchBar.jsx
touch src/components/Rating.jsx
touch src/components/Button.jsx
touch src/components/Modal.jsx
touch src/components/Loader.jsx

touch src/pages/Home.jsx
touch src/pages/Products.jsx
touch src/pages/ProductDetails.jsx
touch src/pages/Cart.jsx
touch src/pages/Checkout.jsx
touch src/pages/Login.jsx
touch src/pages/Register.jsx
touch src/pages/Profile.jsx
touch src/pages/Orders.jsx
touch src/pages/Wishlist.jsx
touch src/pages/Categories.jsx
touch src/pages/FlashDeals.jsx
touch src/pages/SearchResults.jsx
touch src/pages/NotFound.jsx
touch src/pages/SellerDashboard.jsx

touch src/context/CartContext.jsx
touch src/context/AuthContext.jsx
touch src/context/WishlistContext.jsx
touch src/context/ThemeContext.jsx

touch src/data/products.js
touch src/data/categories.js
touch src/data/users.js

touch src/layouts/MainLayout.jsx

touch src/routes/AppRoutes.jsx

# ------------------------------------------------------------
# 14. Afficher les versions installées
# ------------------------------------------------------------

echo ""
echo "=============================================="
echo "       Installation terminée avec succès"
echo "=============================================="
echo ""

echo "📦 Dépendances installées :"
echo ""
npm list react react-dom react-router-dom axios lucide-react tailwindcss --depth=0

echo ""
echo "📁 Structure créée :"
echo ""

find src -maxdepth 2 -type f | sort

echo ""
echo "=============================================="
echo "           MoExpress est prêt 🚀"
echo "=============================================="
echo ""

echo "Pour démarrer le projet :"
echo ""
echo "    cd $PROJECT_NAME"
echo "    npm run dev"
echo ""

echo "Puis ouvre l'adresse affichée par Vite."
echo ""