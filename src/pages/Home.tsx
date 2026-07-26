import { getPlatform } from '../lib/platform'

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">Maggu</h1>
      <p className="text-sm text-gray-500">platform: {getPlatform()}</p>
    </main>
  )
}
