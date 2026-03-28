// src/hooks/usePostSocketEvents.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import socketService from '../services/socketService';
import { postApiSlice } from '../store/api/postApiSlice';

export default function usePostSocketEvents() {
  const dispatch = useDispatch();

  useEffect(() => {
    let socketInstance;
    
    const setupLivePosts = async () => {
      try {
        socketInstance = await socketService.connect();
        
        socketInstance.on('post_updated', ({ postId, action, data }) => {
          dispatch(postApiSlice.util.updateQueryData('getFeed', undefined, (draft) => {
            const post = draft.find(p => String(p._id) === String(postId));
            if (post) {
              if (action === 'like' && data?.likesCount !== undefined) {
                post.stats.likes = data.likesCount;
              } else if (action === 'comment_added') {
                post.stats.comments += 1;
              } else if (action === 'comment_deleted') {
                post.stats.comments = Math.max(0, post.stats.comments - 1);
              }
            }
          }));
        });

      } catch (error) {
        console.log('Erreur Socket Posts:', error);
      }
    };

    setupLivePosts();

    return () => {
      if (socketInstance) {
        socketInstance.off('post_updated');
      }
    };
  }, [dispatch]);
}