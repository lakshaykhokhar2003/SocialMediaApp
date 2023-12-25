interface CommentData {
    date: string;
    name: string;
    comment: string;
    avatar: string;

}

export interface PostData {
    comments: Record<string, CommentData>,
    date: string;
    description: string;
    likes: number;
    name: string;
    photo: string;
    post: string;
    id: string;
}