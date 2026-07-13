import { useCallback, useEffect, useState } from 'react'
import { missions } from '../data/missions'
import './MainScreen.css'

type MenuItem =
  | { type: 'mission'; id: string; label: string }
  | { type: 'action'; id: 'start' | 'exit'; label: string }

const menuItems: MenuItem[] = [
  ...missions.map((mission) => ({ type: 'mission', id: mission.id, label: mission.name }) as const),
  { type: 'action', id: 'start', label: '시작' },
  { type: 'action', id: 'exit', label: '종료' },
]

const missionItemCount = missions.length

interface MainScreenProps {
  onStart: () => void
  onExit: () => void
}

function MainScreen({ onStart, onExit }: MainScreenProps) {
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [selectedMissionId, setSelectedMissionId] = useState(missions[0]?.id)

  const runMenuItem = useCallback(
    (item: MenuItem) => {
      if (item.type === 'mission') {
        setSelectedMissionId(item.id)
      } else if (item.id === 'start') {
        onStart()
      } else {
        onExit()
      }
    },
    [onStart, onExit],
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        setFocusedIndex((index) => (index + 1) % menuItems.length)
      } else if (event.key === 'ArrowUp') {
        setFocusedIndex((index) => (index - 1 + menuItems.length) % menuItems.length)
      } else if (event.key === 'Enter') {
        runMenuItem(menuItems[focusedIndex])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedIndex, runMenuItem])

  return (
    <div className="main-screen">
      <h1 className="main-screen__title">PANG</h1>

      <div className="main-screen__mission-select">
        <h2>게임 선택</h2>
        <ul>
          {menuItems.slice(0, missionItemCount).map((item, index) => {
            const classNames = [
              index === focusedIndex ? 'is-focused' : '',
              item.id === selectedMissionId ? 'is-selected' : '',
            ]
              .filter(Boolean)
              .join(' ')

            return (
              <li key={item.id} className={classNames || undefined} onClick={() => runMenuItem(item)}>
                {item.label}
              </li>
            )
          })}
        </ul>
      </div>

      <div className="main-screen__actions">
        {menuItems.slice(missionItemCount).map((item, i) => {
          const index = missionItemCount + i
          return (
            <button
              key={item.id}
              type="button"
              className={`main-screen__button${index === focusedIndex ? ' is-focused' : ''}`}
              onClick={() => runMenuItem(item)}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MainScreen
