import { describe, it, expect } from 'vitest';
import { validatePlayer, applyDefaults, validateSquad } from './validation.js';

const MINIMAL_PLAYER = { name: 'Joe Walsh', position: 'Loosehead Prop', overall: 74 };

describe('validatePlayer', () => {
  it('passes a player with only the three required fields', () => {
    expect(validatePlayer(MINIMAL_PLAYER).valid).toBe(true);
  });

  it('fails when name is missing', () => {
    const { name: _n, ...player } = MINIMAL_PLAYER;
    const result = validatePlayer(player);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([expect.stringContaining('name')]));
  });

  it('fails when name is an empty string', () => {
    const result = validatePlayer({ ...MINIMAL_PLAYER, name: '' });
    expect(result.valid).toBe(false);
  });

  it('fails when position is missing', () => {
    const { position: _p, ...player } = MINIMAL_PLAYER;
    const result = validatePlayer(player);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(expect.arrayContaining([expect.stringContaining('position')]));
  });

  it('fails when overall is missing', () => {
    const { overall: _r, ...player } = MINIMAL_PLAYER;
    const result = validatePlayer(player);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('overall')])
    );
  });

  it('does NOT fail when all optional fields are absent', () => {
    // attack, defence, setPiece, intlCaps, tryRate, goalKicker all missing
    expect(validatePlayer(MINIMAL_PLAYER).valid).toBe(true);
  });

  it('does NOT fail when a player has intlCaps and tryRate but no sub-ratings', () => {
    const player = { ...MINIMAL_PLAYER, intlCaps: 10, tryRate: 0.3 };
    expect(validatePlayer(player).valid).toBe(true);
  });
});

describe('applyDefaults', () => {
  it('sets attack, defence, setPiece to overall when absent', () => {
    const result = applyDefaults(MINIMAL_PLAYER);
    expect(result.attack).toBe(74);
    expect(result.defence).toBe(74);
    expect(result.setPiece).toBe(74);
  });

  it('defaults intlCaps to 0', () => {
    expect(applyDefaults(MINIMAL_PLAYER).intlCaps).toBe(0);
  });

  it('defaults tryRate to 0', () => {
    expect(applyDefaults(MINIMAL_PLAYER).tryRate).toBe(0);
  });

  it('defaults goalKicker to false', () => {
    expect(applyDefaults(MINIMAL_PLAYER).goalKicker).toBe(false);
  });

  it('preserves explicitly supplied optional fields', () => {
    const player = { ...MINIMAL_PLAYER, attack: 90, defence: 85, intlCaps: 25, goalKicker: true };
    const result = applyDefaults(player);
    expect(result.attack).toBe(90);
    expect(result.defence).toBe(85);
    expect(result.intlCaps).toBe(25);
    expect(result.goalKicker).toBe(true);
    // setPiece was absent so should fall back to overall
    expect(result.setPiece).toBe(74);
  });

  it('does not mutate the original player object', () => {
    const player = { ...MINIMAL_PLAYER };
    applyDefaults(player);
    expect(player.attack).toBeUndefined();
  });
});

describe('validateSquad', () => {
  const SQUAD_POSITIONS = [
    'Loosehead Prop', 'Hooker', 'Tighthead Prop',
    'Lock', 'Lock',
    'Blindside Flanker', 'Openside Flanker', 'Number 8',
    'Scrum-half', 'Fly-half',
    'Left Wing', 'Inside Centre', 'Outside Centre', 'Right Wing', 'Fullback',
  ];

  const makeSquad = (club) =>
    SQUAD_POSITIONS.map((position, i) => ({
      name: `Player ${i + 1}`,
      club,
      position,
      overall: 75,
    }));

  it('passes a complete 15-player squad', () => {
    const result = validateSquad(makeSquad('Bath Rugby'), ['Bath Rugby']);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('fails when a club has no Fly-half', () => {
    const squad = makeSquad('Bath Rugby').filter(p => p.position !== 'Fly-half');
    const result = validateSquad(squad, ['Bath Rugby']);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('Fly-half')])
    );
  });

  it('fails when a club has only one Lock instead of two', () => {
    const squad = makeSquad('Bath Rugby');
    const lockIndex = squad.findIndex(p => p.position === 'Lock');
    squad.splice(lockIndex, 1);
    const result = validateSquad(squad, ['Bath Rugby']);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('Lock')])
    );
  });

  it('reports errors per-club independently', () => {
    const bath = makeSquad('Bath Rugby');
    const bristol = makeSquad('Bristol Bears').filter(p => p.position !== 'Hooker');
    const result = validateSquad([...bath, ...bristol], ['Bath Rugby', 'Bristol Bears']);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Bristol Bears'))).toBe(true);
    expect(result.errors.some(e => e.includes('Bath Rugby'))).toBe(false);
  });

  it('passes when all clubs are complete', () => {
    const players = [...makeSquad('Bath Rugby'), ...makeSquad('Bristol Bears')];
    const result = validateSquad(players, ['Bath Rugby', 'Bristol Bears']);
    expect(result.valid).toBe(true);
  });
});
