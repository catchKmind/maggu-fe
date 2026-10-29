import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMapSpot } from '../features/map/hooks/useMapSpot'
import { PhotoGrid } from '../shared/components/PhotoGrid'

/**
 * 로그인 없이 열리는 공개 장소 페이지 (/places/:contentId).
 *
 * 검색엔진·AI 크롤러가 장소마다 고유 URL로 접근할 수 있게 하려고 만든 페이지라,
 * 마크업을 의미 단위로 짠다: main > article > header(h1) / dl(항목명–값) / figure(사진).
 * 크롤러가 받는 첫 HTML(메타 태그, JSON-LD, 본문)은 Vercel 서버 함수(api/place-page.ts)가 채워 주고,
 * 이 컴포넌트는 사람 방문자에게 보여줄 화면을 담당한다.
 */
export default function PlacePage() {
  const { contentId } = useParams<{ contentId: string }>()
  const { t } = useTranslation('map')
  const { data: detail, isPending, isError } = useMapSpot(contentId ?? null)

  useEffect(() => {
    if (detail) document.title = `${detail.title} | Maggu`
  }, [detail])

  if (isPending) return <p className="p-5 text-14 text-gray-500">{t('placePage.loading')}</p>
  if (isError || !detail) {
    return (
      <main className="flex flex-col gap-4 p-5">
        <p className="text-16 text-gray-700">{t('placePage.error')}</p>
        <Link to="/" className="text-14 font-semibold text-gray-900 underline">
          {t('placePage.openMap')}
        </Link>
      </main>
    )
  }

  const rows = [
    { term: t('placePage.address'), value: detail.addr },
    { term: t('placePage.eventPeriod'), value: detail.eventPeriod },
    { term: t('placePage.hours'), value: detail.businessHours },
    { term: t('placePage.closedDays'), value: detail.closedDays },
    { term: t('placePage.phone'), value: detail.tel },
  ].filter((row): row is { term: string; value: string } => Boolean(row.value))

  return (
    <main className="flex flex-1 flex-col px-5 pt-[calc(var(--safe-top,0px)+24px)] pb-8">
      <article className="flex flex-col gap-5">
        <header>
          <p className="text-14 text-gray-500">{t(`placeDetail.contentType.${detail.contentType}`)}</p>
          <h1 className="mt-1 text-24 font-bold text-gray-900">{detail.title}</h1>
        </header>

        {detail.images.length > 0 && (
          <figure>
            <PhotoGrid photos={detail.images} className="h-[220px]" />
            <figcaption className="sr-only">{detail.title}</figcaption>
          </figure>
        )}

        {rows.length > 0 && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-14">
            {rows.map(({ term, value }) => (
              <div key={term} className="contents">
                <dt className="text-gray-500">{term}</dt>
                <dd className="text-gray-800">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        <Link
          to="/"
          className="mt-2 flex h-12 items-center justify-center rounded-xl bg-gray-900 text-16 font-semibold text-white"
        >
          {t('placePage.openMap')}
        </Link>
      </article>
    </main>
  )
}
