import { useLocation } from 'react-router-dom'

export default function Draft() {
  const { state } = useLocation()
  const difficulty = state?.difficulty ?? 'medium'

  return <div>Draft — difficulty: {difficulty}</div>
}
