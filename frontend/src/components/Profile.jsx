import React, { useState, useEffect } from "react";
import API from "../api";
import toast from "react-hot-toast";

export default function Profile({ user, setUser }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user]);

  async function save() {
    if (!user) {
      toast.error("Войдите для обновления профиля");
      return;
    }
    try {
      const res = await API.put(`/api/auth/${user.id}`, { name });
      setUser(res.data);
      toast.success("Профиль обновлен");
    } catch {
      toast.error("Ошибка обновления профиля");
    }
  }

  if (!user)
    return (
      <div className="p-6 bg-white rounded-xl border">Войдите в систему</div>
    );

  return (
    <div className="max-w-md">
      <h2 className="text-xl font-bold mb-4">Профиль</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-3 py-2 rounded-md w-full mb-3"
      />
      <button onClick={save} className="btn-primary">
        Сохранить
      </button>
    </div>
  );
}
