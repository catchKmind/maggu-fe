// TODO: '내가 쓴 글' / '내가 쓴 댓글' 조회 API가 나오면 이 목업을 지우고 useQuery로 교체.

export interface MyPostItem {
  postId: number
  title: string
  thumbnailUrl: string | null
}

export interface MyCommentItem {
  commentId: number
  postId: number
  content: string
  isReply: boolean
  postAuthorNickname: string
  createdAt: string
}

export const MOCK_MY_POSTS: MyPostItem[] = [
  { postId: 21, title: '경주 첨성대 야경', thumbnailUrl: 'https://picsum.photos/seed/maggu-post-1/400/400' },
  { postId: 20, title: '부산 감천문화마을 다녀왔어요! 골목마다 색이 예뻐서 사진 찍기 좋았어요', thumbnailUrl: null },
  { postId: 18, title: '제주 협재해변', thumbnailUrl: 'https://picsum.photos/seed/maggu-post-2/400/400' },
  { postId: 15, title: '전주 한옥마을 맛집 추천', thumbnailUrl: null },
  { postId: 12, title: '강릉 안목해변 카페거리', thumbnailUrl: 'https://picsum.photos/seed/maggu-post-3/400/400' },
  { postId: 9, title: '여수 밤바다', thumbnailUrl: 'https://picsum.photos/seed/maggu-post-4/400/400' },
]

export const MOCK_MY_COMMENTS: MyCommentItem[] = [
  {
    commentId: 301,
    postId: 21,
    content: '사진 너무 예쁘네요! 어디서 찍으셨나요?',
    isReply: false,
    postAuthorNickname: '여행하는곰',
    createdAt: '2026-11-12T09:30:00',
  },
  {
    commentId: 298,
    postId: 18,
    content: '저도 지난달에 다녀왔는데 물 색이 정말 잊히지 않아요. 다음에 또 가고 싶어요.',
    isReply: true,
    postAuthorNickname: '바다좋아',
    createdAt: '2026-11-10T21:05:00',
  },
  {
    commentId: 280,
    postId: 15,
    content: '여기 웨이팅 길던데 평일에 가면 괜찮을까요?',
    isReply: false,
    postAuthorNickname: '먹방러',
    createdAt: '2026-11-03T13:12:00',
  },
  {
    commentId: 261,
    postId: 12,
    content: '정보 감사합니다 :)',
    isReply: true,
    postAuthorNickname: '커피한잔',
    createdAt: '2026-10-28T18:44:00',
  },
]
