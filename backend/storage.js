const fs = require("fs").promises;
const path = require("path");

const dataDir = path.join(__dirname, "data");

async function readJSON(name) {
  const p = path.join(dataDir, name);
  try {
    const txt = await fs.readFile(p, "utf8");
    return JSON.parse(txt || "[]");
  } catch (e) {
    if (e.code === "ENOENT") {
      await fs.writeFile(p, "[]", "utf8");
      return [];
    }
    throw e;
  }
}

async function writeJSON(name, data) {
  const p = path.join(dataDir, name);
  await fs.writeFile(p, JSON.stringify(data, null, 2), "utf8");
}

module.exports = { readJSON, writeJSON };
