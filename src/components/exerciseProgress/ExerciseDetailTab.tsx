import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { CARD, COLORS } from '@/constants/theme';
import { ICONS } from '@/constants/icons';

const SCREEN_HORIZONTAL_PADDING = 20;
const Y_AXIS_LABEL_WIDTH = 35;
const CHART_HEIGHT = 200;
const Y_AXIS_MAX_VALUE = 40;
const Y_AXIS_SECTIONS = 4;
const BAR_WIDTH = 36;
const BAR_BORDER_RADIUS_TOP = 6;

const FORCE_COLOR = '#5C3BFF';
const QUALITY_COLOR = '#22C55E';

const RIGHT_Y_AXIS_LABELS = ['100%', '75%', '50%', '25%', '0%'];

interface SeriesData {
  id: number;
  title: string;
  repetitions: string;
  avgForce: string;
  avgQuality: string;
  forceValue: number;
  qualityValue: number;
}

const SERIES_LIST: SeriesData[] = [
  { id: 1, title: 'Serie 1', repetitions: '15 repeticiones', avgForce: '24 N', avgQuality: '90%', forceValue: 20, qualityValue: 78 },
  { id: 2, title: 'Serie 2', repetitions: '15 repeticiones', avgForce: '16 N', avgQuality: '60%', forceValue: 16, qualityValue: 60 },
  { id: 3, title: 'Serie 3', repetitions: '15 repeticiones', avgForce: '26 N', avgQuality: '85%', forceValue: 26, qualityValue: 85 },
];

const MAP_QUALITY_TO_CHART = (pct: number) => (pct / 100) * Y_AXIS_MAX_VALUE;

export const ExerciseDetailTab: React.FC<{ onFinish: () => void }> = ({
  onFinish,
}) => {
  const [expandedSeries, setExpandedSeries] = useState<number | null>(1);
  const { width: screenWidth } = useWindowDimensions();
  const ChevronIcon = ICONS.chevronDown;

  const chartWidth =
    screenWidth -
    SCREEN_HORIZONTAL_PADDING * 2 -
    CARD.padding * 2 -
    Y_AXIS_LABEL_WIDTH;

  const barData = SERIES_LIST.map(s => ({
    value: s.forceValue,
    label: s.title.replace('Serie ', 'S'),
    frontColor: FORCE_COLOR,
    barBorderTopLeftRadius: BAR_BORDER_RADIUS_TOP,
    barBorderTopRightRadius: BAR_BORDER_RADIUS_TOP,
  }));

  const lineData = SERIES_LIST.map(s => ({
    value: MAP_QUALITY_TO_CHART(s.qualityValue),
    dataPointText: `${s.qualityValue}%`,
  }));

  const toggleAccordion = (id: number) => {
    setExpandedSeries(prev => (prev === id ? null : id));
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.chartTitle}>Desempeño por serie</Text>

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: FORCE_COLOR }]} />
            <Text style={styles.legendText}>Fuerza (N)</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: QUALITY_COLOR }]} />
            <Text style={styles.legendText}>Calidad (%)</Text>
          </View>
        </View>

        <View style={styles.chartWrapper}>
          <BarChart
            data={barData}
            width={chartWidth}
            height={CHART_HEIGHT}
            barWidth={BAR_WIDTH}
            noOfSections={Y_AXIS_SECTIONS}
            maxValue={Y_AXIS_MAX_VALUE}
            yAxisLabelTexts={['0', '10', '20', '30', '40']}
            yAxisTextStyle={styles.axisText}
            xAxisLabelTextStyle={styles.axisText}
            xAxisColor={COLORS.border}
            xAxisThickness={1}
            yAxisColor="transparent"
            yAxisThickness={0}
            rulesType="solid"
            rulesColor={COLORS.progressTrack}
            rulesThickness={1}
            showLine
            lineData={lineData}
            lineConfig={{
              color: QUALITY_COLOR,
              thickness: 2,
              dataPointsColor: QUALITY_COLOR,
              dataPointsRadius: 5,
              textColor: QUALITY_COLOR,
              textFontSize: 10,
              textShiftY: -14,
              hideDataPoints: false,
            }}
            isAnimated
          />

          <View style={styles.rightYAxis}>
            {RIGHT_Y_AXIS_LABELS.map(label => (
              <Text key={label} style={styles.rightYText}>{label}</Text>
            ))}
          </View>
        </View>
      </View>

      {SERIES_LIST.map(item => {
        const isExpanded = expandedSeries === item.id;

        return (
          <View key={item.id} style={styles.seriesCard}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => toggleAccordion(item.id)}
              style={styles.seriesHeader}
            >
              <View>
                <Text style={styles.seriesTitle}>{item.title}</Text>
                <Text style={styles.seriesSubtitle}>{item.repetitions}</Text>
              </View>
              <View style={[styles.iconWrapper, isExpanded && styles.iconRotated]}>
                {ChevronIcon && (
                  <ChevronIcon size={20} color={COLORS.textPrimary} />
                )}
              </View>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.seriesBody}>
                <View style={styles.metricColumn}>
                  <Text style={styles.metricLabel}>Fuerza promedio</Text>
                  <Text style={styles.metricValue}>{item.avgForce}</Text>
                </View>
                <View style={styles.metricColumn}>
                  <Text style={styles.metricLabel}>Calidad promedio</Text>
                  <Text style={styles.metricValue}>{item.avgQuality}</Text>
                </View>
              </View>
            )}
          </View>
        );
      })}

      <TouchableOpacity
        style={styles.secondaryButton}
        activeOpacity={0.85}
        onPress={onFinish}
      >
        <Text style={styles.secondaryButtonText}>Finalizar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  card: {
    ...CARD,
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 14,
  },
  legendContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chartWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightYAxis: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 25,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  rightYText: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  axisText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  seriesCard: {
    ...CARD,
    marginBottom: 12,
  },
  seriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seriesTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  seriesSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  iconWrapper: {
    transform: [{ rotate: '0deg' }],
  },
  iconRotated: {
    transform: [{ rotate: '180deg' }],
  },
  seriesBody: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  metricColumn: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
