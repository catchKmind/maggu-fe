const TIME_RANGE = /(\d{1,2}):(\d{2})\s*[~-]\s*(\d{1,2}):(\d{2})/g

export interface OpeningStatus {
  isOpen: boolean
  /** 열려 있으면 닫는 시각, 닫혀 있으면 여는 시각 (HH:MM) */
  time: string
}

/**
 * businessHours 문자열에서 운영 상태를 뽑는다.
 * 실제 데이터가 "09:00~18:00", "08:00~22:00 (마지막 주문 21:30)",
 * "- 평일 08:30~18:00- 주말 08:30~17:00", "※ 전화문의 요망"처럼 제각각이라,
 * 시간 범위가 정확히 하나일 때만 판단하고 애매하면 null을 돌려준다.
 */
export function parseOpeningStatus(businessHours: string | null, now = new Date()): OpeningStatus | null {
  if (!businessHours) return null

  const matches = [...businessHours.matchAll(TIME_RANGE)]
  if (matches.length !== 1) return null

  const [, openH, openM, closeH, closeM] = matches[0]
  const openMinutes = Number(openH) * 60 + Number(openM)
  const closeMinutes = Number(closeH) * 60 + Number(closeM)
  const nowMinutes = now.getHours() * 60 + now.getMinutes()

  // 새벽에 닫는 가게(예: 18:00~02:00)는 자정을 넘어가므로 따로 판단
  const isOpen =
    closeMinutes > openMinutes
      ? nowMinutes >= openMinutes && nowMinutes < closeMinutes
      : nowMinutes >= openMinutes || nowMinutes < closeMinutes

  const pad = (h: string, m: string) => `${h.padStart(2, '0')}:${m}`
  return { isOpen, time: isOpen ? pad(closeH, closeM) : pad(openH, openM) }
}
