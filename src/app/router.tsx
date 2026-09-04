import { createBrowserRouter, createHashRouter } from 'react-router-dom'
import { isNativeApp } from '../shared/lib/platform'
import Layout from './Layout'
import MapPage from '../pages/MapPage'
import CommunityPage from '../pages/CommunityPage'
import CommunitySearchPage from '../pages/CommunitySearchPage'
import MyPage from '../pages/MyPage'

const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <MapPage /> },
      { path: 'community', element: <CommunityPage /> },
      { path: 'community/search', element: <CommunitySearchPage /> },
      { path: 'my-page', element: <MyPage /> },
      // 라우트는 여기에 추가
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
