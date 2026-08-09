// src/screens/auth/EmailSentScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AuthStackParamList } from '@/navigation/types/authStackParams';

type EmailSentScreenProps = NativeStackScreenProps<AuthStackParamList, 'EmailSent'>;

const EmailSentScreen: React.FC<EmailSentScreenProps> = ({ navigation, route }) => {
  const { email } = route.params;

  const handleResend = () => {
    // TODO: Conectar con la API para reenviar el correo de recuperación
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={TEXT_PRIMARY} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.illustrationContainer}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="email-outline" size={90} color={PRIMARY} />
          </View>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="check" size={20} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.title}>Revisa tu correo</Text>
        <Text style={styles.message}>
          Hemos enviado un enlace a{' '}
          <Text style={styles.emailHighlight}>{email}</Text> con las instrucciones
          para restablecer tu contraseña.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>¿No recibiste el correo?</Text>
          <View style={styles.cardItem}>
            <MaterialCommunityIcons name="clock-outline" size={18} color={TEXT_SECONDARY} />
            <Text style={styles.cardItemText}>
              Revisa tu carpeta de spam o correo no deseado.
            </Text>
          </View>
          <View style={styles.cardItem}>
            <MaterialCommunityIcons name="information-outline" size={18} color={TEXT_SECONDARY} />
            <Text style={styles.cardItemText}>
              Si aún no lo encuentras, puedes reenviar el correo.
            </Text>
          </View>
          <TouchableOpacity
            style={styles.resendButton}
            activeOpacity={0.7}
            onPress={handleResend}
          >
            <Text style={styles.resendText}>Reenviar correo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.outlineButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.outlineButtonText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const PRIMARY = '#6236FF';
const TEXT_PRIMARY = '#1A1A24';
const TEXT_SECONDARY = '#666666';
const CARD_BACKGROUND = '#F4F5F7';
const PASTEL_BORDER = '#D6C7FF';
const SUCCESS = '#22C55E';
const ICON_CIRCLE_BACKGROUND = '#F0EBFF';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginLeft: -8,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 28,
  },
  iconCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: ICON_CIRCLE_BACKGROUND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: SUCCESS,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    textAlign: 'center',
    marginTop: 8,
  },
  message: {
    fontSize: 15,
    color: TEXT_SECONDARY,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 12,
  },
  emailHighlight: {
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  card: {
    width: '100%',
    backgroundColor: CARD_BACKGROUND,
    borderRadius: 12,
    padding: 20,
    marginTop: 28,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 14,
  },
  cardItemText: {
    flex: 1,
    fontSize: 14,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
  resendButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 16,
  },
  resendText: {
    fontSize: 14,
    fontWeight: '700',
    color: PRIMARY,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
  },
  outlineButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: PASTEL_BORDER,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: PRIMARY,
  },
});

export default EmailSentScreen;
