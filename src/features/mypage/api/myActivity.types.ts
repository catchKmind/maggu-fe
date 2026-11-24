/** 커서 방식 페이지. hasNext가 true면 nextCursor를 다음 요청의 cursor로 보낸다 */
export interface CursorPage<T> {
  content: T[]
  nextCursor: string | null
  hasNext: boolean
}

export interface GetMyActivityParams {
  cursor?: string
  size?: number
}

export interface MyPostResponse {
  postId: number
  /** 대표 이미지. 사진 없는 글이면 null */
  imageUrl: string | null
  /** 본문 전체. 사진 없는 글은 FE가 잘라서 보여준다 */
  content: string
}

export interface MyPostListResponse {
  /** 내가 쓴 글 수 (페이지와 무관) */
  postCount: number
  /** 내가 쓴 댓글 수 (페이지와 무관) */
  commentCount: number
  posts: CursorPage<MyPostResponse>
}

export interface MyCommentResponse {
  commentId: number
  postId: number
  /** 원본 게시글 작성자 닉네임 */
  postWriterNickname: string
  content: string
  createdAt: string
  isReply: boolean
}

export interface MyCommentListResponse {
  postCount: number
  commentCount: number
  comments: CursorPage<MyCommentResponse>
}
