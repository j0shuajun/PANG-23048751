import './ResultScreen.css'

interface ResultScreenProps {
  outcome: 'win' | 'lose'
  onRestart: () => void
  onMain: () => void
}

function ResultScreen({ outcome, onRestart, onMain }: ResultScreenProps) {
  const isWin = outcome === 'win'

  return (
    <div className={`result-screen ${isWin ? 'result-screen--win' : 'result-screen--lose'}`}>
      <h1 className="result-screen__title">{isWin ? '승리!' : '게임 오버'}</h1>
      <p className="result-screen__message">
        {isWin ? '모든 Bubble을 제거했습니다.' : '목숨을 모두 잃었습니다.'}
      </p>
      <div className="result-screen__actions">
        <button type="button" className="result-screen__button" onClick={onRestart}>
          다시 시작
        </button>
        <button type="button" className="result-screen__button" onClick={onMain}>
          메인으로
        </button>
      </div>
    </div>
  )
}

export default ResultScreen
