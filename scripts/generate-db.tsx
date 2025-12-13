import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const LOCATIONS = ["Konoha", "Suna", "Kiri", "Iwa", "Kumo"];
const NAMES = [
  "Naruto", "Sasuke", "Sakura", "Kakashi", "Gaara", "Rock Lee", "Hinata", "Shikamaru",
  "Choji", "Neji", "Itachi", "Jiraiya", "Tsunade", "Orochimaru", "Minato", "Kushina",
  "Madara", "Hashirama", "Obito", "Deidara", "Kisame", "Pain", "Konan", "Killer Bee",
  "Might Guy", "Asuma", "Iruka", "Kankuro", "Temari", "Baki"
];
const HEALTH = ["Healthy", "Injured", "Critical"];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomName(i: number) {
  // Pick a name from the list and append an index to encourage uniqueness
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  return `${name} ${i + 1}`;
}

const rows = Array.from({ length: 1200 }).map((_, i) => ({
  id: `id-${i + 1}`,
  name: randomName(i + 1),
  location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
  health: HEALTH[Math.floor(Math.random() * HEALTH.length)],
  power: randInt(100, 10000),
  viewed: false
}));

const out = { characters: rows };

fs.mkdirSync(path.join(__dirname, '..', 'server'), { recursive: true });
fs.writeFileSync(path.join(__dirname, "../server/db.json"), JSON.stringify(out, null, 2), "utf-8");
console.log("db.json generated with", rows.length, "rows");
