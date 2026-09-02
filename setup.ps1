$ErrorActionPreference = "Stop"

$PROJECT_NAME = "moexpress"

Write-Host "`n=============================================="
Write-Host "   MoExpress - Frontend Installation (PS)"
Write-Host "==============================================`n"

# 1. Check Node and NPM
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js n'est pas installé."
    exit 1
}

if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ npm n'est pas installé."
    exit 1
}

Write-Host "✅ Node.js : $(node -v)"
Write-Host "✅ npm     : $(npm -v)`n"

# 2. Check if folder exists
if (Test-Path $PROJECT_NAME) {
    Write-Host "⚠️ Le dossier '$PROJECT_NAME' existe déjà."
    $answer = Read-Host "Voulez-vous continuer et utiliser ce dossier ? (y/n)"
    if ($answer -notmatch "^[yY]$") {
        Write-Host "❌ Installation annulée."
        exit 1
    }
} else {
    Write-Host "🚀 Création du projet React avec Vite..."
    # use cmd to avoid powershell parsing issues with npm args
    cmd.exe /c "npm create vite@latest $PROJECT_NAME -- --template react"
}

Set-Location $PROJECT_NAME

Write-Host "`n📁 Projet : $(pwd)`n"

Write-Host "📦 Installation des dépendances..."
cmd.exe /c "npm install"

Write-Host "`n📦 Installation de React Router..."
cmd.exe /c "npm install react-router-dom"

Write-Host "`n📦 Installation de Axios..."
cmd.exe /c "npm install axios"

Write-Host "`n📦 Installation de Lucide React..."
cmd.exe /c "npm install lucide-react"

Write-Host "`n🎨 Installation de Tailwind CSS..."
cmd.exe /c "npm install -D tailwindcss@3 postcss autoprefixer"

Write-Host "`n⚙️ Initialisation de Tailwind CSS..."
cmd.exe /c "npx tailwindcss init -p"

Write-Host "`n🛠️ Configuration de Tailwind CSS..."
$tailwindConfig = @'
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
'@
$tailwindConfig | Out-File -FilePath tailwind.config.js -Encoding utf8 -NoNewline

$postcssConfig = @'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@
$postcssConfig | Out-File -FilePath postcss.config.js -Encoding utf8 -NoNewline

Write-Host "`n🧹 Nettoyage de App.css..."
"" | Out-File -FilePath src/App.css -Encoding utf8 -NoNewline

Write-Host "🧹 Configuration de index.css..."
$indexCss = @'
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
'@
$indexCss | Out-File -FilePath src/index.css -Encoding utf8 -NoNewline

Write-Host "🧹 Nettoyage de App.jsx..."
$appJsx = @'
function App() {
  return null
}

export default App
'@
$appJsx | Out-File -FilePath src/App.jsx -Encoding utf8 -NoNewline

Write-Host "`n🧹 Nettoyage des fichiers Vite inutiles..."
Remove-Item -Path src/assets/react.svg -ErrorAction SilentlyContinue
Remove-Item -Path public/vite.svg -ErrorAction SilentlyContinue

Write-Host "`n📁 Création de la structure MoExpress..."
New-Item -ItemType Directory -Path src/assets/images -Force | Out-Null
New-Item -ItemType Directory -Path src/assets/logos -Force | Out-Null
New-Item -ItemType Directory -Path src/components -Force | Out-Null
New-Item -ItemType Directory -Path src/pages -Force | Out-Null
New-Item -ItemType Directory -Path src/context -Force | Out-Null
New-Item -ItemType Directory -Path src/data -Force | Out-Null
New-Item -ItemType Directory -Path src/layouts -Force | Out-Null
New-Item -ItemType Directory -Path src/routes -Force | Out-Null

$files = @(
    "src/components/Navbar.jsx",
    "src/components/Footer.jsx",
    "src/components/ProductCard.jsx",
    "src/components/CategoryCard.jsx",
    "src/components/SearchBar.jsx",
    "src/components/Rating.jsx",
    "src/components/Button.jsx",
    "src/components/Modal.jsx",
    "src/components/Loader.jsx",
    "src/pages/Home.jsx",
    "src/pages/Products.jsx",
    "src/pages/ProductDetails.jsx",
    "src/pages/Cart.jsx",
    "src/pages/Checkout.jsx",
    "src/pages/Login.jsx",
    "src/pages/Register.jsx",
    "src/pages/Profile.jsx",
    "src/pages/Orders.jsx",
    "src/pages/Wishlist.jsx",
    "src/pages/Categories.jsx",
    "src/pages/FlashDeals.jsx",
    "src/pages/SearchResults.jsx",
    "src/pages/NotFound.jsx",
    "src/pages/SellerDashboard.jsx",
    "src/context/CartContext.jsx",
    "src/context/AuthContext.jsx",
    "src/context/WishlistContext.jsx",
    "src/context/ThemeContext.jsx",
    "src/data/products.js",
    "src/data/categories.js",
    "src/data/users.js",
    "src/layouts/MainLayout.jsx",
    "src/routes/AppRoutes.jsx"
)

foreach ($f in $files) {
    New-Item -ItemType File -Path $f -Force | Out-Null
}

Write-Host "`n=============================================="
Write-Host "       Installation terminée avec succès"
Write-Host "==============================================`n"

Write-Host "📦 Dépendances installées :`n"
cmd.exe /c "npm list react react-dom react-router-dom axios lucide-react tailwindcss --depth=0"

Write-Host "`n📁 Structure créée :`n"
Get-ChildItem -Path src -Recurse -Depth 1 | Select-Object FullName

Write-Host "`n=============================================="
Write-Host "           MoExpress est prêt 🚀"
Write-Host "==============================================`n"

Write-Host "Pour démarrer le projet :`n"
Write-Host "    cd $PROJECT_NAME"
Write-Host "    npm run dev`n"
Write-Host "Puis ouvre l'adresse affichée par Vite.`n"
