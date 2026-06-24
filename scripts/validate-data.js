import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { validatePlayer, validateSquad } from '../src/data/validation.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../src/data');

let exitCode = 0;

function fail(msg) {
  console.error(`  ERROR: ${msg}`);
  exitCode = 1;
}

// --- Load clubs ---
const clubsPath = join(dataDir, 'clubs.json');
const clubs = JSON.parse(readFileSync(clubsPath, 'utf-8'));
const clubNames = clubs.map(c => c.name);
console.log(`Loaded ${clubs.length} clubs from clubs.json`);

// --- Load players (optional until roster work begins) ---
const playersPath = join(dataDir, 'players.json');

if (!existsSync(playersPath)) {
  console.log('players.json not found — skipping player and squad validation.');
  console.log('Run this script again once player data is added.');
  process.exit(0);
}

const players = JSON.parse(readFileSync(playersPath, 'utf-8'));
console.log(`Loaded ${players.length} players from players.json\n`);

// --- Validate individual players ---
console.log('Checking player records...');
let playerErrors = 0;
for (const [i, player] of players.entries()) {
  const { valid, errors } = validatePlayer(player);
  if (!valid) {
    const label = player.name ?? `player at index ${i}`;
    errors.forEach(e => fail(`[${label}] ${e}`));
    playerErrors++;
  }
}
if (playerErrors === 0) {
  console.log(`  All ${players.length} player records are valid.\n`);
} else {
  console.log(`  ${playerErrors} player record(s) failed validation.\n`);
}

// --- Validate squad completeness per club ---
console.log('Checking squad completeness...');
const { valid: squadValid, errors: squadErrors } = validateSquad(players, clubNames);
if (squadValid) {
  console.log('  All clubs have the required positions covered.\n');
} else {
  squadErrors.forEach(e => fail(e));
  console.log('');
}

// --- Result ---
if (exitCode === 0) {
  console.log('Validation passed.');
} else {
  console.error('Validation failed — see errors above.');
}

process.exit(exitCode);
