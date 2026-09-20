import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '../features/community/api/posts'
import type { PostCategory } from '../features/community/api/posts.types'

const CONTENT_MAX_LENGTH = 500

const CATEGORIES: { key: PostCategory; labelKey: string }[] = [
  { key: 'RECOMMEND', labelKey: 'compose.recommend' },
  { key: 'INFO', labelKey: 'compose.info' },
  { key: 'CURATION', labelKey: 'compose.curation' },
]

export default function CommunityComposePage() {
  const { t } = useTranslation('community')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<PostCategory>('RECOMMEND')

  const createMutation = useMutation({
    mutationFn: () => createPost({ content, category }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityFeed'] })
      navigate('/community')
    },
  })

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <button type="button" onClick={() => navigate(-1)} className="text-14 text-gray-500">
          {t('compose.cancel')}
        </button>
        <span className="text-16 font-semibold text-gray-900">{t('write')}</span>
        <button
          type="button"
          onClick={() => createMutation.mutate()}
          disabled={content.trim().length === 0 || createMutation.isPending}
          className="text-14 font-semibold text-purple-500 disabled:opacity-40"
        >
          {t('compose.submit')}
        </button>
      </div>

      <div className="flex gap-2 px-4 py-3">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCategory(c.key)}
            className={`rounded-full px-4 py-2 text-14 transition-colors ${
              category === c.key
                ? 'border border-purple-500 font-semibold text-purple-500'
                : 'border border-transparent font-medium text-gray-500'
            }`}
          >
            {t(c.labelKey)}
          </button>
        ))}
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={CONTENT_MAX_LENGTH}
        placeholder={t('compose.placeholder')}
        autoFocus
        className="flex-1 resize-none px-5 py-3 text-14 text-gray-900 outline-none placeholder:text-gray-400"
      />

      {createMutation.isError && <p className="px-5 pb-3 text-13 text-red-500">{t('compose.error')}</p>}
    </div>
  )
}
