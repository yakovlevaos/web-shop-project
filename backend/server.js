require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Импорт маршрутов
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();

// Мидлвэры
app.use(
  cors({
    origin: "https://web-shop-project-yyyl.vercel.app"
  })
);
app.use(express.json());

// Роуты
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res
    .status(500)
    .json({ error: "Internal Server Error", message: err.message });
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// Запуск сервера
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend started on http://localhost:${PORT}`);
});
