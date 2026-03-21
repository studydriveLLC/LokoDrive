import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import BottomSheet from '../ui/BottomSheet';
import { useAppTheme } from '../../theme/theme';

export default function DocumentViewerModal({ visible, onClose, resourceUrl }) {
  const theme = useAppTheme();
  
  if (!resourceUrl) return null;

  const viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(resourceUrl)}`;

  return (
    <BottomSheet isVisible={visible} onClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <WebView
          source={{ uri: viewerUrl }}
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          )}
        />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: { 
    height: 500, 
    width: '100%', 
    overflow: 'hidden', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20 
  },
  webview: { 
    flex: 1 
  },
  loader: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});