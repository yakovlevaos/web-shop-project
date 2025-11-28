import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";
import Filters from "./Filters";

export default function ProductList({ user }) {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [q, setQ] = useState("");
  const [params] = useSearchParams();
  const category = params.get("category") || null;
  const [sort, setSort] = useState("popular");
  const [filterParams, setFilterParams] = useState({});

  async function load() {
    try {
      const paramsObj = { q, category };
      const res = await API.get("/api/products", { params: paramsObj });
      setItems(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Ошибка загрузки каталога");
    }
  }

  useEffect(() => {
    load();
  }, [q, category]);

  useEffect(() => {
    let r = [...items];

    if (filterParams.min)
      r = r.filter((i) => i.price >= Number(filterParams.min));
    if (filterParams.max)
      r = r.filter((i) => i.price <= Number(filterParams.max));
    if (filterParams.brands && filterParams.brands.length > 0)
      r = r.filter((i) => filterParams.brands.includes(i.brand));

    if (sort === "priceAsc") r.sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") r.sort((a, b) => b.price - a.price);
    if (sort === "name") r.sort((a, b) => a.title.localeCompare(b.title));

    setFiltered(r);
  }, [filterParams, sort, items]);

  async function addToCart(p) {
    if (!user) {
      toast.error("Войдите, чтобы добавить в корзину");
      return;
    }
    try {
      await API.post("/api/cart", {
        user_id: user.id,
        product_id: p.id,
        quantity: 1
      });
      toast.success("Добавлено в корзину");
    } catch {
      toast.error("Ошибка при добавлении в корзину");
    }
  }

  return (
    <div className="flex gap-6">
      <Filters onChange={setFilterParams} products={items} />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {category ? `Категория: ${category}` : "Каталог"}
          </h1>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск товара..."
            className="border px-3 py-2 rounded-md w-64"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="priceAsc">По цене ↑</option>
            <option value="priceDesc">По цене ↓</option>
            <option value="name">По названию</option>
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl p-4 shadow-card border hover:shadow-xl transition"
            >
              <div className="h-40 flex items-center justify-center bg-gray-50 rounded-md mb-4 overflow-hidden">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`text-sm text-dnsMuted ${
                    p.image ? "hidden" : "flex"
                  }`}
                >
                  Изображение отсутствует
                </div>
              </div>
              <Link
                to={`/product/${p.id}`}
                className="text-lg font-semibold text-dnsBlack hover:text-dnsYellow"
              >
                {p.title}
              </Link>
              <p className="text-sm text-dnsMuted mt-2 line-clamp-2">
                {p.description}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xl font-bold">{p.price} ₽</div>
                <button
                  onClick={() => addToCart(p)}
                  className="btn-primary text-sm hover:cursor-pointer bg-yellow-600 hover:font-bold hover:text-white shadow-md hover:shadow-lg"
                >
                  В корзину
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
