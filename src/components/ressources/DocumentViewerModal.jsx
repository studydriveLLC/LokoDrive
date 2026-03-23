import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import BottomSheet from '../ui/BottomSheet';
import { useAppTheme } from '../../theme/theme';

export default function DocumentViewerModal({ visible, onClose, resourceUrl }) {
  const theme = useAppTheme();
  const [retryKey, setRetryKey] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (visible) {
      setRetryKey(1);
      setIsLoading(true);
    }
  }, [visible]);

  if (!resourceUrl) return null;

  const secureUrl = resourceUrl.replace('http://', 'https://');
  const urlWithoutParams = secureUrl.split('?')[0];

  const isImage = urlWithoutParams.match(/\.(jpeg|jpg|png|gif)$/i) || secureUrl.includes('image');
  
  let viewerUrl = secureUrl;
  if (!isImage) {
    viewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(secureUrl)}`;
  }

  const handleWebViewError = () => {
    setTimeout(() => {
      setRetryKey(prev => prev + 1);
    }, 1000);
  };

  return (
    <BottomSheet isVisible={visible} onClose={onClose}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {isImage ? (
          <Image 
            source={{ uri: viewerUrl }} 
            style={styles.imageViewer} 
            resizeMode="contain"
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
          />
        ) : (
          <WebView
            key={retryKey}
            source={{ uri: viewerUrl }}
            style={[styles.webview, { backgroundColor: theme.colors.surface }]}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            mixedContentMode="always"
            thirdPartyCookiesEnabled={true}
            sharedCookiesEnabled={true}
            originWhitelist={['*']}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            renderLoading={() => null} 
            onError={handleWebViewError}
            onHttpError={handleWebViewError}
          />
        )}
        
        {isLoading && (
          <View style={[styles.loader, { backgroundColor: theme.colors.surface }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        )}
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
  imageViewer: {
    flex: 1,
    width: '100%',
    height: '100%'
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