import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';

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
        <Text style={[styles.avatarText, { color: themeColors.primary }]}>
          {person.full_name ? person.full_name.charAt(0).toUpperCase() : '?'}
        </Text>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.name, { color: themeColors.text }]} numberOfLines={1}>
          {person.full_name || person.username || 'Unnamed'}
        </Text>
        
        <View style={styles.details}>
          {person.phone && (
            <View style={styles.detailItem}>
              <Ionicons name="call" size={12} color={themeColors.primary} />
              <Text style={[styles.detailText, { color: themeColors.subtext }]}>{person.phone}</Text>
            </View>
          )}
          {person.email && (
            <View style={styles.detailItem}>
              <Ionicons name="mail" size={12} color={themeColors.primary} />
              <Text style={[styles.detailText, { color: themeColors.subtext }]} numberOfLines={1}>{person.email}</Text>
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
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
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
  detailText: {
    fontSize: 13,
    fontWeight: '500',
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
