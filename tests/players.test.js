import players from '../src/data/players.placeholder.json'

describe('players.placeholder.json', () => {
  it('contains 30 players', () => {
    expect(players).toHaveLength(30)
  })

  it('every player has the required schema fields', () => {
    for (const p of players) {
      expect(p).toHaveProperty('club')
      expect(p).toHaveProperty('position')
      expect(p).toHaveProperty('name')
      expect(p).toHaveProperty('overall')
      expect(p).toHaveProperty('intlCaps')
    }
  })

  it('covers all 15 positions for each club', () => {
    const positions = [
      'Loosehead Prop', 'Hooker', 'Tighthead Prop',
      'Lock', 'Blindside Flanker', 'Openside Flanker', 'Number 8',
      'Scrum-half', 'Fly-half',
      'Left Wing', 'Inside Centre', 'Outside Centre', 'Right Wing', 'Fullback',
    ]
    const clubs = [...new Set(players.map((p) => p.club))]
    expect(clubs).toHaveLength(2)

    for (const club of clubs) {
      const clubPlayers = players.filter((p) => p.club === club)
      for (const pos of positions) {
        expect(clubPlayers.some((p) => p.position === pos)).toBe(true)
      }
    }
  })
})
