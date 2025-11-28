import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductCard from "./components/ProductCard";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const activeClassName = "font-bold text-base text-black";
  const inactiveClassName = "hover:text-black text-sm text-gray-500";

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between py-4">
          <div className="flex items-center gap-6">
            <NavLink to="/" className="text-black text-2xl font-extrabold">
              Tech<span className="text-yellow-500">Store</span>
            </NavLink>

            <nav className="hidden md:flex gap-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? activeClassName : inactiveClassName
                }
              >
                Каталог
              </NavLink>
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  isActive ? activeClassName : inactiveClassName
                }
              >
                Корзина
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  className="text-sm font-medium text-black"
                >
                  {user.name}
                </NavLink>
                <button
                  onClick={() => setUser(null)}
                  className="btn-outline text-sm"
                >
                  Выйти
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className="btn-primary text-sm text-black hover:text-yellow-500"
              >
                Войти
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<ProductList user={user} />} />
          <Route path="/product/:id" element={<ProductCard user={user} />} />
          <Route path="/cart" element={<Cart user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route
            path="/profile"
            element={<Profile user={user} setUser={setUser} />}
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
