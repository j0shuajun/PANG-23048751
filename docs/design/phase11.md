# Phase 11 설계 — 게임 선택 목록에 Mission 2~5 추가 (초안)

`docs/PLAN.md`의 Phase 11 범위를 어떻게 구현할지 정리한 설계 문서다.

## 1. 범위

- **포함**: 메인 화면 "게임 선택" 목록에 Mission 2, 3, 4, 5를 추가로 노출하고, 방향키로 다섯 항목 모두 포커스 이동 가능하게 함
- **제외**: Mission 2~5의 실제 난이도 데이터(Bubble/Block 배치)는 이 Phase에서 만들지 않는다. 아직 데이터가 없는 미션은 `GameScreen`의 기존 fallback(`missionLevels[missionId] ?? missionLevels.mission1`)에 의해 자동으로 Mission 1과 동일하게 플레이된다 — 이는 Phase 1 설계 당시 이미 "미션이 늘어나도 배열에 항목만 추가하면 되는 구조"로 만들어 둔 덕분에 별도 코드 변경이 필요 없다.

## 2. 모듈 구조

```
src/data/missions.ts   (변경) Mission 2~5 항목 추가
```

`MainScreen.tsx`, `App.tsx`, `GameScreen.tsx`는 이미 `missions` 배열 길이에 따라 동적으로 동작하도록 만들어져 있어 수정하지 않는다.

## 3. 상세 설계

```ts
export const missions: Mission[] = [
  { id: 'mission1', name: 'Mission 1' },
  { id: 'mission2', name: 'Mission 2' },
  { id: 'mission3', name: 'Mission 3' },
  { id: 'mission4', name: 'Mission 4' },
  { id: 'mission5', name: 'Mission 5' },
]
```

- `MainScreen`의 `menuItems`, `missionItemCount`가 이 배열 길이를 기준으로 자동 계산되므로, 메뉴 항목 수와 방향키 순환 이동 범위가 자연스럽게 5개로 늘어난다.

## 4. 가정 및 향후 조정 여지

- Mission 2~5를 선택해 시작해도 이번 Phase에서는 Mission 1과 같은 난이도로 플레이된다. 이는 의도된 임시 상태이며, Phase 12~15에서 순서대로 실제 난이도로 교체한다.
