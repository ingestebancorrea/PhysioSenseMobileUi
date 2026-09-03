import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { COLORS } from '@/constants/theme';

LocaleConfig.locales.es = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy',
};
LocaleConfig.defaultLocale = 'es';

export interface DatePickerFieldProps {
  label: string;
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
}

const pad = (num: number) => String(num).padStart(2, '0');

const toISO = (value: string): string => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return '';
  const [, d, m, y] = match;
  return `${y}-${m}-${d}`;
};

const toDisplay = (iso: string): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const [, y, m, d] = match;
  return `${d}/${m}/${y}`;
};

const todayISO = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

export const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  value,
  onSelect,
  placeholder,
  minDate,
  maxDate,
}) => {
  const selectedISO = useMemo(() => (value ? toISO(value) : ''), [value]);
  const [open, setOpen] = useState(false);

  const markedDates = useMemo(() => {
    const result: Record<string, object> = {
      [todayISO()]: { textColor: COLORS.primary },
    };
    if (selectedISO) {
      result[selectedISO] = {
        selected: true,
        selectedColor: COLORS.primary,
      };
    }
    return result;
  }, [selectedISO]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.wrapper}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
      >
        <View style={styles.leftIcon}>
          <CalendarDays size={20} color={COLORS.textMuted} strokeWidth={2} />
        </View>
        <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
          {value || placeholder || 'Selecciona una fecha'}
        </Text>
        <View style={styles.rightIcon}>
          <ChevronDown size={20} color={COLORS.textMuted} strokeWidth={2} />
        </View>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Seleccionar fecha</Text>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeText}>Cerrar</Text>
              </TouchableOpacity>
            </View>

            <Calendar
              current={selectedISO || undefined}
              minDate={minDate}
              maxDate={maxDate}
              onDayPress={(day) => {
                onSelect(toDisplay(day.dateString));
                setOpen(false);
              }}
              markedDates={markedDates}
              style={styles.calendar}
              theme={{
                backgroundColor: COLORS.surface,
                calendarBackground: COLORS.surface,
                textSectionTitleColor: COLORS.textMuted,
                textSectionTitleDisabledColor: COLORS.divider,
                selectedDayBackgroundColor: COLORS.primary,
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: COLORS.primary,
                dayTextColor: COLORS.textPrimary,
                textDisabledColor: COLORS.divider,
                dotColor: COLORS.primary,
                selectedDotColor: '#FFFFFF',
                arrowColor: COLORS.primary,
                disabledArrowColor: COLORS.divider,
                monthTextColor: COLORS.textPrimary,
                indicatorColor: COLORS.primary,
                textDayFontFamily: undefined,
                textMonthFontWeight: '700',
                textDayFontSize: 15,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 13,
                textDayHeaderFontWeight: '600',
                todayButtonTextColor: COLORS.primary,
              }}
              renderArrow={(direction) =>
                direction === 'left' ? (
                  <ChevronLeft size={22} color={COLORS.primary} />
                ) : (
                  <ChevronRight size={22} color={COLORS.primary} />
                )
              }
            />

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => setOpen(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, styles.acceptButton]}
                onPress={() => setOpen(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmText}>Listo</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  leftIcon: {
    paddingLeft: 16,
  },
  value: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  placeholder: {
    color: COLORS.textMuted,
  },
  rightIcon: {
    paddingHorizontal: 14,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 380,
    maxHeight: '85%',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  calendar: {
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F6F8',
    borderWidth: 1,
    borderColor: '#EBECEF',
  },
  cancelText: {
    color: '#1A1C20',
    fontSize: 15,
    fontWeight: '700',
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});