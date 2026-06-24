/**
 * Positions that every club squad must include.
 * Lock requires two players; everything else requires one.
 * @type {string[]}
 */
export const REQUIRED_POSITIONS = [
  'Loosehead Prop',
  'Hooker',
  'Tighthead Prop',
  'Lock',
  'Blindside Flanker',
  'Openside Flanker',
  'Number 8',
  'Scrum-half',
  'Fly-half',
  'Left Wing',
  'Inside Centre',
  'Outside Centre',
  'Right Wing',
  'Fullback',
];

/** Positions that need more than one player per squad. */
const MINIMUM_COUNTS = { Lock: 2 };

/**
 * Validates that a player has all required fields.
 * Optional fields (attack, defence, setPiece, intlCaps, tryRate, goalKicker)
 * are not checked here — use applyDefaults to resolve them.
 *
 * @param {import('./schema.js').Player} player
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePlayer(player) {
  const errors = [];

  if (!player || typeof player.name !== 'string' || player.name.trim() === '') {
    errors.push('Missing required field: name');
  }
  if (!player || typeof player.position !== 'string' || player.position.trim() === '') {
    errors.push('Missing required field: position');
  }
  if (!player || typeof player.overall !== 'number' || Number.isNaN(player.overall)) {
    errors.push('Missing required field: overall');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Returns a shallow copy of the player with all optional fields resolved to
 * their defaults. Call this after validatePlayer to get a fully-resolved record.
 *
 * @param {import('./schema.js').Player} player
 * @returns {import('./schema.js').ResolvedPlayer}
 */
export function applyDefaults(player) {
  return {
    ...player,
    attack: player.attack ?? player.overall,
    defence: player.defence ?? player.overall,
    setPiece: player.setPiece ?? player.overall,
    intlCaps: player.intlCaps ?? 0,
    tryRate: player.tryRate ?? 0,
    goalKicker: player.goalKicker ?? false,
  };
}

/**
 * Checks that every club in clubNames has at least the minimum number of
 * players for each required position.
 *
 * @param {import('./schema.js').Player[]} players
 * @param {string[]} clubNames
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSquad(players, clubNames) {
  const errors = [];

  for (const clubName of clubNames) {
    const squad = players.filter(p => p.club === clubName);

    for (const position of REQUIRED_POSITIONS) {
      const needed = MINIMUM_COUNTS[position] ?? 1;
      const found = squad.filter(p => p.position === position).length;
      if (found < needed) {
        errors.push(
          `${clubName}: needs ${needed} ${position} player${needed > 1 ? 's' : ''}, found ${found}`
        );
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
