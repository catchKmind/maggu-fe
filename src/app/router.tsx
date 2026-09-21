import { createBrowserRouter, createHashRouter } from 'react-router-dom'
import { isNativeApp } from '../shared/lib/platform'
import Layout from './Layout'
import { RequireAuth, RedirectIfAuthed } from './routeGuards'
import MapPage from '../pages/MapPage'
import MapSearchPage from '../pages/MapSearchPage'
import CommunityPage from '../pages/CommunityPage'
import CommunitySearchPage from '../pages/CommunitySearchPage'
import CommunityComposePage from '../pages/CommunityComposePage'
import CommunityPostDetailPage from '../pages/CommunityPostDetailPage'
import MyPage from '../pages/MyPage'
import LoginPage from '../pages/LoginPage'

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'login',
        element: (
          <RedirectIfAuthed>
            <LoginPage />
          </RedirectIfAuthed>
        ),
      },
      {
        element: <RequireAuth />,
        children: [
          { index: true, element: <MapPage /> },
          { path: 'search', element: <MapSearchPage /> },
          { path: 'community', element: <CommunityPage /> },
          { path: 'community/search', element: <CommunitySearchPage /> },
          { path: 'community/write', element: <CommunityComposePage /> },
          { path: 'community/posts/:postId', element: <CommunityPostDetailPage /> },
          { path: 'my-page', element: <MyPage /> },
          // 라우트는 여기에 추가
        ],
      },
    ],
  },
]

/**
 * 웹: BrowserRouter / 네이티브 앱(웹뷰): HashRouter
 * 웹뷰에서는 서버가 없어 히스토리 라우팅이 깨질 수 있으므로 해시 라우팅 사용.
 */
export const router = isNativeApp()
  ? createHashRouter(routes)
  : createBrowserRouter(routes)
