import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '../features/community/api/posts'
import { pickPhotoFromGallery, takePostPhoto } from '../features/community/hooks/usePickPostPhoto'
import { uploadFile } from '../features/uploads/uploadFile'
import { LocationPickerSheet } from '../features/community/components/LocationPickerSheet'
import { GifPickerSheet } from '../features/community/components/GifPickerSheet'
import { StickerPickerSheet } from '../features/community/components/StickerPickerSheet'
import type { PostCategory } from '../features/community/api/posts.types'
import type { PostLocation } from '../features/community/types'
import galleryIcon from '../assets/community/icon_community_gallery.svg'
import cameraIcon from '../assets/community/icon_community_camera.svg'
import gifIcon from '../assets/community/icon_community_gif.svg'
import stickerIcon from '../assets/community/icon_community_stiker.svg'

const CONTENT_MAX_LENGTH = 500
const MAX_PHOTOS = 4

/** 목업에 카테고리 선택 UI가 없어서 고정값으로 보냄 */
const DEFAULT_CATEGORY: PostCategory = 'RECOMMEND'

interface ComposedPhoto {
  id: string
  previewUrl: string
  /** 갤러리/카메라로 고른 사진 — 완료를 누를 때 업로드할 원본 파일 (스티커/GIF는 없음) */
  blob?: Blob
  /** 스티커/GIF는 이미 완전한 URL이라 업로드 없이 바로 이 값을 보냄 */
  value?: string
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4.5 4.5l11 11M15.5 4.5l-11 11" stroke="#171717" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function RemovePhotoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="#171717" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 14.5s5-4.2 5-8.2a5 5 0 1 0-10 0c0 4 5 8.2 5 8.2Z"
        stroke="#A3A3A3"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.3" r="1.8" stroke="#A3A3A3" strokeWidth="1.3" />
    </svg>
  )
}

export default function CommunityComposePage() {
  const { t } = useTranslation('community')
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [content, setContent] = useState('')
  const [photos, setPhotos] = useState<ComposedPhoto[]>([])
  const [location, setLocation] = useState<PostLocation | null>(null)
  const [isPickingPhoto, setIsPickingPhoto] = useState(false)
  const [photoError, setPhotoError] = useState(false)
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false)
  const [isGifSheetOpen, setIsGifSheetOpen] = useState(false)
  const [isStickerSheetOpen, setIsStickerSheetOpen] = useState(false)

  const canAddPhoto = photos.length < MAX_PHOTOS && !isPickingPhoto

  const addPhoto = (photo: ComposedPhoto, resolvedLocation?: PostLocation | null) => {
    setPhotos((prev) => (prev.length >= MAX_PHOTOS ? prev : [...prev, photo]))
    if (resolvedLocation && !location) setLocation(resolvedLocation)
  }

  const removePhoto = (id: string) => {
    setPhotos((prev) => {
      const next = prev.filter((p) => p.id !== id)
      if (next.length === 0) setLocation(null)
      return next
    })
  }

  const handlePickFromGallery = async () => {
    if (!canAddPhoto) return
    setIsPickingPhoto(true)
    setPhotoError(false)
    try {
      const result = await pickPhotoFromGallery()
      addPhoto({ id: crypto.randomUUID(), previewUrl: result.previewUrl, blob: result.blob }, result.location)
    } catch (e) {
      // 사진 업로드시 사용자가 선택을 취소한 경우 제외 그 에러 메세지 하단에 표시
      if (!(e instanceof Error && /cancel/i.test(e.message))) setPhotoError(true)
    } finally {
      setIsPickingPhoto(false)
    }
  }

  const handleTakePhoto = async () => {
    if (!canAddPhoto) return
    setIsPickingPhoto(true)
    setPhotoError(false)
    try {
      const result = await takePostPhoto()
      addPhoto({ id: crypto.randomUUID(), previewUrl: result.previewUrl, blob: result.blob }, result.location)
    } catch (e) {
      if (!(e instanceof Error && /cancel/i.test(e.message))) setPhotoError(true)
    } finally {
      setIsPickingPhoto(false)
    }
  }

  const createMutation = useMutation({
    // 사진 실제 업로드는 여기(완료를 눌렀을 때)에서만 일어난다 — 고를 때는 화면에 미리보기만 채워둠
    mutationFn: async () => {
      const imageUrls = await Promise.all(
        photos.map((photo) => (photo.value ? photo.value : uploadFile(photo.blob!, 'POST'))),
      )
      return createPost({
        content,
        category: DEFAULT_CATEGORY,
        imageUrls,
        ...(photos.length > 0 && location
          ? {
              placeName: location.placeName,
              latitude: location.lat,
              longitude: location.lng,
              locationSource: location.source,
            }
          : {}),
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityFeed'] })
      navigate('/community')
    },
  })

  const needsLocation = photos.length > 0 && location === null
  const canSubmit = content.trim().length > 0 && !needsLocation && !createMutation.isPending

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between px-4 pt-[calc(var(--safe-top)+12px)] pb-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label={t('compose.cancel')}
          className="flex h-9 w-9 shrink-0 items-center justify-center"
        >
          <CloseIcon />
        </button>
        <button
          type="button"
          onClick={() => createMutation.mutate()}
          disabled={!canSubmit}
          className="text-15 font-semibold text-purple-500 disabled:text-gray-300"
        >
          {createMutation.isPending ? t('compose.posting') : t('compose.submit')}
        </button>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={CONTENT_MAX_LENGTH}
        placeholder={t('compose.placeholder')}
        autoFocus
        className="flex-1 resize-none px-5 py-3 text-14 text-gray-900 outline-none placeholder:text-gray-400"
      />

      {photos.length > 0 && (
        <div className="flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {photos.map((photo) => (
            <div key={photo.id} className="relative h-[110px] w-[110px] shrink-0 overflow-hidden rounded-xl bg-gray-50">
              <img src={photo.previewUrl} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                aria-label={t('compose.removePhoto')}
                className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white/90"
              >
                <RemovePhotoIcon />
              </button>
            </div>
          ))}
        </div>
      )}

      {photoError && <p className="px-5 pb-2 text-13 text-red-500">{t('compose.photoError')}</p>}

      {photos.length > 0 && (
        <button
          type="button"
          onClick={() => setIsLocationSheetOpen(true)}
          className="flex items-center gap-1.5 px-5 pb-3 text-14 text-gray-500"
        >
          <PinIcon />
          {location ? location.placeName : t('compose.location')}
        </button>
      )}

      <div className="flex items-center gap-5 border-t border-gray-100 px-5 py-3 pb-[calc(var(--safe-bottom)+12px)]">
        <button type="button" onClick={handlePickFromGallery} disabled={!canAddPhoto} aria-label={t('compose.gallery')} className="disabled:opacity-40">
          <img src={galleryIcon} alt="" className="h-6 w-6" />
        </button>
        <button type="button" onClick={() => setIsStickerSheetOpen(true)} disabled={photos.length >= MAX_PHOTOS} aria-label={t('compose.sticker')} className="disabled:opacity-40">
          <img src={stickerIcon} alt="" className="h-6 w-6" />
        </button>
        <button type="button" onClick={handleTakePhoto} disabled={!canAddPhoto} aria-label={t('compose.camera')} className="disabled:opacity-40">
          <img src={cameraIcon} alt="" className="h-6 w-6" />
        </button>
        <button type="button" onClick={() => setIsGifSheetOpen(true)} disabled={photos.length >= MAX_PHOTOS} aria-label={t('compose.gif')} className="disabled:opacity-40">
          <img src={gifIcon} alt="" className="h-6 w-6" />
        </button>
      </div>

      {createMutation.isError && <p className="px-5 pb-3 text-13 text-red-500">{t('compose.error')}</p>}

      <LocationPickerSheet
        isOpen={isLocationSheetOpen}
        onSelect={(loc) => {
          setLocation(loc)
          setIsLocationSheetOpen(false)
        }}
        onClose={() => setIsLocationSheetOpen(false)}
      />
      <GifPickerSheet
        isOpen={isGifSheetOpen}
        onSelect={(gif) =>
          addPhoto({ id: crypto.randomUUID(), previewUrl: gif.images.original.url, value: gif.images.original.url })
        }
        onClose={() => setIsGifSheetOpen(false)}
      />
      <StickerPickerSheet
        isOpen={isStickerSheetOpen}
        onSelect={(sticker) =>
          addPhoto({ id: crypto.randomUUID(), previewUrl: sticker.imageUrl, value: sticker.imageUrl })
        }
        onClose={() => setIsStickerSheetOpen(false)}
      />
    </div>
  )
}
