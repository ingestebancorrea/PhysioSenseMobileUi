import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

export interface SessionFormFooterProps {
  currentStep: number;
  nextDisabled?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  isLastStep: boolean;
}

export const SessionFormFooter: React.FC<SessionFormFooterProps> = ({
  currentStep,
  nextDisabled,
  onPrevious,
  onNext,
  onSave,
  isLastStep,
}) => {
  return (
    <View style={styles.footer}>
      {currentStep > 1 && (
        <TouchableOpacity
          style={[styles.button, styles.secondary]}
          onPress={onPrevious}
          activeOpacity={0.8}
        >
          <ChevronLeft color="#1A1C20" size={20} strokeWidth={2.5} />
          <Text style={styles.secondaryText}>Anterior</Text>
        </TouchableOpacity>
      )}

      {!isLastStep ? (
        <TouchableOpacity
          style={[styles.button, styles.primary, nextDisabled && styles.disabled]}
          onPress={onNext}
          activeOpacity={0.8}
          disabled={nextDisabled}
        >
          <Text style={styles.primaryText}>Siguiente</Text>
          <ChevronRight color="#FFFFFF" size={20} strokeWidth={2.5} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.primary]} onPress={onSave} activeOpacity={0.8}>
          <Text style={styles.primaryText}>Crear sesión</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 0,
    paddingTop: 12,
    backgroundColor: '#FAFAFC',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  primary: {
    backgroundColor: COLORS.primary,
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondary: {
    backgroundColor: '#F5F6F8',
    borderWidth: 1,
    borderColor: '#EBECEF',
  },
  secondaryText: {
    color: '#1A1C20',
    fontSize: 15,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
