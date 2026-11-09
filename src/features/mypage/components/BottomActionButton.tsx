interface BottomActionButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

/** 편집 모드 하단 고정 버튼 (Figma: btn - 선택한 스티커/리스트 삭제) */
export function BottomActionButton({ label, onClick, disabled }: BottomActionButtonProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-[430px] px-4 pb-[calc(var(--safe-bottom)+34px)]">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="h-12 w-full rounded-xl bg-gray-700 text-16 leading-[26px] font-medium tracking-[-0.32px] text-white disabled:bg-gray-200 disabled:text-gray-400"
      >
        {label}
      </button>
    </div>
  )
}
