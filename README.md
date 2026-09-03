# 📚 YEOBAEK-Frontend

Frontend 프로젝트 협업을 위한 Git 및 코드 작성 규칙입니다.

---

# 🛠 Tech Stack

| Category         | Stack                |
| ---------------- | -------------------- |
| Framework        | React 19             |
| Language         | TypeScript           |
| Build Tool       | Vite                 |
| Styling          | Tailwind CSS v4      |
| Routing          | React Router DOM     |
| State Management | Zustand              |
| Server State     | TanStack Query       |
| Devtools         | React Query Devtools |
| HTTP Client      | Axios                |
| Code Quality     | ESLint, Prettier     |

---

# ⚙️ Project Setup

프로젝트의 기본 개발 환경은 다음과 같이 구성합니다.

- React + TypeScript + Vite
- Tailwind CSS v4
- React Router DOM
- TanStack Query
- React Query Devtools
- Zustand
- Axios
- ESLint
- Prettier
- TypeScript Strict Mode
- Path Alias (`@/`)
- 전역 폰트 설정
- 모바일 웹앱 레이아웃 구성

## 모바일 웹앱 레이아웃

서비스는 모바일 환경을 기준으로 개발합니다.

```text
최대 화면 너비 : 420px
Tailwind Class : max-w-105
```

- 모바일에서는 화면 너비를 100% 사용합니다.
- 데스크톱에서는 최대 `420px` 너비로 가운데 정렬합니다.
- 페이지 내부 기본 여백은 `padding`을 사용합니다.
- 공통 페이지는 `RootLayout`을 사용합니다.
- 하단 네비게이션은 `FooterNavigation`을 사용합니다.

---

# 📁 Folder Structure

```text
src/
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
│
├── components/
│   └── common/
│       └── footerNavigation/
│           └── FooterNavigation.tsx
│
├── hooks/
│
├── layouts/
│   └── RootLayout.tsx
│
├── pages/
│   ├── home/
│   │   └── HomePage.tsx
│   │
│   ├── vocabulary/
│   │   └── VocabularyPage.tsx
│   │
│   ├── training/
│   │   └── TrainingPage.tsx
│   │
│   ├── library/
│   │   └── LibraryPage.tsx
│   │
│   └── my/
│       └── MyPage.tsx
│
├── stores/
├── types/
├── utils/
├── App.tsx
├── index.css
└── main.tsx
```

---

# 🗺 Routing

| Page   | Route         |
| ------ | ------------- |
| HOME   | `/`           |
| 단어장 | `/vocabulary` |
| 훈련   | `/training`   |
| 서재   | `/library`    |
| MY     | `/my`         |

메인 페이지는 `RootLayout` 하위 라우트로 구성하며 공통으로 `FooterNavigation`을 사용합니다.

---

# 🌿 Branch Convention

안정적인 개발과 기능별 작업 관리를 위해 브랜치를 역할별로 분리합니다.

- 🔵 **main**
  - 안정적인 코드를 관리하는 브랜치
  - 직접 작업하지 않습니다.
  - Pull Request를 통해 병합합니다.

- 🟣 **develop**
  - 기능 개발 결과를 통합하는 개발 브랜치
  - 새로운 기능 브랜치는 `develop`을 기준으로 생성합니다.

- 🟢 **작업 브랜치**
  - 기능 또는 이슈 단위로 생성합니다.
  - 하나의 브랜치는 하나의 이슈를 담당합니다.

```text
main
 └── develop
      ├── feat/10-home
      ├── feat/11-training
      ├── fix/15-footer-navigation
      └── chore/1-project-setup
```

---

# 📌 Branch Naming Convention

## 구조

```text
prefix/이슈번호-작업내용
```

## 예시

```text
feat/10-home-page
feat/11-training-page
fix/23-footer-navigation
design/12-home-page
refactor/30-query-hooks
docs/5-update-readme
chore/1-project-setup
```

| Prefix     | 설명                   |
| ---------- | ---------------------- |
| `feat`     | 새로운 기능 추가       |
| `fix`      | 버그 수정              |
| `hotfix`   | 긴급 버그 수정         |
| `design`   | UI / CSS 수정          |
| `refactor` | 코드 리팩토링          |
| `docs`     | 문서 수정              |
| `chore`    | 설정 파일 및 환경 변경 |

## 작성 규칙

- 영문 소문자와 숫자를 사용합니다.
- 단어 구분은 하이픈 `-`을 사용합니다.
- 브랜치명에는 `#`을 사용하지 않습니다.
- 한 브랜치는 하나의 이슈만 담당합니다.

```text
feat/10-home-page              ✅
fix/23-footer-navigation       ✅

feat/#10-home                  ❌
feature/HomePage               ❌
```

---

# 📝 Commit Convention

커밋 메시지는 아래 형식으로 작성합니다.

```text
이모지 Type: 작업 내용
```

## 예시

```text
🎉 Start: 프로젝트 초기 설정

✨ Feat: 메인 페이지 라우팅 구현

🐛 Fix: 하단 네비게이션 경로 오류 수정

🚑 Hotfix: 배포 환경 페이지 접근 오류 수정

🎨 Design: 메인 페이지 레이아웃 수정

♻️ Refactor: FooterNavigation 컴포넌트 분리

🔧 Settings: ESLint 및 Prettier 설정

🗃️ Comment: 라우팅 관련 주석 추가

➕ Dependency/Plugin: React Router DOM 추가

📝 Docs: README 협업 규칙 수정

🔀 Merge: 메인 페이지 기능 브랜치 병합

🚀 Deploy: 운영 환경 배포

🚚 Rename: 페이지 파일명 변경

🔥 Remove: 사용하지 않는 Vite 기본 파일 삭제

⏪ Revert: 이전 버전으로 복구
```

| 이모지 | Type                | 설명                             |
| ------ | ------------------- | -------------------------------- |
| 🎉     | `Start`             | 프로젝트 생성 및 초기 설정       |
| ✨     | `Feat`              | 새로운 기능 구현                 |
| 🐛     | `Fix`               | 버그 수정                        |
| 🚑     | `Hotfix`            | 긴급 버그 수정                   |
| 🎨     | `Design`            | UI 및 CSS 변경                   |
| ♻️     | `Refactor`          | 기능 변경 없는 코드 구조 개선    |
| 🔧     | `Settings`          | 개발 환경 및 설정 파일 변경      |
| 🗃️     | `Comment`           | 주석 추가 및 수정                |
| ➕     | `Dependency/Plugin` | 라이브러리 및 플러그인 추가      |
| 📝     | `Docs`              | 문서 추가 및 수정                |
| 🔀     | `Merge`             | 브랜치 병합                      |
| 🚀     | `Deploy`            | 배포 관련 작업                   |
| 🚚     | `Rename`            | 파일 및 폴더 이름 변경 또는 이동 |
| 🔥     | `Remove`            | 파일 및 코드 삭제                |
| ⏪     | `Revert`            | 이전 커밋으로 되돌리기           |

## 커밋 작성 규칙

- 제목 끝에 마침표를 붙이지 않습니다.
- 한 커밋에는 하나의 논리적 변경만 포함합니다.
- `수정`, `작업`, `변경`처럼 모호한 표현만 사용하지 않습니다.
- 기능 구현과 디자인 변경은 가능하면 분리합니다.

```text
🐛 Fix: 오류 수정                         ❌
🐛 Fix: 하단 네비게이션 경로 오류 수정   ✅
```

---

# 🔀 Workflow

1. `develop` 브랜치를 최신화합니다.
2. 작업할 이슈를 생성합니다.
3. `develop`에서 작업 브랜치를 생성합니다.
4. 기능 개발 후 Commit Convention에 맞게 커밋합니다.
5. 원격 저장소에 Push합니다.
6. `develop` 브랜치로 Pull Request를 생성합니다.
7. 팀원들의 코드 리뷰를 진행합니다.
8. 승인 후 병합합니다.
9. Merge가 완료되면 작업 브랜치를 삭제합니다.
10. 배포 시 `develop` 브랜치를 `main`으로 병합합니다.

## Merge 규칙

- `main`, `develop` 브랜치에 직접 Push하지 않습니다.
- Pull Request를 통해서만 병합합니다.
- 최소 1명의 리뷰 승인을 받습니다.
- 충돌은 Pull Request 작성자가 해결합니다.
- Merge 후 작업 브랜치를 삭제합니다.

---

# 🎨 CSS Convention

프로젝트는 **Tailwind CSS v4**를 사용합니다.

## 기본 규칙

- Tailwind Utility Class 사용을 우선합니다.
- 인라인 스타일(`style={{ }}`)은 필요한 경우를 제외하고 사용하지 않습니다.
- 반복되는 UI는 공통 컴포넌트로 분리합니다.
- 반응형은 **Mobile First** 방식으로 작성합니다.
- Tailwind 클래스 오타와 중복을 확인합니다.
- 임의값은 디자인 요구사항이 명확한 경우에만 사용합니다.
- 페이지 내부 기본 여백은 `padding`을 사용합니다.
- 컴포넌트 사이의 간격은 `margin` 또는 `gap`을 사용합니다.

## 모바일 레이아웃

기본 페이지 레이아웃은 다음 기준을 사용합니다.

```tsx
<div className="mx-auto min-h-screen w-full max-w-105">
```

- 최대 너비: `420px`
- 모바일: `w-full`
- 데스크톱: 가운데 정렬
- 공통 화면 구조는 `RootLayout`에서 관리합니다.

---

# 🔗 API Convention

HTTP 통신에는 **Axios**를 사용하고 서버 상태 관리에는 **TanStack Query**를 사용합니다.

현재 Axios 패키지만 설정되어 있으며, 백엔드 API 주소가 확정된 이후 아래 항목을 추가할 예정입니다.

- Axios Instance
- API Base URL
- 환경 변수
- Request / Response Interceptor
- 공통 API Error 처리

서버에서 받아온 데이터는 가능한 한 TanStack Query를 통해 관리하고, Zustand는 클라이언트 전역 상태 관리에 사용합니다.

---

# 💻 Getting Started

## Repository Clone

```bash
git clone <repository-url>
cd yeobaek-frontend
```

## Package Install

```bash
npm install
```

## Development Server

```bash
npm run dev
```

---

# 🧹 Code Check

Pull Request를 생성하기 전에 아래 명령어를 실행합니다.

## Prettier 검사

```bash
npm run format:check
```

## ESLint 검사

```bash
npm run lint
```

## Build 검사

```bash
npm run build
```

필요한 경우 Prettier 자동 포맷을 실행합니다.

```bash
npm run format
```
