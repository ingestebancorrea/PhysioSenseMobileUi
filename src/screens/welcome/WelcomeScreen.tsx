import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeartPulse } from 'lucide-react-native';

interface WelcomeScreenProps {
  onStart?: () => void;
  onLogin?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  onLogin,
}) => {
  return (
    <LinearGradient
      colors={['#300571', '#50399c']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>RehabHand</Text>
            <Text style={styles.subtitle}>
              Guante inteligente para rehabilitación de mano
            </Text>
          </View>

          <View style={styles.imageWrapper}>
            <View style={styles.taglineRow}>
              <View style={styles.taglineContainer}>
                <HeartPulse color="rgba(255, 255, 255, 0.7)" size={32} />
                <Text style={styles.tagline}>
                  Tecnología que acompaña tu recuperación
                </Text>
              </View>
            </View>
            <View style={styles.gloveImageContainer}>
              <Image
                source={require('../../../assets/glove.png')}
                style={styles.gloveImage}
              />
            </View>
          </View>

          <View style={styles.footer}>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={onStart}
            >
              <Text style={styles.primaryButtonText}>Comenzar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.6}
              onPress={onLogin}
            >
              <Text style={styles.loginButtonText}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'stretch',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  title: {
    fontSize: 47,
    fontFamily: 'Poppins-Bold',
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 23,
    width: 270,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
  },
  imageWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  gloveImageContainer: {
    height: '100%',
    width: '72%',
    overflow: 'visible',
  },
  gloveImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    transform: [
      { scale: 1.8 },
      { translateX: -40 },
    ],
  },
  footer: {
    justifyContent: 'flex-end',
  },
  taglineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '27%',
  },
  taglineContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  tagline: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 15,
    maxWidth: 120,
  },
  primaryButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingVertical: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
  },
});
