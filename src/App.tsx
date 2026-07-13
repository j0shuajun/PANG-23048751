import { useState } from 'react'
import MainScreen from './screens/MainScreen'
import GameScreen from './screens/GameScreen'
import ExitScreen from './screens/ExitScreen'

type ScreenName = 'main' | 'game' | 'exit' | 'result'
type Outcome = 'win' | 'lose' | null

function App() {
  const [screen, setScreen] = useState<ScreenName>('main')
  const [outcome, setOutcome] = useState<Outcome>(null)

  if (screen === 'game') {
    return (
      <GameScreen
        onLose={() => {
          setOutcome('lose')
          setScreen('result')
        }}
      />
    )
  }

  if (screen === 'result') {
    // ResultScreen 컴포넌트는 Phase 9에서 만든다. 지금은 게임 오버 판정 확인용 임시 화면이다.
    return <div>게임 종료: {outcome === 'lose' ? '패배' : '승리'}</div>
  }

  if (screen === 'exit') {
    return <ExitScreen />
  }

  return <MainScreen onStart={() => setScreen('game')} onExit={() => setScreen('exit')} />
}

export default App
