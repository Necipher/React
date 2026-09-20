import { createContext, useContext } from "react";
import usePost from "../hooks/usePost";

const PostContext = createContext(null);

export function PostProvider({ children }) {
    const post = usePost();

    return (
        <PostContext.Provider value={post}>
            {children}
        </PostContext.Provider>
    )
}

export function usePostContext() {
    const ctx = useContext(PostContext);
    if (!ctx) { throw new Error("usePostContext need to be used inside HookProvider") };
    return ctx
}
