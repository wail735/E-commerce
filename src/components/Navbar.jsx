import { useState, useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Link } from "react-router-dom";
import SearchContext from "../context/SearchContext";
import CardContext from "../context/CartContext";
function Navbar() {
  const links = [
    { id: 1, categorie: "Home", path: "/" },
    { id: 2, categorie: "Top Rated", path: "/category/top-rated" },
    { id: 3, categorie: "Kids Wear", path: "/category/kids-wear" },
    { id: 4, categorie: "Mens Wear", path: "/category/mens-wear" },
    { id: 5, categorie: "Electronics", path: "/category/electronics" },
  ];

  const [isOpen, setOpen] = useState(false);
  const { toggleTheme, theme } = useContext(ThemeContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const { cardItem } = useContext(CardContext);
  
  const totalItems = cardItem ? cardItem.reduce((total, item) => total + item.qty, 0) : 0;

  function handleOpen() {
    setOpen(!isOpen);
  }

  return (
    <nav className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 sticky top-0 z-50">
      {/* upper Navbar */}
      <div className="bg-orange-200 dark:bg-gray-900 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <Link
              to="/"
              className="font-bold text-2xl sm:text-3xl flex gap-2 items-center"
            >
              <img src="/assets/logo.png" alt="Logo" className="w-10" />
              Shopsy
            </Link>
          </div>

          {/* search bar */}
          <div className="flex justify-between items-center gap-4">
            <div className="relative group hidden sm:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                placeholder="search"
                className="w-50 sm:w-50 group-hover:w-75 transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border focus:border-orange-400 dark:border-gray-500 dark:bg-gray-800"
              />
              <i className="fa-solid fa-magnifying-glass text-gray-500 group-hover:text-orange-400 absolute top-1/2 -translate-y-1/2 right-3"></i>
            </div>

            {/* order button */}
            <Link
              to="/cart"
              className="bg-linear-to-r from-orange-400 to-orange-500 transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group relative"
            >
              <span className="group-hover:block hidden transition-all duration-200">
                Cart
              </span>
              <div className="relative flex items-center">
                <i className="fa-solid fa-cart-shopping text-xl text-white drop-shadow-sm cursor-pointer"></i>
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>

            {/* Darkmode Switch */}
            <button
              onClick={toggleTheme}
              className="relative w-14 h-7 rounded-full cursor-pointer transition-all duration-300 flex items-center bg-gray-300 dark:bg-orange-400 px-1"
            >
              <span
                className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center transition-all duration-300 ${theme === "dark" ? "translate-x-7" : "translate-x-0"}`}
              >
                {theme === "dark" ? (
                  <i className="fa-solid fa-moon text-orange-400 text-xs"></i>
                ) : (
                  <i className="fa-solid fa-sun text-yellow-400 text-xs"></i>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* lower Navbar */}
      <div className="flex justify-center shadow-sm dark:bg-gray-800">
        <ul className="sm:flex hidden items-center gap-4">
          {links.map((data) => (
            <li key={data.id}>
              <Link
                to={data.path}
                className="inline-block px-4 py-2 hover:text-orange-400 duration-200"
              >
                {data.categorie}
              </Link>
            </li>
          ))}
          {/* Simple Dropdown and Links */}
          <li className="group relative cursor-pointer">
            <Link to="/products" className="flex items-center gap-0.5 py-2">
              Trending Products
              <span>
                <i className="fa-solid fa-caret-down transition-all duration-200 group-hover:rotate-180"></i>
              </span>
            </Link>
            <div className="absolute z-9999 hidden group-hover:block w-37.5 rounded-md bg-white dark:bg-gray-800 p-2 text-black dark:text-white shadow-md">
              <ul>
                <li>
                  <Link
                    to="/category/trending"
                    className="inline-block w-full rounded-md p-2 hover:bg-orange-200/50 dark:hover:bg-gray-700"
                  >
                    Trending Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/best-selling"
                    className="inline-block w-full rounded-md p-2 hover:bg-orange-200/50 dark:hover:bg-gray-700"
                  >
                    Best Selling
                  </Link>
                </li>
                <li>
                  <Link
                    to="/category/top-rated"
                    className="inline-block w-full rounded-md p-2 hover:bg-orange-200/50 dark:hover:bg-gray-700"
                  >
                    Top Rated
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>

        {/* Mobile menu button */}
        <button
          onClick={handleOpen}
          className="sm:hidden block p-4 ml-auto text-2xl"
        >
          <i className={isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden absolute w-full bg-white dark:bg-gray-800 transition-all duration-300 ${
          isOpen
            ? "max-h-96 border-t dark:border-gray-700"
            : "max-h-0 overflow-hidden"
        }`}
      >
        <ul className="flex flex-col items-center py-4 gap-4">
          {links.map((data) => (
            <li key={data.id}>
              <Link
                to={data.path}
                className="inline-block hover:text-orange-400 duration-200"
                onClick={() => setOpen(false)}
              >
                {data.categorie}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
