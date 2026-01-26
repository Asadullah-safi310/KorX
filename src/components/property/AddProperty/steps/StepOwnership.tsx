import React, { useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { AppText } from '../../../../AppText';
import { useFormikContext } from 'formik';
import { observer } from 'mobx-react-lite';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import personStore from '../../../../stores/PersonStore';
import { useThemeColor } from '../../../../hooks/useThemeColor';
import Avatar from '../../../../components/Avatar';

const { width } = Dimensions.get('window');

const StepOwnership = observer(() => {
  const { values, setFieldValue, errors, touched } = useFormikContext<any>();
  const theme = useThemeColor();

  useEffect(() => {
    if (personStore.agents.length === 0) personStore.fetchAgents();
  }, []);

  const propertyTypes = [
    { label: 'House', icon: 'home-variant-outline', activeIcon: 'home-variant' },
    { label: 'Apartment', icon: 'office-building-marker-outline', activeIcon: 'office-building-marker' },
    { label: 'Villa', icon: 'home-modern', activeIcon: 'home-modern' },
    { label: 'Commercial', icon: 'storefront-outline', activeIcon: 'storefront' },
    { label: 'Land', icon: 'map-outline', activeIcon: 'map' },
    { label: 'Plot', icon: 'border-all', activeIcon: 'border-all' },
  ];
  
  const purposes = [
    { label: 'Sale', value: 'SALE', icon: 'handshake-outline' },
    { label: 'Rent', value: 'RENT', icon: 'calendar-clock-outline' },
  ];

  const renderError = (field: string) => {
    if (touched[field] && errors[field]) {
      return <Text style={[styles.errorText, { color: theme.danger }]}>{errors[field] as string}</Text>;
    }
    return null;
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      {/* Property Type Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Property Category</Text>
        <Text style={[styles.sectionSubtitle, { color: theme.subtext }]}>What kind of property are you listing?</Text>
        
        <View style={styles.grid}>
          {propertyTypes.map((type) => {
            const isActive = values.property_type === type.label;
            return (
              <TouchableOpacity
                key={type.label}
                activeOpacity={0.7}
                style={[
                  styles.typeCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  isActive && { borderColor: theme.primary, backgroundColor: theme.primary + '08' },
                ]}
                onPress={() => setFieldValue('property_type', type.label)}
              >
                <View style={[styles.iconCircle, isActive && { backgroundColor: theme.primary + '15' }]}>
                  <MaterialCommunityIcons
                    name={(isActive ? type.activeIcon : type.icon) as any}
                    size={28}
                    color={isActive ? theme.primary : theme.subtext}
                  />
                </View>
                <Text style={[styles.typeLabel, { color: isActive ? theme.text : theme.subtext }]}>
                  {type.label}
                </Text>
                {isActive && (
                  <View style={[styles.checkBadge, { backgroundColor: theme.primary }]}>
                    <Ionicons name="checkmark" size={12} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        {renderError('property_type')}
      </View>

      {/* Purpose Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Listing Purpose</Text>
        <Text style={[styles.sectionSubtitle, { color: theme.subtext }]}>Is this for sale or long-term rent?</Text>
        
        <View style={styles.purposeRow}>
          {purposes.map((p) => {
            const isActive = values.purpose === p.value;
            return (
              <TouchableOpacity
                key={p.value}
                activeOpacity={0.7}
                style={[
                  styles.purposeCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  isActive && { borderColor: theme.primary, backgroundColor: theme.primary + '08' },
                ]}
                onPress={() => setFieldValue('purpose', p.value)}
              >
                <MaterialCommunityIcons
                  name={p.icon as any}
                  size={24}
                  color={isActive ? theme.primary : theme.subtext}
                />
                <Text style={[styles.purposeText, { color: isActive ? theme.text : theme.subtext }]}>
                  For {p.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {renderError('purpose')}
      </View>

      {/* Agent Selection */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Assign Agent</Text>
            <Text style={[styles.sectionSubtitle, { color: theme.subtext }]}>Who will manage this listing?</Text>
          </View>
          <View style={[styles.optionalBadge, { backgroundColor: theme.border + '30' }]}>
            <Text style={[styles.optionalText, { color: theme.subtext }]}>OPTIONAL</Text>
          </View>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.agentScroll}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.agentCard,
              { backgroundColor: theme.card, borderColor: theme.border },
              !values.agent_id && { borderColor: theme.primary, backgroundColor: theme.primary + '08' },
            ]}
            onPress={() => setFieldValue('agent_id', '')}
          >
            <View style={[styles.noneAvatar, { backgroundColor: theme.border + '50' }]}>
              <Ionicons name="person-remove-outline" size={24} color={theme.subtext} />
            </View>
            <Text style={[styles.agentName, { color: !values.agent_id ? theme.text : theme.subtext }]}>No Agent</Text>
          </TouchableOpacity>

          {personStore.agents.map((agent) => {
            const isActive = values.agent_id === String(agent.user_id);
            return (
              <TouchableOpacity
                key={agent.user_id}
                activeOpacity={0.7}
                style={[
                  styles.agentCard,
                  { backgroundColor: theme.card, borderColor: theme.border },
                  isActive && { borderColor: theme.primary, backgroundColor: theme.primary + '08' },
                ]}
                onPress={() => setFieldValue('agent_id', String(agent.user_id))}
              >
                <Avatar user={agent} size="md" />
                <Text style={[styles.agentName, { color: isActive ? theme.text : theme.subtext }]} numberOfLines={1}>
                  {agent.full_name.split(' ')[0]}
                </Text>
                <Text style={[styles.agentRole, { color: theme.subtext }]}>Agent</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    marginTop: 2,
  },
  optionalBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  optionalText: {
    fontSize: 10,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeCard: {
    width: (width - 40 - 24) / 3,
    aspectRatio: 0.9,
    borderRadius: 20,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'relative',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  purposeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  purposeCard: {
    flex: 1,
    height: 64,
    borderRadius: 18,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  purposeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  agentScroll: {
    gap: 12,
    paddingRight: 20,
  },
  agentCard: {
    width: 100,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 8,
  },
  noneAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentName: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  agentRole: {
    fontSize: 11,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    marginTop: 8,
    marginLeft: 4,
    fontWeight: '600',
  },
});

export default StepOwnership;
