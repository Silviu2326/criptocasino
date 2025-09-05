import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 2 cards per row with margins

interface GameCardProps {
  game: {
    id: number;
    name: string;
    icon: string;
    rtp: string;
    minBet: string;
    gradient: string[];
    popular?: boolean;
    hot?: boolean;
    new?: boolean;
    trending?: boolean;
  };
  onPress: () => void;
}

export function GameCard({ game, onPress }: GameCardProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getBadgeColor = () => {
    if (game.popular) return '#f59e0b';
    if (game.hot) return '#ef4444';
    if (game.new) return '#10b981';
    if (game.trending) return '#8b5cf6';
    return '#6b7280';
  };

  const getBadgeText = () => {
    if (game.popular) return 'Popular';
    if (game.hot) return 'Hot';
    if (game.new) return 'New';
    if (game.trending) return 'Trending';
    return '';
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <LinearGradient colors={game.gradient} style={styles.card}>
        {/* Badge */}
        {(game.popular || game.hot || game.new || game.trending) && (
          <View style={[styles.badge, { backgroundColor: getBadgeColor() }]}>
            <Text style={styles.badgeText}>{getBadgeText()}</Text>
          </View>
        )}

        {/* Game Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.gameIcon}>{game.icon}</Text>
        </View>

        {/* Game Info */}
        <View style={styles.info}>
          <Text style={styles.gameName}>{game.name}</Text>
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={12} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statText}>{game.rtp}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="diamond" size={12} color="rgba(255,255,255,0.8)" />
              <Text style={styles.statText}>{game.minBet}</Text>
            </View>
          </View>
        </View>

        {/* Play Button */}
        <View style={styles.playButtonContainer}>
          <View style={styles.playButton}>
            <Ionicons name="play" size={16} color="white" />
          </View>
        </View>

        {/* Glow Effect */}
        <View style={styles.glowEffect} />
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 15,
  },
  card: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    padding: 15,
    position: 'relative',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  gameIcon: {
    fontSize: 32,
  },
  info: {
    flex: 1,
  },
  gameName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginLeft: 4,
  },
  playButtonContainer: {
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  glowEffect: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: [{ rotate: '45deg' }],
  },
});