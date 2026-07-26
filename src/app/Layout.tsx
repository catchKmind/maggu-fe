import { Outlet } from 'react-router-dom'

/**
 * 공통 레이아웃. 화면(지도 등)은 세이프에어리어까지 꽉 채우고,
 * 노치/홈바를 피해야 하는 UI는 각 컴포넌트에서 --safe-top/--safe-bottom을 직접 사용.
 * 데스크톱 브라우저에서도 모바일 웹뷰 비율(max-w)로 보이도록 가운데 정렬.
 */
export default function Layout() {
  return (
    <div className="flex justify-center bg-gray-200">
      <div className="flex min-h-dvh w-full max-w-[430px] flex-col bg-white">
        <Outlet />
      </div>
    </div>
  )
}
