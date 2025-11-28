import React, { useState, useEffect } from "react";

export default function Filters({ onChange, products }) {
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");
  const [brands, setBrands] = useState([]);

  const brandList = [...new Set(products.map((p) => p.brand))];

  useEffect(() => {
    onChange({ min, max, brands });
  }, [min, max, brands]);

  return (
    <div className="bg-white p-4 rounded-xl border shadow-card w-64">
      <h3 className="font-bold mb-4">Фильтры</h3>

      {/* Цена */}
      <div className="mb-4">
        <div className="font-semibold mb-2">Цена</div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Мин"
            className="border px-2 py-1 rounded w-full"
            value={min}
            onChange={(e) => setMin(e.target.value)}
          />
          <input
            type="number"
            placeholder="Макс"
            className="border px-2 py-1 rounded w-full"
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
