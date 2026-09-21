interface SpotMarkerProps {
  isOngoingEvent?: boolean
  onClick?: () => void
}

/** 관광지 스팟 핀. isOngoingEvent면 진행중인 축제/공연/행사 배지(🔥)를 붙인다. */
export function SpotMarker({ isOngoingEvent, onClick }: SpotMarkerProps) {
  return (
    <button type="button" onClick={onClick} className="relative flex h-8 w-8 items-center justify-center">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M16 30S5 20.4 5 12.5a11 11 0 1 1 22 0C27 20.4 16 30 16 30Z"
          fill="#5b6cff"
          stroke="white"
          strokeWidth="2"
        />
        <circle cx="16" cy="12.5" r="4" fill="white" />
      </svg>
      {isOngoingEvent && <span className="absolute -top-1 -right-1 text-[14px] leading-none">🔥</span>}
    </button>
  )
}
