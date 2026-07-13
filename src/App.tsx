import { useState } from 'react'
import MainScreen from './screens/MainScreen'
import GameScreen from './screens/GameScreen'
import ExitScreen from './screens/ExitScreen'
import ResultScreen from './screens/ResultScreen'

type ScreenName = 'main' | 'game' | 'exit' | 'result'
type Outcome = 'win' | 'lose'

function App() {
  const [screen, setScreen] = useState<ScreenName>('main')
  const [outcome, setOutcome] = useState<Outcome>('win')
  const [missionId, setMissionId] = useState('mission1')

  if (screen === 'game') {
    return (
      <GameScreen
        missionId={missionId}
        onWin={() => {
          setOutcome('win')
          setScreen('result')
        }}
        onLose={() => {
          setOutcome('lose')
          setScreen('result')
        }}
      />
    )
  }

  if (screen === 'result') {
    return (
      <ResultScreen
        outcome={outcome}
        onRestart={() => setScreen('game')}
        onMain={() => setScreen('main')}
      />
    )
  }

  if (screen === 'exit') {
    return <ExitScreen />
  }

  return (
    <MainScreen
      onStart={(selectedMissionId) => {
        setMissionId(selectedMissionId)
        setScreen('game')
      }}
      onExit={() => setScreen('exit')}
    />
  )
}

export default App
