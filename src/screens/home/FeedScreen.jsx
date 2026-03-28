import React, { useRef, useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, RefreshControl } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScrollToTop } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AnimatedHeader from '../../components/navigation/AnimatedHeader';
import PostCard from '../../components/feed/PostCard';
import SkeletonPostCard from '../../components/feed/SkeletonPostCard';
import CommentsModal from '../../components/feed/CommentsModal';
import PostDescriptionModal from '../../components/feed/PostDescriptionModal';
import ShareModal from '../../components/feed/ShareModal';
import PostOptionsModal from '../../components/feed/PostOptionsModal';
import ReportPostModal from '../../components/feed/ReportPostModal';
import SmartRefreshOverlay from '../../components/ui/SmartRefreshOverlay';

import { 
  useGetFeedQuery, 
  useToggleLikeMutation, 
  useDeletePostMutation, 
  useCreateRepostMutation 
} from '../../store/api/postApiSlice';
import { useHideUserMutation } from '../../store/api/socialApiSlice';
import { useAppTheme } from '../../theme/theme';
import { setScreenScrolled } from '../../store/slices/uiSlice';

import usePostSocketEvents from '../../hooks/usePostSocketEvents';
import socketService from '../../services/socketService';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "A l'instant";
  if (diffMins < 60) return `Il y a ${diffMins}min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays}j`;

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const mapPostFromBackend = (post) => {
  return {
    _id: post._id,
    author: {
      _id: post.author?._id,
      pseudo: post.author?.pseudo || 'Utilisateur',
      avatar: post.author?.avatar || null,
      hasBadge: post.author?.badgeType !== 'none' && post.author?.badgeType !== undefined,
      firstName: post.author?.firstName || '',
      lastName: post.author?.lastName || '',
      university: post.author?.university || '',
    },
    createdAt: formatDate(post.createdAt),
    content: post.content, 
    stats: post.stats || { likes: 0, comments: 0, shares: 0 },
    isLikedByMe: post.isLikedByMe || false,
    isRepost: post.isRepost || false,
    originalPost: post.originalPost,
    comments: post.comments || [],
  };
};

export default function FeedScreen({ navigation }) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  
  usePostSocketEvents();

  const scrollTrigger = useSelector((state) => state.ui.scrollState['PourToi']?.trigger || 0);
  
  const listRef = useRef(null);
  const prevTrigger = useRef(scrollTrigger);
  const isScrolledUI = useSharedValue(false);

  useScrollToTop(listRef);

  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const [activeDescPost, setActiveDescPost] = useState(null);
  const [activeSharePost, setActiveSharePost] = useState(null);
  const [activeOptionsPost, setActiveOptionsPost] = useState(null);
  const [activeReportPost, setActiveReportPost] = useState(null);
  
  const [refreshing, setRefreshing] = useState(false);
  const [isSmartRefreshing, setIsSmartRefreshing] = useState(false);

  const { data: posts = [], isLoading, isError, refetch } = useGetFeedQuery();
  const [toggleLike] = useToggleLikeMutation();
  const [deletePost] = useDeletePostMutation();
  const [createRepost] = useCreateRepostMutation();
  const [hideUser] = useHideUserMutation();

  const transformedPosts = posts.map(mapPostFromBackend);

  const updateScrollState = useCallback((isScrolled) => {
    dispatch(setScreenScrolled({ screenName: 'PourToi', isScrolled }));
  }, [dispatch]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      const currentlyScrolled = event.contentOffset.y > 200;
      
      if (isScrolledUI.value !== currentlyScrolled) {
        isScrolledUI.value = currentlyScrolled;
        runOnJS(updateScrollState)(currentlyScrolled);
      }
    },
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  useEffect(() => {
    if (scrollTrigger > prevTrigger.current) {
      prevTrigger.current = scrollTrigger;
      setIsSmartRefreshing(true);
      
      setTimeout(() => {
        try {
          if (listRef.current?.scrollToOffset) {
            listRef.current.scrollToOffset({ offset: 0, animated: true });
          } else if (listRef.current?.getNode?.()?.scrollToOffset) {
            listRef.current.getNode().scrollToOffset({ offset: 0, animated: true });
          }
        } catch (error) {
          console.log("Erreur de scroll silencieuse:", error);
        }
      }, 150);
      
      setTimeout(() => {
        setIsSmartRefreshing(false);
        isScrolledUI.value = false;
        updateScrollState(false); 
      }, 800);
    }
  }, [scrollTrigger, updateScrollState, isScrolledUI]);

  const handleLike = async (postId) => {
    try {
      const result = await toggleLike(postId).unwrap();
      const socket = socketService.getSocket();
      if (socket) {
        socket.emit('post_action', { 
          postId, 
          action: 'like', 
          data: { likesCount: result.likesCount } 
        });
      }
    } catch (error) { console.log('Erreur like:', error); }
  };

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId).unwrap();
      setActiveOptionsPost(null);
    } catch (error) { console.log('Erreur suppression:', error); }
  };

  const handleRepost = async (postId) => {
    try {
      await createRepost(postId).unwrap();
    } catch (error) { console.log('Erreur repartage:', error); }
  };

  const handleHideUser = async (authorId) => {
    if (!authorId) return;
    try {
      await hideUser(authorId).unwrap();
    } catch (error) { console.log('Erreur masquage utilisateur:', error); }
  };

  const renderContent = () => {
    if (isLoading && !posts.length) {
      return (
        <Animated.FlatList
          data={[1, 2, 3]}
          keyExtractor={(item) => item.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 140 + insets.top, paddingBottom: 100 }}
          renderItem={() => <SkeletonPostCard />}
        />
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: theme.colors.error }]}>Erreur lors du chargement</Text>
          <Text style={[styles.retryText, { color: theme.colors.primary }]} onPress={onRefresh}>Appuyez pour reessayer</Text>
        </View>
      );
    }

    if (!transformedPosts.length) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: theme.colors.textMuted }]}>Aucune publication pour le moment.</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textDisabled }]}>Soyez le premier a publier quelque chose !</Text>
        </View>
      );
    }

    return (
      <Animated.FlatList
        ref={listRef}
        data={transformedPosts}
        keyExtractor={(item) => item._id}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />}
        contentContainerStyle={{ paddingTop: 140 + insets.top, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            currentUserId={user?._id}
            onOpenComments={() => setActiveCommentPost(item)}
            onOpenDescription={() => setActiveDescPost(item)}
            onOpenShare={() => setActiveSharePost(item)}
            onOpenOptions={() => setActiveOptionsPost(item)}
            onLike={() => handleLike(item._id)}
          />
        )}
      />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AnimatedHeader scrollY={scrollY} title="Pour Toi" navigation={navigation} />
      <SmartRefreshOverlay isVisible={isSmartRefreshing} />
      {renderContent()}

      <CommentsModal 
        visible={!!activeCommentPost} 
        onClose={() => setActiveCommentPost(null)} 
        post={activeCommentPost} 
      />
      <PostDescriptionModal 
        visible={!!activeDescPost} 
        onClose={() => setActiveDescPost(null)} 
        author={activeDescPost?.author} 
        date={activeDescPost?.createdAt} 
        description={activeDescPost?.content?.text} 
      />
      <ShareModal 
        visible={!!activeSharePost} 
        onClose={() => setActiveSharePost(null)} 
        postId={activeSharePost?._id} 
      />
      <PostOptionsModal 
        visible={!!activeOptionsPost} 
        onClose={() => setActiveOptionsPost(null)} 
        isMyPost={activeOptionsPost?.author?._id === user?._id} 
        onDelete={() => handleDelete(activeOptionsPost?._id)}
        onRepost={() => handleRepost(activeOptionsPost?._id)}
        onHideUser={() => handleHideUser(activeOptionsPost?.author?._id)}
        onShareExternal={() => console.log('Ouvrir les options natives de partage')}
        onReport={() => {
          const postToReport = activeOptionsPost;
          setActiveOptionsPost(null);
          setTimeout(() => setActiveReportPost(postToReport), 300);
        }}
        onEdit={() => console.log('Ouvrir modal de modification')}
      />

      <ReportPostModal 
        visible={!!activeReportPost} 
        onClose={() => setActiveReportPost(null)} 
        post={activeReportPost} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 140, paddingHorizontal: 32 },
  errorText: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  retryText: { marginTop: 12, fontSize: 16, fontWeight: '500', padding: 10 },
  emptyText: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  emptySubtext: { marginTop: 8, fontSize: 14, textAlign: 'center' },
});