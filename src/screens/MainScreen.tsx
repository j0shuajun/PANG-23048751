import { useCallback, useEffect, useState } from 'react'
import { missions } from '../data/missions'
import './MainScreen.css'

const ROW_MISSION_SELECT = 0
const ROW_START = 1
const ROW_EXIT = 2
const ROW_COUNT = 3

interface MainScreenProps {
  onStart: (missionId: string) => void
  onExit: () => void
}

function MainScreen({ onStart, onExit }: MainScreenProps) {
  const [focusedRow, setFocusedRow] = useState(ROW_MISSION_SELECT)
  const [selectedMissionIndex, setSelectedMissionIndex] = useState(0)

  const changeMission = useCallback((delta: number) => {
    setSelectedMissionIndex((index) => (index + delta + missions.length) % missions.length)
  }, [])

  const runFocusedRow = useCallback(() => {
    if (focusedRow === ROW_START) {
      onStart(missions[selectedMissionIndex].id)
    } else if (focusedRow === ROW_EXIT) {
      onExit()
    }
  }, [focusedRow, onStart, onExit, selectedMissionIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        setFocusedRow((row) => (row + 1) % ROW_COUNT)
      } else if (event.key === 'ArrowUp') {
        setFocusedRow((row) => (row - 1 + ROW_COUNT) % ROW_COUNT)
      } else if (event.key === 'ArrowRight' && focusedRow === ROW_MISSION_SELECT) {
        changeMission(1)
      } else if (event.key === 'ArrowLeft' && focusedRow === ROW_MISSION_SELECT) {
        changeMission(-1)
      } else if (event.key === 'Enter') {
        runFocusedRow()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [focusedRow, changeMission, runFocusedRow])

  const selectedMission = missions[selectedMissionIndex]

  return (
    <div className="main-screen">
      <h1 className="main-screen__title">PANG</h1>

      <div className={`main-screen__mission-select${focusedRow === ROW_MISSION_SELECT ? ' is-focused' : ''}`}>
        <h2>게임 선택</h2>
        <div className="main-screen__mission-carousel">
          <button type="button" className="main-screen__arrow" onClick={() => changeMission(-1)}>
            ◀
          </button>
          <span className="main-screen__mission-name">{selectedMission.name}</span>
          <button type="button" className="main-screen__arrow" onClick={() => changeMission(1)}>
            ▶
          </button>
        </div>
      </div>

      <div className="main-screen__actions">
        <button
          type="button"
          className={`main-screen__button${focusedRow === ROW_START ? ' is-focused' : ''}`}
          onClick={() => onStart(selectedMission.id)}
        >
          시작
        </button>
        <button
          type="button"
          className={`main-screen__button${focusedRow === ROW_EXIT ? ' is-focused' : ''}`}
          onClick={onExit}
        >
          종료
        </button>
      </div>
    </div>
  )
}

export default MainScreen
