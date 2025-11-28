import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login({ setUser }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function doLogin(e) {
    e.preventDefault();
    if (!name || !password) {
      toast.error("Пожалуйста, заполните все поля для входа");
      return;
    }

    try {
      const res = await API.post("/api/auth/login", { name, password });
      setUser(res.data);
      toast.success("Вход выполнен");
      nav("/");
    } catch (e) {
      toast.error(e.response?.data?.error || "Ошибка авторизации");
    }
  }

  async function doRegister() {
    if (!name || !password) {
      toast.error("Пожалуйста, заполните все поля для регистрации");
      return;
    }

    try {
      await API.post("/api/auth/register", { name, password });
      toast.success("Регистрация выполнена. Теперь войдите.");
      setName("");
      setPassword("");
    } catch (e) {
      toast.error(e.response?.data?.error || "Ошибка регистрации");
    }
  }

  return (
    <div className="max-w-md bg-white p-6 rounded-xl border">
      <h2 className="text-xl font-bold mb-4">Вход / Регистрация</h2>
      <form onSubmit={doLogin} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Имя пользователя"
          className="border px-3 py-2 rounded-md w-full"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="border px-3 py-2 rounded-md w-full"
          required
        />
        <div className="flex gap-3">
          <button type="submit" className="btn-primary">
            Войти
          </button>
          <button type="button" onClick={doRegister} className="btn-outline">
            Зарегистрироваться
          </button>
        </div>
      </form>
    </div>
  );
}
