import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

export default function ProductCard({ user }) {
  const { id } = useParams();
  const [p, setP] = useState(null);

  useEffect(() => {
    API.get(`/api/products/${id}`)
      .then((r) => setP(r.data))
      .catch(() => toast.error("Товар не найден"));
  }, [id]);

  if (!p) return <div>Загрузка...</div>;

  async function addToCart() {
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
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl border shadow-card">
        <div className="h-64 bg-gray-50 rounded-md flex items-center justify-center">
          Изображение
        </div>
      </div>
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold">{p.title}</h2>
        <p className="text-dnsMuted mt-3">{p.description}</p>
        <div className="mt-6 flex items-center gap-6">
          <div className="text-3xl font-extrabold">{p.price} ₽</div>
          <button
            onClick={addToCart}
            className="btn-primary text-lg bg-yellow-400 text-black rounded-md px-4 py-2 transition-all duration-300 hover:bg-yellow-600 hover:font-bold hover:text-white shadow-md hover:shadow-lg"
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
}
