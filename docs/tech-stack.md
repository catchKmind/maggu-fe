# 기술 스택 및 참고사항

## 주요 라이브러리

| 라이브러리 | 용도 |
| --- | --- |
| `react-router-dom` (v7) | 라우팅. 웹은 `BrowserRouter`, 네이티브 앱은 `HashRouter` 자동 분기 |
| `@tanstack/react-query` | 서버 상태 |
| `zustand` | 클라이언트 전역 상태 |
| `tailwindcss` v4 | 스타일링. config 파일 없이 CSS `@theme`로 토큰 정의 |
| `mapbox-gl` | 지도 |
| `i18next` + `react-i18next` | 다국어(en/ko) |
| `@capacitor/core` | 웹뷰 기반 네이티브 앱 래핑 |

## 알아둘 점

- **Tailwind 토큰**: `src/styles/colors`, `src/styles/fonts`의 `@theme`에서 색상/폰트 정의. 폰트 사이즈는 `text-11`~`text-40`, 굵기는 `font-regular/medium/semibold/bold`
- **Layout엔 세이프에어리어 패딩 없음**: 지도 같은 화면이 노치/홈바까지 꽉 차게 하려는 의도. 개별 UI만 필요시 `--safe-top` 등 직접 사용. 단, 일반 Safari 탭에서는 상태바 뒤까지 안 그려짐 — PWA 홈화면 추가나 Capacitor 빌드에서만 진짜 엣지-투-엣지로 보임
- **데스크톱 미리보기**: `Layout`이 `max-w-[430px]`로 모바일 비율 감싸줌
- **i18n**: `features/{도메인}/locales/{en,ko}.json`으로 네임스페이스 분리. 새 feature 추가 시 `shared/i18n/i18n.ts`에 네임스페이스 등록. 컴포넌트는 공유하고 텍스트만 분리하는 방식
- **폴더 구조**: 자세한 규칙은 [naming-convention.md](naming-convention.md) 참고
