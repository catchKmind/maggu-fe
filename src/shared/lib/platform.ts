import { Capacitor } from '@capacitor/core'

/**
 * 플랫폼 분기 유틸.
 * 네이티브 기능(카메라, 푸시 등)을 쓸 때 이 모듈을 통해 분기한다.
 */
export const isNativeApp = () => Capacitor.isNativePlatform()

export const getPlatform = (): 'web' | 'ios' | 'android' =>
  Capacitor.getPlatform() as 'web' | 'ios' | 'android'
