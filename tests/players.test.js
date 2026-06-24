import players from '../src/data/players.placeholder.json'

describe('players.placeholder.json', () => {
  it('contains 30 players', () => {
    expect(players).toHaveLength(30)
  })

  it('every player has the required schema fields', () => {
    for (const p of players) {
      expect(p).toHaveProperty('club')
      expect(p).toHaveProperty('positions')
      expect(p).toHaveProperty('name')
      expect(p).toHaveProperty('overall')
      expect(p).toHaveProperty('intlCaps')
    }
  })

  it('covers all required position tags for each club', () => {
    const positionTags = [
      'Loosehead Prop', 'Tighthead Prop', 'Hooker',
      'Lock', 'Flanker', 'Number 8',
      'Scrum-half', 'Fly-half',
      'Inside Centre', 'Outside Centre', 'Wing', 'Fullback',
    ]
    const clubs = [...new Set(players.map((p) => p.club))]
    expect(clubs).toHaveLength(2)

    for (const club of clubs) {
      const clubPlayers = players.filter((p) => p.club === club)
      for (const tag of positionTags) {
        expect(clubPlayers.some((p) => p.positions.includes(tag))).toBe(true)
      }
    }
  })
})
