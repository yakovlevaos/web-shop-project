const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");

// Получить корзину пользователя
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from("cart")
      .select("id, quantity, product_id(*, title, price)")
      .eq("user_id", userId);
    if (error) throw error;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Добавить или обновить элемент корзины
router.post("/", async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    if (!user_id || !product_id || !quantity)
      return res.status(400).json({ error: "Missing data" });

    const { data: existing } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", user_id)
      .eq("product_id", product_id)
      .single();

    if (existing) {
      const { data, error } = await supabase
        .from("cart")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id)
        .single();
      if (error) throw error;
      res.json(data);
    } else {
      const { data, error } = await supabase
        .from("cart")
        .insert([{ user_id, product_id, quantity }])
        .single();
      if (error) throw error;
      res.json(data);
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Обновить количество
router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (!quantity) return res.status(400).json({ error: "Missing quantity" });

    const { data, error } = await supabase
      .from("cart")
      .update({ quantity })
      .eq("id", req.params.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Удалить элемент
router.delete("/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("cart")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
