import { useCallback, useState } from 'react'

const STORAGE_KEY = 'maggu-hidden-comments'

type HiddenByPost = Record<string, number[]>

function readAll(): HiddenByPost {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as HiddenByPost
  } catch {
    return {}
  }
}

/**
 * 게시글 작성자가 숨긴 댓글 목록.
 * TODO: 댓글 숨김 API(필드 + 엔드포인트)가 아직 없어서 지금은 이 기기(브라우저)에만 저장한다.
 * 그래서 다른 사용자·다른 기기에는 숨겨지지 않는다. API가 생기면 이 훅만 서버 연동으로 바꾸면 된다.
 */
export function useHiddenComments(postId: number) {
  const [hiddenIds, setHiddenIds] = useState<Set<number>>(() => new Set(readAll()[postId] ?? []))

  const toggleHidden = useCallback(
    (commentId: number) => {
      setHiddenIds((prev) => {
        const next = new Set(prev)
        if (next.has(commentId)) next.delete(commentId)
        else next.add(commentId)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readAll(), [postId]: [...next] }))
        } catch {
          // 저장소를 못 쓰는 환경이면 이번 화면에서만 숨겨진다
        }
        return next
      })
    },
    [postId],
  )

  return { hiddenIds, toggleHidden }
}
