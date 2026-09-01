import { useState, type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid } from '@giphy/react-components'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useElementWidth } from '../hooks/useElementWidth'
import { makeFetchGifs } from './fetchGifs'

const SEARCH_DEBOUNCE_MS = 300

type OnGifClick = NonNullable<ComponentProps<typeof Grid>['onGifClick']>
export type Gif = Parameters<OnGifClick>[0]

interface GiphyPickerProps {
  onSelect: (gif: Gif) => void
}

export function GiphyPicker({ onSelect }: GiphyPickerProps) {
  const { t } = useTranslation()
  const [term, setTerm] = useState('')
  const debouncedTerm = useDebouncedValue(term, SEARCH_DEBOUNCE_MS)
  const { ref, width } = useElementWidth<HTMLDivElement>()

  return (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-3 pb-2">
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={t('bottomSheet.giphySearchPlaceholder')}
          className="h-10 w-full rounded-full bg-gray-50 px-4 text-14 text-gray-900 outline-none placeholder:text-gray-400"
        />
      </div>
      <div ref={ref} className="flex-1 overflow-y-auto px-4 pb-24">
        {width > 0 && (
          <Grid
            key={debouncedTerm}
            width={width}
            columns={3}
            gutter={6}
            fetchGifs={makeFetchGifs(debouncedTerm)}
            noLink
            onGifClick={(gif, e) => {
              e.preventDefault()
              onSelect(gif)
            }}
          />
        )}
      </div>
    </div>
  )
}
