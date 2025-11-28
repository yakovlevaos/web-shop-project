require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const products = require("./data/products.json");
const categories = require("./data/categories.json");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadProducts() {
  const { data, error } = await supabase.from("products").insert(products);
  if (error) {
    console.error("Ошибка при вставке данных:", error);
  } else {
    console.log("Данные успешно загружены:", data);
  }
}

async function uploadCategories() {
  const { data, error } = await supabase.from("categories").insert(categories);
  if (error) {
    console.error("Ошибка при вставке данных:", error);
  } else {
    console.log("Данные успешно загружены:", data);
  }
}

uploadProducts();
// uploadCategories();
