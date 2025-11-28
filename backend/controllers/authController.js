const supabase = require("../supabaseClient");

async function register(req, res) {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Проверка, существует ли уже пользователь с таким именем
    const { data: existingUser, error: selectError } = await supabase
      .from("users")
      .select("*")
      .eq("name", name)
      .single();

    if (selectError && selectError.code !== "PGRST116") throw selectError;
    if (existingUser) return res.status(400).json({ error: "User exists" });

    // Добавляем пользователя с plain password (НЕ БЕЗОПАСНО)
    const { data, error: insertError } = await supabase
      .from("users")
      .insert([{ name, password, role: "user" }])
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json({ id: data.id, name: data.name });
  } catch (e) {
    console.error("Register error:", e);
    res.status(500).json({ error: e.message });
  }
}

async function login(req, res) {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("name", name)
      .eq("password", password)
      .single();

    if (error || !user)
      return res.status(401).json({ error: "Invalid credentials" });

    const { password: _, ...userData } = user;
    res.json(userData);
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: e.message });
  }
}

module.exports = { register, login };
