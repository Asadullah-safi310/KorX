import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';
import { AppText } from './AppText';

interface PersonCardProps {
  person: any;
  onPress: () => void;
}

const PersonCard = ({ person, onPress }: PersonCardProps) => {
  const themeColors = useThemeColor();
  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: themeColors.card, borderColor: themeColors.border }]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <View style={[styles.avatar, { backgroundColor: themeColors.primary + '10' }]}>
        <AppText weight="bold" color={themeColors.primary} style={{ fontSize: 22 }}>
          {person.full_name ? person.full_name.charAt(0).toUpperCase() : '?'}
        </AppText>
      </View>
      
      <View style={styles.content}>
        <AppText variant="title" weight="bold" numberOfLines={1}>
          {person.full_name || person.username || 'Unnamed'}
        </AppText>
        
        <View style={styles.details}>
          {person.phone && (
            <View style={styles.detailItem}>
              <Ionicons name="call" size={12} color={themeColors.primary} />
              <AppText variant="caption" weight="medium" color={themeColors.subtext}>{person.phone}</AppText>
            </View>
          )}
          {person.email && (
            <View style={styles.detailItem}>
              <Ionicons name="mail" size={12} color={themeColors.primary} />
              <AppText variant="caption" weight="medium" color={themeColors.subtext} numberOfLines={1}>{person.email}</AppText>
            </View>
          )}
        </View>
      </View>
      
      <View style={[styles.actionBadge, { backgroundColor: themeColors.background }]}>
        <Ionicons name="chevron-forward" size={16} color={themeColors.subtext} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    gap: 4,
  },
  details: {
    flexDirection: 'column',
    gap: 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PersonCard;
