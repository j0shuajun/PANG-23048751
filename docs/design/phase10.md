# Phase 10 설계 — Mission 1 난이도 적용 및 전체 흐름 연결 (초안)

`docs/PLAN.md`의 Phase 10 범위를 어떻게 구현할지 정리한 설계 문서다. 이 Phase가 끝나면 메인 화면부터 결과 화면까지 전체 흐름이 하나로 연결된다.

## 1. 범위

- **포함**
  - `docs/FEATURES/mission1.md` 기준 Mission 1의 초기 Bubble 개수/크기, Block 배치를 실제 데이터로 반영
  - 메인 화면 → 게임 선택 → 시작 → Mission 1 플레이 → 승리/게임 오버 → 메인 화면 복귀까지 전체 연결
- **제외**: 향후 Mission이 늘어났을 때의 실제 분기(지금은 Mission 1 하나뿐)

## 2. 모듈 구조

```
src/game/missionLevels.ts   (신규) 미션별 초기 Bubble/Block 배치 데이터
src/screens/GameScreen.tsx  (변경) Phase 5~6의 하드코딩 테스트 데이터 대신 missionLevels에서 초기 배치를 읽어옴
src/App.tsx                 (변경) MainScreen에서 선택한 missionId를 GameScreen까지 전달
src/screens/MainScreen.tsx  (변경) onStart 호출 시 선택된 missionId를 함께 전달
```

## 3. 상세 설계

### `src/game/missionLevels.ts`

```ts
export interface MissionLevel {
  bubbles: { x: number; y: number; sizeLevel: BubbleSizeLevel }[]
  blocks: { x: number; y: number; width: number; height: number }[]
}

export const missionLevels: Record<string, MissionLevel> = {
  mission1: {
    bubbles: [{ x: 400, y: 100, sizeLevel: 0 }], // 큰 Bubble 1개, docs/FEATURES/mission1.md 기준
    blocks: [], // Block 없음
  },
}
```

- `docs/FEATURES/mission1.md`의 "시작 Bubble 개수 1~2개, 가장 큰 크기 1단계, Block 배치 없음 또는 최소 발판" 방향을 그대로 따라 가장 쉬운 구성(큰 Bubble 1개, Block 없음)으로 정한다.

### 화면 연결

- `MainScreen`의 `onStart`가 `(missionId: string) => void`로 시그니처를 바꾸고, 현재 `selectedMissionId`를 인자로 전달한다.
- `App.tsx`는 전달받은 `missionId`를 state로 저장해두고, `GameScreen missionId={...}`로 내려준다.
- `GameScreen`은 `missionId`로 `missionLevels`에서 초기 배치를 찾아 Bubble/Block을 초기화한다.
- 결과 화면에서 "다시 시작" 시 같은 `missionId`로 `GameScreen`을 다시 마운트한다(초기 배치가 그대로 재생성되도록, `key={missionId}` 등으로 컴포넌트를 새로 마운트).

## 4. 가정 및 향후 조정 여지

- 지금은 Mission이 1개뿐이라 `missionId`는 항상 `'mission1'`이지만, 이후 Mission이 늘어나도 `missionLevels`에 항목만 추가하면 되는 구조로 미리 둔다.
- Mission 1 난이도(“쉬운 난이도로 느껴지는지”)는 실제 플레이 후 사람이 확인해 조정할 수 있다.
