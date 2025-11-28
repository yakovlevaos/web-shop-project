const supabase = require("../supabaseClient");

async function createOrder(req, res) {
  try {
    const { userId, items, address } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order data" });
    }

    // Фильтруем валидные элементы заказа
    const validItems = items.filter((i) => i && i.id && i.quantity && i.price);
    if (validItems.length === 0) {
      return res.status(400).json({ error: "Order items are invalid" });
    }

    // Подсчитываем общую стоимость
    const totalPrice = validItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    // Создаём заказ
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          total_price: totalPrice,
          status: "created",
          created_at: new Date().toISOString(),
          address: address || ""
        }
      ])
      .select()
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return res.status(500).json({ error: "Failed to create order" });
    }

    // Формируем позиции заказа для вставки
    const orderItems = validItems.map((i) => ({
      order_id: order.id, // соответствует типу bigint, FK к orders.id
      product_id: i.id, // bigint, FK к products.id
      quantity: i.quantity // integer
      // цена хранится в orders.total_price, для простоты в таблице нет поля price
    }));

    // Вставляем order_items
    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Error inserting order items:", itemsError);
      return res.status(500).json({ error: "Failed to create order items" });
    }

    return res.status(201).json({ orderId: order.id });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { createOrder };
