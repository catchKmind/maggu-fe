/**
 * 사진을 긴 변 maxSide 픽셀 이하로 줄인다 (이미 작으면 그대로 돌려준다).
 * 스마트폰 사진(1,000만 화소 이상)을 그대로 처리하면 누끼와 테두리 계산이 아주 느려서, 처리 전에 먼저 줄인다.
 * 사진 방향(EXIF)은 createImageBitmap이 알아서 반영한다.
 */
export async function resizeImage(source: Blob | string, maxSide: number, type: 'image/jpeg' | 'image/png'): Promise<Blob> {
  const blob = typeof source === 'string' ? await fetch(source).then((res) => res.blob()) : source
  const bitmap = await createImageBitmap(blob)

  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  if (scale === 1) {
    bitmap.close()
    return blob
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(bitmap.width * scale))
  canvas.height = Math.max(1, Math.round(bitmap.height * scale))
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    throw new Error('2d canvas context를 가져오지 못했습니다')
  }
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('이미지를 줄이지 못했습니다'))),
      type,
      type === 'image/jpeg' ? 0.92 : undefined,
    )
  })
}
