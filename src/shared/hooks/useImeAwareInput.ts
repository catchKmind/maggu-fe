import { useRef, useState, type ChangeEvent, type CompositionEvent } from 'react'

/**
 * 한글처럼 자모 조합이 있는 입력은 조합이 끝난 시점(compositionend)에만
 * committedValue를 갱신하고, 영어처럼 조합이 없는 입력은 매 입력마다 바로 반영한다.
 * "ㅇ", "아", "안" 같은 조합 중간 상태로 검색 API가 나가는 걸 막기 위함.
 * value(입력창에 보이는 값)는 조합 중에도 매번 갱신되어 타이핑은 그대로 부드럽게 보인다.
 */
export function useImeAwareInput(initialValue = '') {
  const [value, setValueState] = useState(initialValue)
  const [committedValue, setCommittedValue] = useState(initialValue)
  const isComposingRef = useRef(false)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value
    setValueState(next)
    if (!isComposingRef.current) setCommittedValue(next)
  }

  const onCompositionStart = () => {
    isComposingRef.current = true
  }

  const onCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    isComposingRef.current = false
    setCommittedValue(e.currentTarget.value)
  }

  const setValue = (next: string) => {
    setValueState(next)
    setCommittedValue(next)
  }

  return { value, committedValue, setValue, onChange, onCompositionStart, onCompositionEnd }
}
