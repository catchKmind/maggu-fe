# 네이밍 컨벤션

## 폴더

- 전부 kebab-case
- `features/` 하위 도메인 폴더명은 화면/기능 단위: `map`, `my-page`, `community`
- 폴더 내부 세부 구조: `components/`, `hooks/`, `api/`, `store/`

```
features/
  map/
  my-page/
  community/
```

## 파일

| 종류 | 규칙 | 예시 |
| --- | --- | --- |
| 컴포넌트 | PascalCase.tsx | `BottomSheet.tsx`, `MapPage.tsx` |
| 컴포넌트 전용 폴더 | PascalCase 폴더 + `index.ts`로 re-export | `BottomSheet/BottomSheet.tsx`, `BottomSheet/index.ts` |
| 훅 | camelCase, `use` 접두사 | `useBottomSheet.ts`, `useAppStore.ts` |
| 유틸/lib | camelCase | `api.ts`, `platform.ts`, `storage.ts` |
| 타입 전용 파일 | camelCase, `.types.ts` | `map.types.ts` |
| 스타일 토큰 | kebab-case | `colors.css`, `fonts.css` |

## 컴포넌트

- 이름: PascalCase, 파일명과 동일
- Props 타입: 컴포넌트명 + `Props` — `BottomSheetProps`
- 하위 전용 컴포넌트가 아니면 폴더 분리하지 않고 단일 파일로 시작, 필요해지면 폴더로 승격

```tsx
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BottomSheet({ isOpen, onClose }: BottomSheetProps) {}
```

## 훅

- `use` + camelCase 동사/명사구
- 반환값이 여러 개면 객체로, 상태+액션이 명확히 구분되면 배열도 허용(useState 스타일)

```ts
useBottomSheet();
useMapMarkers();
```

## 함수 / 변수

- camelCase
- 이벤트 핸들러: `handle` + 동사(내부 정의), `on` + 동사(props로 전달)

```tsx
function handleClose() {}
<BottomSheet onClose={handleClose} />;
```

- boolean: `is` / `has` / `can` 접두사

```ts
const isOpen = true;
const hasNextPage = false;
const canSubmit = true;
```

- API 요청 함수: 동사 + 명사, REST 동작 기준

```ts
getMapMarkers();
postCommunityPost();
deleteMyPost(id);
```

## 상수

- SCREAMING_SNAKE_CASE, 파일 상단 또는 별도 `constants.ts`

```ts
const MAX_BOTTOM_SHEET_HEIGHT = 480;
```

## 스토어 (zustand)

- `use` + 도메인 + `Store`
- 액션은 동사로 시작

```ts
useAppStore();
useMapStore();

// store 내부
setSelectedMarker(marker);
resetFilters();
```

## 타입 / 인터페이스

- PascalCase, `I` 접두사 사용하지 않음
- Props는 `XxxProps`, 도메인 엔티티는 명사 그대로

```ts
interface Community {}
interface CommunityPost {}
interface MapPageProps {}
```

## CSS 변수 (Tailwind v4 `@theme`)

- 이미 적용된 패턴 유지: `--{namespace}-{name}-{scale}`

```css
--color-yellow-500: #f59e2e;
--font-weight-semibold: 600;
--text-16: 16px;
```

## 라우트 경로

- kebab-case, 소문자

```
/map
/my-page
/community
```
