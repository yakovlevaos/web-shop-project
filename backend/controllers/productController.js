const supabase = require("../supabaseClient");

async function list(req, res) {
  try {
    const q = (req.query.q || "").toLowerCase();
    const category = req.query.category;

    let query = supabase.from("products").select("*");

    if (q) {
      query = query.ilike("title", `%${q}%`);
    }
    if (category) {
      query = query.eq("category_id", category);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getById(req, res) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) {
      if (error.code === "PGRST116")
        return res.status(404).json({ error: "Not found" });
      throw error;
    }
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    const { title, price, brand, image, category_id } = req.body;
    if (!title || price == null)
      return res.status(400).json({ error: "Missing fields" });

    const newProduct = {
      title,
      price: Number(price),
      brand: brand || "",
      image: image || "",
      category_id: category_id || null
    };

    const { data, error } = await supabase
      .from("products")
      .insert([newProduct])
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchError) {
      if (fetchError.code === "PGRST116")
        return res.status(404).json({ error: "Not found" });
      throw fetchError;
    }

    const updates = req.body;

    const { data, error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = { list, getById, create, update, remove };
