import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../hooks/useThemeColor';

interface DealCardProps {
  deal: any;
  onPress: () => void;
}

export function DealCard({ deal, onPress }: DealCardProps) {
  const themeColors = useThemeColor();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return themeColors.success;
      case 'active': return themeColors.primary;
      case 'canceled': return themeColors.danger;
      default: return themeColors.subtext;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: themeColors.card, borderColor: themeColors.border }]} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={[styles.typeBadge, { backgroundColor: themeColors.primary + '10' }]}>
          <Text style={[styles.typeText, { color: themeColors.primary }]}>{deal.deal_type}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(deal.status) + '15' }]}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(deal.status) }]} />
          <Text style={[styles.statusText, { color: getStatusColor(deal.status) }]}>
            {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.propertyTitle, { color: themeColors.text }]} numberOfLines={1}>
          Property #{deal.property_id}
        </Text>

        <View style={[styles.participants, { backgroundColor: themeColors.background + '80' }]}>
          <View style={styles.participant}>
            <Text style={[styles.label, { color: themeColors.subtext }]}>Seller</Text>
            <Text style={[styles.name, { color: themeColors.text }]} numberOfLines={1}>{deal.seller_name_snapshot || 'N/A'}</Text>
          </View>
          <View style={styles.connector}>
            <Ionicons name="repeat" size={16} color={themeColors.border} />
          </View>
          <View style={styles.participant}>
            <Text style={[styles.label, { color: themeColors.subtext }]}>Buyer</Text>
            <Text style={[styles.name, { color: themeColors.text }]} numberOfLines={1}>{deal.buyer_name_snapshot || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={[styles.label, { color: themeColors.subtext }]}>Deal Value</Text>
            <Text style={[styles.price, { color: themeColors.text }]}>Rs {parseFloat(deal.price).toLocaleString()}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color={themeColors.subtext} style={{ marginRight: 4 }} />
            <Text style={[styles.date, { color: themeColors.subtext }]}>{formatDate(deal.start_date)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    gap: 12,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
  },
  participant: {
    flex: 1,
  },
  connector: {
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
    paddingTop: 12,
  },
  priceContainer: {
    flex: 1,
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    fontWeight: '500',
  },
});
