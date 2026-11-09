interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description?: string
  cancelLabel: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  isPending?: boolean
}

/** 마이페이지 확인 팝업 (Figma: mypage/confirm dialog) - 로그아웃 / 회원 탈퇴 / 삭제 확인 */
export function ConfirmDialog({
  isOpen,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  isPending,
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-8" onClick={onCancel}>
      <div
        role="dialog"
        aria-modal="true"
        className="flex w-full max-w-[311px] flex-col gap-7 rounded-[14px] bg-white px-5 pt-7 pb-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-16 leading-[24px] font-medium tracking-[-0.32px] text-gray-700">{title}</p>
          {description && (
            <p className="text-14 leading-[20px] tracking-[-0.28px] whitespace-pre-line text-gray-500">{description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-[10px] bg-gray-100 pt-[14px] pb-[13px] text-14 leading-[20px] tracking-[-0.28px] text-gray-700"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 rounded-[10px] bg-gray-700 pt-[14px] pb-[13px] text-14 leading-[20px] tracking-[-0.28px] text-white disabled:opacity-60"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
