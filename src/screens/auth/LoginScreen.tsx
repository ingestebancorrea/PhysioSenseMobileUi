// src/screens/auth/LoginScreen.tsx
import React from 'react';
import { View, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { useAuth } from '@/hooks/auth/useAuth';
import { login } from '@/store/slices/authSlice';
import { routeNames } from '@/config/routes/routeNames';

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Requerido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').min(1, 'Requerido'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { isLoading } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: LoginFormData) => {
    dispatch(login(data)).unwrap()
      .then(() => navigation.navigate(routeNames.HOME))
      .catch(() => {}); // Error manejado en slice/toast
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScreenContainer>
        <View style={{ marginBottom: 32 }}>
          <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 8 }}>
            Bienvenido
          </Text>
          <Text style={{ fontSize: 16, color: '#666' }}>
            Inicia sesión para continuar
          </Text>
        </View>

        <View style={{ gap: 16 }}>
          <Input
            label="Email"
            placeholder="tu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            control={control}
            name="email"
            error={errors.email?.message}
            textContentType="emailAddress"
          />

          <Input
            label="Contraseña"
            placeholder="••••••••"
            secureTextEntry
            control={control}
            name="password"
            error={errors.password?.message}
            textContentType="password"
          />
        </View>

        <View style={{ marginTop: 24, gap: 12 }}>
          <Button
            title="Iniciar sesión"
            onPress={handleSubmit(onSubmit)}
            loading={isLoading}
            variant="primary"
            size="large"
          />

          <Button
            title="¿Olvidaste tu contraseña?"
            onPress={() => navigation.navigate(routeNames.FORGOT_PASSWORD)}
            variant="ghost"
          />
        </View>

        <View style={{ marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Text style={{ color: '#666' }}>¿No tienes cuenta?</Text>
          <Button
            title="Regístrate"
            onPress={() => navigation.navigate(routeNames.REGISTER)}
            variant="link"
          />
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
};