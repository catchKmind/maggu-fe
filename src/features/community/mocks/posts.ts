import type { CommunityAuthor, CommunityPost } from '../types'

const avatar = (seed: string) => `https://i.pravatar.cc/100?u=${seed}`
const placeholderPhoto = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`

export const MOCK_CURRENT_USER: CommunityAuthor = {
  id: 'kekema_1',
  name: 'kekema_1',
  avatarUrl: avatar('kekema_1'),
}

/**
 * 서버 연동 전까지 쓰는 임시 목업 데이터.
 */
export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: '1',
    author: { id: 'kekema_2', name: 'kekema_2', avatarUrl: avatar('kekema_2') },
    createdAgo: '2시간',
    content:
      '경주 당일치기 코스 공유해요! 황리단길 → 첨성대 → 동궁과 월지까지 걸어서 둘러봤는데 하루 코스로 딱 좋았어요! 여러분도 경주 와보세요!',
    photos: [],
    participantCount: 1,
    commentCount: 124,
    scrapCount: 124,
  },
  {
    id: '2',
    author: { id: 'kekema_3', name: 'kekema_3', avatarUrl: avatar('kekema_3') },
    createdAgo: '5시간',
    content:
      '울산 간절곶 일출 너무 예뻐요 새벽 5시쯤 도착했는데 이미 사진 찍는 분들이 많더라고요. 해뜨는 순간이 정말 예쁘고 근처 카페에서 아침 먹기에도 괜찮았어요.',
    photos: [placeholderPhoto('ganjeolgot-1'), placeholderPhoto('ganjeolgot-2'), placeholderPhoto('ganjeolgot-3')],
    participantCount: 1,
    commentCount: 124,
    scrapCount: 124,
  },
  {
    id: '3',
    author: { id: 'kekema_1', name: 'kekema_1', avatarUrl: avatar('kekema_1') },
    createdAgo: '1일',
    content: '통영 드라이브 코스 추천드립니다',
    photos: [],
    participantCount: 1,
    commentCount: 32,
    scrapCount: 41,
  },
]
