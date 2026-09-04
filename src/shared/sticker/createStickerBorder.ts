interface CreateStickerBorderOptions {
  /** 테두리 두께(px) */
  borderWidth?: number
  borderColor?: string
  /** 테두리를 그릴 때 원 둘레를 몇 등분해서 오프셋 드로잉할지 (많을수록 매끈하지만 느려짐) */
  steps?: number
}

const DEFAULTS: Required<CreateStickerBorderOptions> = {
  borderWidth: 12,
  borderColor: '#ffffff',
  steps: 24,
}

function get2dContext(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d canvas context를 가져오지 못했습니다')
  return ctx
}

/**
 * 투명 배경 컷아웃 이미지에 스티커 느낌의 다이컷 테두리를 그려 넣는다.
 *
 * 1) 알파 실루엣을 단색(borderColor)으로 채우고
 * 2) 그 실루엣을 원 둘레를 따라 여러 번 오프셋해서 그려 팽창(dilate) 효과를 낸 뒤
 * 3) 원본 이미지를 다시 위에 덮어서 안쪽은 사진 그대로, 바깥 고리만 단색 테두리로 남긴다.
 */
export async function createStickerBorder(
  cutout: Blob,
  options: CreateStickerBorderOptions = {},
): Promise<Blob> {
  const { borderWidth, borderColor, steps } = { ...DEFAULTS, ...options }
  const bitmap = await createImageBitmap(cutout)

  const width = bitmap.width + borderWidth * 2
  const height = bitmap.height + borderWidth * 2
  const offset = borderWidth

  const silhouette = document.createElement('canvas')
  silhouette.width = width
  silhouette.height = height
  const silhouetteCtx = get2dContext(silhouette)
  silhouetteCtx.drawImage(bitmap, offset, offset)
  silhouetteCtx.globalCompositeOperation = 'source-in'
  silhouetteCtx.fillStyle = borderColor
  silhouetteCtx.fillRect(0, 0, width, height)

  const output = document.createElement('canvas')
  output.width = width
  output.height = height
  const outputCtx = get2dContext(output)

  for (let i = 0; i < steps; i++) {
    const angle = (i / steps) * Math.PI * 2
    const dx = Math.round(Math.cos(angle) * borderWidth)
    const dy = Math.round(Math.sin(angle) * borderWidth)
    outputCtx.drawImage(silhouette, dx, dy)
  }

  outputCtx.drawImage(bitmap, offset, offset)

  return new Promise((resolve, reject) => {
    output.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('스티커 이미지를 인코딩하지 못했습니다'))
    }, 'image/png')
  })
}
