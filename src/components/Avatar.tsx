import React from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getImageUrl } from '../utils/mediaUtils';
import { useThemeColor } from '../hooks/useThemeColor';

interface AvatarProps {
  user?: {
    full_name?: string;
    profile_picture?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md' }) => {
  const themeColors = useThemeColor();
  const getAvatarSize = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'sm': return 32;
      case 'lg': return 64;
      case 'xl': return 100;
      default: return 48;
    }
  };

  const avatarSize = getAvatarSize();


  const imageUrl = user?.profile_picture ? getImageUrl(user.profile_picture) : null;
  
  // Use user.profile_picture directly if it's a local file path or data URI that getImageUrl might have missed
  const finalImageSource = (user?.profile_picture && (
    user.profile_picture.startsWith('file://') || 
    user.profile_picture.startsWith('content://') ||
    user.profile_picture.startsWith('data:') ||
    user.profile_picture.startsWith('/') // absolute local path
  )) ? user.profile_picture : imageUrl;

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  return (
    <View style={[styles.container, { 
      width: avatarSize, 
      height: avatarSize, 
      borderRadius: avatarSize / 2,
      backgroundColor: themeColors.gray[200]
    }]}>
      {finalImageSource ? (
        <Image
          source={{ uri: finalImageSource }}
          style={{ width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }}
        />
      ) : (
        <View style={[styles.placeholder, { 
          width: avatarSize, 
          height: avatarSize, 
          borderRadius: avatarSize / 2,
          backgroundColor: themeColors.gray[200]
        }]}>
          {initials ? (
            <Text style={[styles.initials, { 
              fontSize: avatarSize / 2.5,
              color: themeColors.gray[600]
            }]}>{initials}</Text>
          ) : (
            <Ionicons name="person" size={avatarSize / 1.5} color={themeColors.gray[400]} />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: 'bold',
  },
});

export default Avatar;
