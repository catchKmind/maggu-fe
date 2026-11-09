import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Camera } from '@capacitor/camera'
import { MyPageHeader, HeaderTextButton } from '../features/mypage/components/MyPageHeader'
import { ProfileAvatar } from '../features/mypage/components/ProfileAvatar'
import { ProfilePhotoCropScreen } from '../features/mypage/components/ProfilePhotoCropScreen'
import { useMyAccount } from '../features/mypage/hooks/useMyAccount'
import { validateNickname, type NicknameError } from '../features/mypage/validateNickname'
import cameraIcon from '../assets/mypage/icon_camera.svg'
import xMarkIcon from '../assets/mypage/icon_x_mark_mini.svg'

const ERROR_KEYS: Record<NicknameError, string> = {
  tooShort: 'myPage.nicknameTooShort',
  tooLong: 'myPage.nicknameTooLong',
  invalidCharacter: 'myPage.nicknameInvalidCharacter',
  duplicated: 'myPage.nicknameDuplicated',
  forbidden: 'myPage.nicknameForbidden',
}

export default function MyProfileEditPage() {
  const { t } = useTranslation()
  const { data: account } = useMyAccount()

  // 입력 전에는 계정 닉네임을 그대로 보여준다.
  const [editedNickname, setEditedNickname] = useState<string | null>(null)
  const nickname = editedNickname ?? account?.nickname ?? ''
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  // 사진 보관함에서 고른 원본. 있으면 원형 자르기 화면을 띄운다.
  const [pickedSource, setPickedSource] = useState<string | null>(null)
  const [error, setError] = useState<NicknameError | null>(null)

  const handlePickPhoto = async () => {
    try {
      const { results } = await Camera.chooseFromGallery({ quality: 90 })
      const source = results[0]?.webPath ?? results[0]?.uri
      if (source) setPickedSource(source)
    } catch {
      // 사용자가 선택을 취소한 경우
    }
  }

  const handleSave = () => {
    const nextError = validateNickname(nickname)
    setError(nextError)
    if (nextError) return
    // TODO: 프로필 수정(닉네임·사진) API가 아직 없음. 생기면 저장 후 ['myAccount'] 무효화 → 이전 화면으로 이동.
    // 중복 닉네임 / 금칙어 오류도 그 API 응답으로 표시한다.
  }

  if (pickedSource) {
    return (
      <ProfilePhotoCropScreen
        source={pickedSource}
        onCancel={() => setPickedSource(null)}
        onConfirm={(photo) => {
          // TODO: 프로필 수정 API가 생기면 저장 시 이 Blob을 업로드한다.
          if (photoUrl) URL.revokeObjectURL(photoUrl)
          setPhotoUrl(URL.createObjectURL(photo))
          setPickedSource(null)
        }}
      />
    )
  }

  return (
    <div className="flex flex-1 flex-col pt-[var(--safe-top,0px)]">
      <MyPageHeader title={t('myPage.editProfile')} action={<HeaderTextButton onClick={handleSave}>{t('myPage.save')}</HeaderTextButton>} />

      <section className="flex flex-col items-center gap-3 pt-8 pb-7">
        <div className="relative size-[88px]">
          <ProfileAvatar size={88} src={photoUrl} />
          <button
            type="button"
            onClick={handlePickPhoto}
            aria-label={t('myPage.changePhoto')}
            className="absolute top-[58px] left-[58px] rounded-full border-2 border-white bg-gray-50 p-2"
          >
            <img src={cameraIcon} alt="" className="size-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={() => setPhotoUrl(null)}
          className="text-14 leading-[20px] tracking-[-0.28px] text-gray-400 underline underline-offset-4"
        >
          {t('myPage.resetPhoto')}
        </button>
      </section>

      <section className="flex flex-col gap-3 py-[18px]">
        <label htmlFor="nickname" className="px-4 text-14 leading-[20px] tracking-[-0.28px] text-gray-500">
          {t('myPage.nickname')}
        </label>
        <div className="px-4">
          <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-[10px] py-3">
            <input
              id="nickname"
              value={nickname}
              onChange={(e) => {
                setEditedNickname(e.target.value)
                setError(null)
              }}
              className="min-w-0 flex-1 bg-transparent text-14 leading-[20px] tracking-[-0.28px] text-gray-700 caret-purple-400 outline-none"
            />
            {nickname && (
              <button type="button" onClick={() => setEditedNickname('')} aria-label={t('myPage.clearNickname')}>
                <img src={xMarkIcon} alt="" className="size-4" />
              </button>
            )}
          </div>
          {error && (
            <p className="mt-[6px] pl-[2px] text-12 leading-[18px] tracking-[-0.24px] text-[#df0303]">{t(ERROR_KEYS[error])}</p>
          )}
        </div>
      </section>
    </div>
  )
}
