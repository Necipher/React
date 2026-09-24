import { useState, useEffect } from 'react';
import style from './Post.module.css'
import { useNavigate } from 'react-router';
import { usePostContext } from "../context/PostContext";


const Post = ({ avatar_url, content, handle, username, photo, public_id, created_at, isOwner }) => {
    const navigate = useNavigate();
    const [localContent, setLocalContent] = useState(content)
    const { deleteAPost, updateAPost } = usePostContext();
    // Toggles
    const [isOptionMenuOn, setisOptionMenuOn] = useState(false);
    const [isEditOn, setIsEditOn] = useState(false);
    // Variables
    const time = new Date(created_at).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })

    function useDismiss(isOpen, setIsOpen) {
        useEffect(() => {
            if (!isOpen) return;

            function close() { setIsOpen(false) };
            function onKeyDown(e) { e.key === 'Escape' && close() };

            document.addEventListener('click', close);
            document.addEventListener('keydown', onKeyDown)

            return () => {
                document.removeEventListener('click', close);
                document.removeEventListener('keydown', onKeyDown);
            }
        }, [isOpen])
    }

    useDismiss(isOptionMenuOn, setisOptionMenuOn);
    useDismiss(isEditOn, setIsEditOn);

    // Button will later also be added for non users so they can quickly interact with the post
    const menuItems = [
        { label: 'Delete Post', action: () => { deleteAPost({ postId: public_id }); navigate('/') } },
        { label: 'Edit Post', action: () => { setisOptionMenuOn(false); setIsEditOn(true) } }
    ]

    function goToProfile(e) {
        e.stopPropagation();
        navigate(`/${handle}`)
    }

    function optionButtonPress(e) {
        e.stopPropagation();
        setisOptionMenuOn(!isOptionMenuOn)
    }

    return (
        <div className={style.postLayout} onClick={(e) => { e.stopPropagation(); navigate(`/${handle}/status/${public_id}`) }}>
            {isOwner && <button className={style.optionButton} onClick={optionButtonPress}>...</button>}
            {isOptionMenuOn && <div className={style.optionMenu} onClick={(e) => e.stopPropagation()}>
                {menuItems.map((button) => <button key={button.label} onClick={button.action}>{button.label}</button>)}
            </div>}

            <img src={avatar_url} className={style.profilePicture} onClick={goToProfile} />
            <div className={style.profileName} onClick={goToProfile}>
                <h1 className={style.nickname}>{username}</h1>
                <h4 className={style.handle}>@{handle}</h4>
            </div>
            {isEditOn ?
                <input value={localContent} onChange={(e) => setLocalContent(e.target.value)} /> :
                <h2 className={style.post}>{content}{photo ? <img className={style.photo} src={photo} /> : ''}</h2>
            }

            <div className={style.operations}>
                <button className={style.operationButton}>A</button>
                <button className={style.operationButton}>B</button>
                <button className={style.operationButton}>C</button>
                <button className={style.operationButton}>D</button>
            </div>
        </div >

    )
}

export default Post
