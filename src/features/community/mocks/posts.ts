import type { CommunityAuthor } from '../types'

const avatar = (seed: string) => `https://i.pravatar.cc/100?u=${seed}`

export const MOCK_CURRENT_USER: CommunityAuthor = {
  id: 'kekema_1',
  name: 'kekema_1',
  avatarUrl: avatar('kekema_1'),
}
