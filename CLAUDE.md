# CLAUDE.md

## 기술 스택

- **프레임워크**: React 19 (`react`, `react-dom` ^19.2.7)
- **언어**: TypeScript (~6.0.2)
- **빌드 도구**: Vite (^8.1.1) + `@vitejs/plugin-react` (^6.0.3)
- **린터**: oxlint (^1.71.0) — ESLint 대신 사용
- **패키지 매니저**: npm

## 테스트 방법

현재 별도의 테스트 프레임워크(Vitest, Jest 등)는 설치되어 있지 않다. 코드 변경 검증은 아래 npm 스크립트로 수행한다.

- `npm run build`: `tsc -b && vite build` 실행 — TypeScript 타입 체크와 프로덕션 빌드가 모두 통과하는지 확인
- `npm run lint`: oxlint로 정적 분석 수행
- `npm run dev`: 로컬 개발 서버를 띄워 브라우저에서 직접 동작 확인
- `npm run preview`: 프로덕션 빌드 결과물을 로컬에서 미리보기

## 문서 구조

게임 기획 관련 문서는 아래와 같이 구분해서 관리한다.

- `docs/PRD.md`: 팡(PANG) 게임의 전체 개요와 핵심 규칙(Object 구성, Pang KATA 규칙)
- `docs/FEATURES/main.md`: 첫 메인 화면 구성
- `docs/FEATURES/game_rule.md`: 게임 룰에 대한 상세 내용
- `docs/FEATURES/mission1.md`: Mission 1 난이도 및 규칙
