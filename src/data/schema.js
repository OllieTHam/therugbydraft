/**
 * @typedef {Object} Club
 * @property {string} name - Club's full name (e.g. "Bath Rugby")
 * @property {string[]} colours - Primary colours as descriptive strings (e.g. ["navy", "gold"])
 * @property {string} season - Season identifier (e.g. "2024-25"); supports future backdating
 */

/**
 * A player record as it appears in the source JSON.
 * Required fields must be present; all others resolve to defaults via applyDefaults().
 *
 * The 12 canonical position tag values are:
 *   Loosehead Prop, Tighthead Prop, Hooker, Lock, Flanker, Number 8,
 *   Scrum-half, Fly-half, Inside Centre, Outside Centre, Wing, Fullback
 *
 * Lock, Flanker, and Wing each require two players per squad.
 * "Flanker" covers both blindside and openside — no sub-distinction.
 * "Wing" covers both left and right — no sub-distinction.
 * Inside Centre and Outside Centre remain genuinely split.
 *
 * @typedef {Object} Player
 * @property {string}   name           - REQUIRED. Player's full name.
 * @property {string}   club           - REQUIRED for squad validation. Club name matching a Club.name value.
 * @property {string[]} positions      - REQUIRED. Non-empty array of canonical position tags. Unordered — no "primary" position.
 * @property {number}   overall        - REQUIRED. Overall rating 1–99. Also the fallback for sub-ratings.
 * @property {number}   [attack]       - OPTIONAL. Defaults to `overall` if omitted.
 * @property {number}   [defence]      - OPTIONAL. Defaults to `overall` if omitted.
 * @property {number}   [setPiece]     - OPTIONAL. Defaults to `overall` if omitted.
 * @property {number}   [intlCaps]     - OPTIONAL. International caps. Defaults to 0.
 * @property {number}   [tryRate]      - OPTIONAL. Try-scoring likelihood 0–1. Defaults to 0.
 * @property {boolean}  [goalKicker]   - OPTIONAL. Whether the player can kick goals. Defaults to false.
 */

/**
 * A player record after applyDefaults() has been called — all fields are guaranteed present.
 *
 * @typedef {Object} ResolvedPlayer
 * @property {string}   name
 * @property {string}   club
 * @property {string[]} positions
 * @property {number}   overall
 * @property {number}   attack
 * @property {number}   defence
 * @property {number}   setPiece
 * @property {number}   intlCaps
 * @property {number}   tryRate
 * @property {boolean}  goalKicker
 */

export {};
