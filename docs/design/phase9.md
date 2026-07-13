# Phase 9 설계 — 승리 조건과 결과 화면 (초안)

`docs/PLAN.md`의 Phase 9 범위를 어떻게 구현할지 정리한 설계 문서다.

## 1. 범위

- **포함**
  - 화면의 모든 Bubble(분할된 것 포함)을 제거하면 승리 판정
  - 승리/게임 오버를 보여주는 결과 화면과, 재시작·메인 이동 동작
- **제외**: Mission 1 고유 난이도 데이터 연결(Phase 10)

## 2. 모듈 구조

```
src/screens/ResultScreen.tsx  (신규) 승리/게임 오버 공용 결과 화면
src/screens/ResultScreen.css  (신규)
src/screens/GameScreen.tsx    (변경) Bubble 소진 시 onWin() 호출
src/App.tsx                   (변경) 'result' 화면 렌더링, 재시작/메인 이동 처리
```

## 3. 상세 설계

- **승리 판정**: `GameScreen`이 매 프레임 Bubble 배열이 비었는지 확인하고, 비었다면 `onWin()`을 호출한다(Phase 8에서 만든 `onLose()`와 대칭 구조).
- **ResultScreen.tsx**: props로 `outcome: 'win' | 'lose'`, `onRestart: () => void`, `onMain: () => void`를 받는다.
  - `outcome === 'win'`이면 "승리! 모든 Bubble을 제거했습니다" 문구를,
  - `outcome === 'lose'`이면 "게임 오버" 문구를 표시한다.
  - "다시 시작" 버튼(`onRestart`)과 "메인으로" 버튼(`onMain`)을 표시한다.
- **App.tsx**: `screen` 상태에 `'result'`를 추가하고, `outcome: 'win' | 'lose' | null` state를 별도로 둔다.
  - `GameScreen`의 `onWin`/`onLose`에서 각각 `outcome`을 설정하고 `screen`을 `'result'`로 바꾼다.
  - `ResultScreen`의 `onRestart`는 `screen`을 다시 `'game'`으로(같은 미션을 새로 시작), `onMain`은 `'main'`으로 되돌린다.

## 4. 가정 및 향후 조정 여지

- "다시 시작"은 같은 미션을 처음부터 다시 시작하는 것으로 가정한다(다른 미션 선택 화면으로 가지 않음).
- 결과 화면의 문구/버튼 배치는 `MainScreen`과 유사한 스타일(중앙 정렬, 동일 색상 변수)로 통일한다.
