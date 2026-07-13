# Phase 1 설계 — 메인 화면 UI (초안)

`docs/PLAN.md`의 Phase 1 범위를 어떻게 구현할지 정리한 설계 문서다. 구현 전 검토용이며, 아직 코드는 작성하지 않았다.

## 1. 범위

- **포함**: 메인 화면에 타이틀, 게임 선택 영역, 시작 버튼, 종료 버튼을 화면에 표시. 이 세 항목(미션 목록/시작/종료)을 하나의 메뉴로 묶어 키보드 방향키(↑/↓)로 포커스를 이동하고, 현재 포커스 항목을 강조 표시
- **제외 (Phase 2 이후로 미룸)**: 포커스된 항목을 Enter/Space 등으로 "실행"하는 동작(화면 전환, 종료 처리, 미션 선택 상태 반영), 게임 화면 자체

## 2. 화면 레이아웃 (와이어프레임)

```
┌─────────────────────────────┐
│                               │
│             PANG              │
│                               │
│      ┌─────────────────┐      │
│      │  게임 선택        │      │
│      │ [▸ Mission 1]    │      │ ← 포커스된 항목(강조 표시)
│      └─────────────────┘      │
│                               │
│         [  시작  ]            │
│         [  종료  ]            │
│                               │
└─────────────────────────────┘
```

화면 중앙에 세로로 정렬된 단일 컬럼 레이아웃. 진하게 표시된 `[ ]` 항목이 현재 키보드 포커스가 위치한 메뉴 항목이다. 위/아래 방향키를 누르면 이 강조 표시가 다음 항목으로 이동한다.

## 3. 컴포넌트 구조

```
App.tsx
└─ src/screens/MainScreen.tsx   (타이틀, 게임 선택, 버튼 2개 모두 포함)
   └─ src/screens/MainScreen.css
src/data/missions.ts             (게임 선택 목록 데이터)
```

- 기존 `App.tsx`의 Hello World 내용을 제거하고 `<MainScreen />`을 렌더링하도록 교체한다.
- 기존 템플릿에서 쓰이던 `App.css`(`.hero`, `.counter` 등)와 `src/assets`의 로고 이미지들은 Phase 1부터 더 이상 사용하지 않는다.

## 4. 컴포넌트 상세

### `src/data/missions.ts`

게임 선택 영역에 표시할 목록 데이터. 지금은 Mission 1 하나만 있지만, 추후 미션이 추가돼도 배열에 항목만 추가하면 되는 구조로 둔다.

```ts
export interface Mission {
  id: string
  name: string
}

export const missions: Mission[] = [{ id: 'mission1', name: 'Mission 1' }]
```

### `src/screens/MainScreen.tsx`

- Props 없음.
- `missions.ts`를 읽어 목록으로 표시한다 (Phase 1에서는 선택 항목을 "실행"하는 동작 없이 포커스 이동만 다룬다).
- 표시 요소 4가지: 타이틀 → 게임 선택 목록 → 시작 버튼 → 종료 버튼 (위에서 아래 순서).
- 버튼은 Phase 1에서 클릭/Enter로 실행해도 아무 동작을 하지 않는 상태로 둔다(다음 Phase에서 연결).
- **메뉴 포커스 이동**을 위해 미션 목록과 시작/종료 버튼을 하나의 배열로 합쳐서 관리한다.

  ```ts
  type MenuItem =
    | { type: 'mission'; id: string; label: string }
    | { type: 'action'; id: 'start' | 'exit'; label: string }

  const menuItems: MenuItem[] = [
    ...missions.map((mission) => ({ type: 'mission', id: mission.id, label: mission.name }) as const),
    { type: 'action', id: 'start', label: '시작' },
    { type: 'action', id: 'exit', label: '종료' },
  ]
  ```

- `useState`로 `focusedIndex`(현재 포커스된 항목의 배열 인덱스, 기본값 `0`)를 관리한다.
- `useEffect`에서 `keydown` 이벤트를 등록해 `ArrowDown`/`ArrowUp` 입력 시 `focusedIndex`를 아래 규칙으로 갱신한다.
  - `ArrowDown`: `focusedIndex + 1`, 마지막 인덱스라면 `0`으로 순환
  - `ArrowUp`: `focusedIndex - 1`, `0`이라면 마지막 인덱스로 순환
- 렌더링 시 `menuItems`를 순회하며, 인덱스가 `focusedIndex`와 일치하는 항목에 강조 클래스(`is-focused`)를 부여한다.
- `Enter`/`Space` 등으로 포커스 항목을 실행하는 로직은 포함하지 않는다(Phase 2).

## 5. 스타일링 방침

- `src/index.css`에 이미 정의된 색상 변수(`--text`, `--bg`, `--accent` 등)를 그대로 재사용한다.
- `MainScreen` 전용 스타일은 `MainScreen.css`에 새로 작성하고, 기존 `App.css`의 스타일은 참조하지 않는다.
- 레이아웃은 flex column + 중앙 정렬로 구성한다.
- 포커스된 메뉴 항목에는 `is-focused` 클래스를 부여하고, 테두리 강조 또는 배경색 변경으로 다른 항목과 구분되게 스타일링한다.

## 6. Phase 1에서 하지 않는 것 (Non-goals)

- 포커스된 항목을 Enter/Space로 "실행"하는 동작(실제 화면 전환, 종료, 미션 선택 반영) (Phase 2)
- 마우스 클릭/hover로 포커스를 옮기는 동작 (이번 Phase는 키보드 방향키 이동만 다룸)
- 반응형 대응, 접근성(a11y) 세부 튜닝 — 필요 시 별도 논의

## 7. 검토가 필요한 부분

- 게임 선택 영역을 목록(리스트) 형태로 둘지, 다른 형태(카드 등)로 둘지
- 시작 버튼과 종료 버튼의 배치 순서/스타일 구분(주 버튼/보조 버튼 여부)
- 기존 템플릿 잔여 요소(App.css, assets의 react/vite 로고 등) 삭제 여부 — Phase 1 구현과 함께 정리할지, 별도로 남겨둘지
- 메뉴 끝에서 반대쪽 끝으로 순환 이동하는 방식이 맞는지, 아니면 끝에서 멈추는 방식이 맞는지
- 포커스 강조 표시 방식(테두리 vs 배경색 vs 화살표 아이콘 등) 중 어떤 것을 쓸지
