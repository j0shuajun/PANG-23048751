# Phase 2 설계 — 메인 화면 버튼 동작 연결 (초안)

`docs/PLAN.md`의 Phase 2 범위를 어떻게 구현할지 정리한 설계 문서다. 구현 전 검토용이며, 아직 코드는 작성하지 않았다.

## 1. 범위

- **포함**
  - 포커스된 메뉴 항목에서 Enter 키(또는 클릭) 입력 시 해당 항목을 "실행"
    - 미션 항목 → 선택 상태로 표시 (지금은 Mission 1 하나뿐이지만, 이후 미션이 늘어났을 때도 쓸 수 있는 구조로 둠)
    - 시작 버튼 → 게임 화면(지금은 빈 placeholder)으로 전환
    - 종료 버튼 → 종료 안내 화면으로 전환
  - 화면 전환을 위한 최소한의 상태 관리 (메인 / 게임 / 종료)
- **제외 (Phase 3 이후로 미룸)**
  - 게임 화면 내부의 실제 게임 로직(Player, Wire, Bubble 등)
  - 브라우저 탭/창을 실제로 강제 종료하는 동작

## 2. 화면 전환 흐름

```
[메인 화면]
   │  (미션 항목 포커스 후 Enter) → 선택 상태로 표시(같은 화면 유지)
   │
   ├─ (시작 버튼 포커스 후 Enter) ──▶ [게임 화면] (Phase 2에서는 빈 placeholder)
   │
   └─ (종료 버튼 포커스 후 Enter) ──▶ [종료 화면] ("게임을 종료합니다" 안내)
```

## 3. 컴포넌트 구조

```
App.tsx                          (현재 화면 상태를 관리)
├─ src/screens/MainScreen.tsx    (기존 파일, props로 콜백 3개 받도록 확장)
├─ src/screens/GameScreen.tsx    (신규, 빈 placeholder)
│  └─ src/screens/GameScreen.css
└─ src/screens/ExitScreen.tsx    (신규, 종료 안내 화면)
   └─ src/screens/ExitScreen.css
```

## 4. 상세 설계

### App.tsx
- `type ScreenName = 'main' | 'game' | 'exit'`
- `useState<ScreenName>('main')`으로 현재 화면을 관리한다.
- `screen`값에 따라 `MainScreen` / `GameScreen` / `ExitScreen` 중 하나만 렌더링한다.
- `MainScreen`에 `onStart`(→ `setScreen('game')`), `onExit`(→ `setScreen('exit')`) 콜백을 props로 전달한다.

### MainScreen.tsx (변경)
- 기존 `focusedIndex`(Phase 1)는 그대로 유지한다.
- `Enter` 키 입력 시, `focusedIndex`가 가리키는 `menuItems` 항목을 아래 규칙으로 "실행"한다.
  - `type: 'mission'` → 내부 state `selectedMissionId`를 해당 항목 id로 갱신(선택 표시용, 화면 전환 없음)
  - `type: 'action', id: 'start'` → `props.onStart()` 호출
  - `type: 'action', id: 'exit'` → `props.onExit()` 호출
- 마우스 클릭으로도 동일하게 실행되도록, `<li>`와 `<button>`에 각각 클릭 핸들러를 둔다.
- `selectedMissionId`와 일치하는 미션 항목에는 `is-selected` 클래스를 추가로 부여해 포커스(`is-focused`)와 구분되게 표시한다.

### GameScreen.tsx (신규)
- Props 없음.
- "게임 화면 준비 중" 정도의 placeholder 문구만 표시한다. 실제 게임 요소(Player/Wire/Bubble/Block)는 이후 Phase에서 채운다.

### ExitScreen.tsx (신규)
- Props 없음.
- "게임을 종료합니다" 안내 문구를 표시한다.
- 실제로 브라우저 탭/창을 닫으려는 시도는 하지 않는다. 스크립트로 열지 않은 탭은 `window.close()`가 대부분의 브라우저에서 동작하지 않고, 사용자 동의 없이 탭을 닫는 것은 UX상으로도 바람직하지 않기 때문이다.

## 5. 스타일링 방침

- `MainScreen.css`와 동일한 패턴으로 `GameScreen.css`, `ExitScreen.css`를 분리 작성한다.
- `index.css`의 색상 변수를 그대로 재사용한다.
- 미션 선택 표시(`is-selected`)는 포커스 표시(`is-focused`)와 시각적으로 구분되어야 한다(예: 포커스는 테두리, 선택은 텍스트 색상 또는 아이콘 추가).

## 6. Phase 2에서 하지 않는 것 (Non-goals)

- 게임 화면 내부 로직 구현 (Phase 3 이후)
- 실제 탭/창/프로세스 종료
- 미션이 여러 개일 때의 실제 분기 로직 (현재 1개뿐이라 `selectedMissionId`는 항상 `mission1`)

## 7. 검토가 필요한 부분

- 종료 버튼 실행 시 "안내 화면"으로 전환하는 방식이 맞는지, 다른 처리(예: 종료 화면 없이 alert만)를 원하는지
- 미션 선택 표시를 이번 Phase에서 최소로만 구현해도 되는지(미션이 1개뿐이라 사실상 항상 선택된 상태와 다르지 않음)
- 실행 트리거를 Enter 키만 쓸지, Space 키도 함께 허용할지
