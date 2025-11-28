import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

export default function Cart({ user }) {
  const [cart, setCart] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    async function fetchCart() {
      if (!user) {
        setCart([]);
        return;
      }
      try {
        const res = await API.get(`/api/cart/${user.id}`);
        setCart(res.data || []);
      } catch {
        toast.error("Ошибка загрузки корзины");
        setCart([]);
      }
    }
    fetchCart();
  }, [user]);

  const total = cart.reduce(
    (sum, item) => (item.product_id?.price ?? 0) * (item.quantity ?? 0) + sum,
    0
  );

  async function updateQuantity(itemId, qty) {
    if (qty < 1) return;
    try {
      await API.put(`/api/cart/${itemId}`, { quantity: qty });
      setCart((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i))
      );
    } catch {
      toast.error("Ошибка обновления");
    }
  }

  async function removeItem(itemId) {
    try {
      await API.delete(`/api/cart/${itemId}`);
      setCart((prev) => prev.filter((i) => i.id !== itemId));
      toast.success("Удалено");
    } catch {
      toast.error("Ошибка удаления");
    }
  }

  async function checkout() {
    if (!user) {
      toast.error("Войдите, чтобы оформить заказ");
      nav("/login");
      return;
    }

    try {
      const validItems = cart
        .filter((i) => i.product_id && i.product_id.id)
        .map((i) => ({
          id: i.product_id.id,
          quantity: i.quantity,
          price: i.product_id.price
        }));

      if (validItems.length === 0) {
        toast.error("Нет товаров для заказа");
        return;
      }

      const address = "Учебный адрес"; // Можно заменить на ввод пользователем

      const res = await API.post("/api/orders", {
        userId: user.id,
        items: validItems,
        address
      });

      setCart([]);
      toast.success(`Заказ оформлен, id: ${res.data.orderId}`);
    } catch {
      toast.error("Ошибка оформления заказа");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Корзина</h1>
      {cart.length === 0 ? (
        <div className="p-6 bg-white rounded-xl border text-dnsMuted">
          Корзина пуста
        </div>
      ) : (
        <div className="grid gap-4">
          {cart.map((item) => {
            const title = item.product_id?.title || "Товар";
            const price = item.product_id?.price || 0;
            const quantity = item.quantity || 0;
            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl border"
              >
                <div>
                  <div className="font-semibold">{title}</div>
                  <div className="text-dnsMuted text-sm">
                    {price} ₽ × {quantity}
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.id, quantity + 1)}
                    className="px-3 py-1"
                  >
                    +
                  </button>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, quantity - 1))
                    }
                    className="px-3 py-1"
                  >
                    −
                  </button>
                  <div className="ml-4 text-right">
                    <div className="font-bold">
                      {(price * quantity).toFixed(2)} ₽
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-sm text-red-500 ml-2"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="p-4 bg-white rounded-xl border flex items-center justify-between">
            <div className="text-lg font-semibold">
              Итого: {total.toFixed(2)} ₽
            </div>
            <button onClick={checkout} className="btn-primary">
              Оформить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
