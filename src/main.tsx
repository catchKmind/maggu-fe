import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { defineCustomElements } from '@ionic/pwa-elements/loader'
import { router } from './app/router'
import './shared/i18n/i18n'
import './index.css'

// @capacitor/camera가 브라우저(웹)에서 카메라/갤러리 액션시트를 띄울 때 쓰는 폴리필.
// 네이티브(ios/android)로 감싸면 Capacitor가 자동으로 진짜 OS 액션시트를 쓰기 때문에
// 이 등록은 무시됨 — 브라우저에서 더 이상 테스트할 필요 없어지면
// 이 import + 아래 호출 + package.json의 @ionic/pwa-elements 의존성을 지워도 됨.
defineCustomElements(window)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60 * 1000 },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
