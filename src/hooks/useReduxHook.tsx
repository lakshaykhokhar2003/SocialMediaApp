import {useSelector} from "react-redux";

const useReduxHook = () => {
    const username = useSelector((state: { name: string }) => state.name)
    const email = useSelector((state: { email: string }) => state.email)
    const avatar = useSelector((state: { avatar: string }) => state.avatar)
    const bookmarks = useSelector((state: any) => state.bookmarks)
    const likedposts = useSelector((state: any) => state.likedposts)
    const myposts = useSelector((state: { myposts: string[] }) => state.myposts)
    const isAuthenticated = useSelector((state: { isAuthenticated: boolean }) => state.isAuthenticated)
    const encodedEmail = useSelector((state: { encodedEmail: string }) => state.encodedEmail)
    const myComments = useSelector((state: { myComments: string[] }) => state.myComments)

    return {username, email, avatar, bookmarks, likedposts, myposts, isAuthenticated, encodedEmail, myComments}

}

export default useReduxHook;