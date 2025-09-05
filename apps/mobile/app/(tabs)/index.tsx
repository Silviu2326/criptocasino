import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../hooks/useAuth';
import { useBalance } from '../hooks/useBalance';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { GameCard } from '../components/GameCard';

const { width } = Dimensions.get('window');

const FEATURED_GAMES = [
  {
    id: 1,
    name: 'Dice',
    icon: '🎲',
    rtp: '99%',
    minBet: '0.001 ETH',
    gradient: ['#667eea', '#764ba2'],
    popular: true,
  },
  {
    id: 2,
    name: 'Crash',
    icon: '🚀',
    rtp: '99%',
    minBet: '0.001 ETH',
    gradient: ['#f093fb', '#f5576c'],
    hot: true,
  },
  {
    id: 3,
    name: 'Blackjack',
    icon: '🃏',
    rtp: '99.5%',
    minBet: '0.001 ETH',
    gradient: ['#4facfe', '#00f2fe'],
    new: true,
  },
  {
    id: 4,
    name: 'Plinko',
    icon: '⚪',
    rtp: '99%',
    minBet: '0.001 ETH',
    gradient: ['#fa709a', '#fee140'],
    trending: true,
  },
];

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const { balances, isLoading: balancesLoading } = useBalance();

  const handleGamePress = (game: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      `Play ${game.name}`,
      `Ready to play ${game.name}? Minimum bet: ${game.minBet}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Play Now', onPress: () => console.log(`Playing ${game.name}`) },
      ]
    );
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.gradient}>
          <View style={styles.authPrompt}>
            <Ionicons name="wallet-outline" size={80} color="#00d4ff" />
            <Text style={styles.authTitle}>Welcome to Crypto Casino</Text>
            <Text style={styles.authSubtitle}>
              Connect your wallet to start playing provably fair games
            </Text>
            <TouchableOpacity
              style={styles.connectButton}
              onPress={() => console.log('Connect wallet')}
            >
              <LinearGradient
                colors={['#00d4ff', '#0099cc']}
                style={styles.buttonGradient}
              >
                <Ionicons name="wallet" size={24} color="white" />
                <Text style={styles.buttonText}>Connect Wallet</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.gradient}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back!</Text>
              <Text style={styles.username}>
                {user?.walletAddress?.substring(0, 6)}...
                {user?.walletAddress?.substring(-4)}
              </Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="white" />
              <View style={styles.notificationBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Balance Cards */}
          <View style={styles.balanceContainer}>
            <Text style={styles.sectionTitle}>Your Balance</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {balancesLoading ? (
                <LoadingSpinner />
              ) : (
                <>
                  {Object.entries(balances || {}).map(([currency, amount]) => (
                    <LinearGradient
                      key={currency}
                      colors={['#667eea', '#764ba2']}
                      style={styles.balanceCard}
                    >
                      <Text style={styles.currencyName}>{currency}</Text>
                      <Text style={styles.balanceAmount}>{amount}</Text>
                      <View style={styles.balanceActions}>
                        <TouchableOpacity style={styles.actionButton}>
                          <Ionicons name="arrow-down" size={16} color="white" />
                          <Text style={styles.actionText}>Deposit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                          <Ionicons name="arrow-up" size={16} color="white" />
                          <Text style={styles.actionText}>Withdraw</Text>
                        </TouchableOpacity>
                      </View>
                    </LinearGradient>
                  ))}
                </>
              )}
            </ScrollView>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>156</Text>
              <Text style={styles.statLabel}>Games Played</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>67%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>2.5 ETH</Text>
              <Text style={styles.statLabel}>Biggest Win</Text>
            </View>
          </View>

          {/* Featured Games */}
          <View style={styles.gamesContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Games</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.gamesGrid}>
              {FEATURED_GAMES.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onPress={() => handleGamePress(game)}
                />
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.activityContainer}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityList}>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="trending-up" size={20} color="#4ade80" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Won Dice Game</Text>
                  <Text style={styles.activityTime}>2 minutes ago</Text>
                </View>
                <Text style={styles.activityAmount}>+0.05 ETH</Text>
              </View>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="trending-down" size={20} color="#ef4444" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Lost Crash Game</Text>
                  <Text style={styles.activityTime}>5 minutes ago</Text>
                </View>
                <Text style={styles.activityAmount}>-0.02 ETH</Text>
              </View>
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="gift" size={20} color="#f59e0b" />
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Daily Bonus Claimed</Text>
                  <Text style={styles.activityTime}>1 hour ago</Text>
                </View>
                <Text style={styles.activityAmount}>+10 Free Spins</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  authSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  connectButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  notificationButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  balanceContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  balanceCard: {
    width: 160,
    padding: 20,
    borderRadius: 16,
    marginRight: 15,
  },
  currencyName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00d4ff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  gamesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#00d4ff',
    fontSize: 14,
    fontWeight: '600',
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  activityList: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  activityTime: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  activityAmount: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});