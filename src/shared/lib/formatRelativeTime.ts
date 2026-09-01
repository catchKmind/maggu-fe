import i18n from '../i18n/i18n'

const MINUTE = 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const MONTH = DAY * 30
const YEAR = DAY * 365

/** 서버가 내려주는 ISO date-time을 "2시간 전" 같은 상대 시간 문자열로. */
export function formatRelativeTime(isoDate: string): string {
  const diffSeconds = Math.round((Date.now() - new Date(isoDate).getTime()) / 1000)
  const rtf = new Intl.RelativeTimeFormat(i18n.language, { numeric: 'auto' })

  if (diffSeconds < MINUTE) return rtf.format(-diffSeconds, 'second')
  if (diffSeconds < HOUR) return rtf.format(-Math.round(diffSeconds / MINUTE), 'minute')
  if (diffSeconds < DAY) return rtf.format(-Math.round(diffSeconds / HOUR), 'hour')
  if (diffSeconds < MONTH) return rtf.format(-Math.round(diffSeconds / DAY), 'day')
  if (diffSeconds < YEAR) return rtf.format(-Math.round(diffSeconds / MONTH), 'month')
  return rtf.format(-Math.round(diffSeconds / YEAR), 'year')
}
