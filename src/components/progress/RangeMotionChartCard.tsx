import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import { CARD, COLORS } from '@/constants/theme';
import type { MotionChartPoint } from '@/types/progress';

const SCREEN_HORIZONTAL_PADDING = 20;
const Y_AXIS_LABEL_WIDTH = 35;
const CHART_HEIGHT = 200;
const Y_AXIS_MAX_VALUE = 100;
const Y_AXIS_SECTIONS = 4;
const POINT_SIZE = 10;

const Y_AXIS_LABELS = ['0°', '25°', '50°', '75°', '100°'];

interface RangeMotionChartCardProps {
  points: MotionChartPoint[];
}

export const RangeMotionChartCard: React.FC<RangeMotionChartCardProps> = ({
  points,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth =
    screenWidth -
    SCREEN_HORIZONTAL_PADDING * 2 -
    CARD.padding * 2 -
    Y_AXIS_LABEL_WIDTH;

  const data = points.map(point => ({
    value: point.value,
    label: point.day,
  }));

  const renderCustomDataPoint = () => (
    <View style={styles.dataPoint} />
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Rango de movimiento promedio</Text>
      <LineChart
        data={data}
        width={chartWidth}
        height={CHART_HEIGHT}
        curved
        color={COLORS.primary}
        thickness={2}
        hideDataPoints={false}
        customDataPoint={renderCustomDataPoint}
        noOfSections={Y_AXIS_SECTIONS}
        maxValue={Y_AXIS_MAX_VALUE}
        yAxisLabelTexts={Y_AXIS_LABELS}
        yAxisTextStyle={styles.axisText}
        xAxisLabelTexts={points.map(point => point.day)}
        xAxisLabelTextStyle={styles.axisText}
        rulesType="solid"
        rulesColor={COLORS.progressTrack}
        rulesThickness={1}
        yAxisColor={COLORS.border}
        xAxisColor={COLORS.border}
        yAxisLabelWidth={Y_AXIS_LABEL_WIDTH}
        adjustToWidth
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    ...CARD,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  dataPoint: {
    width: POINT_SIZE,
    height: POINT_SIZE,
    borderRadius: POINT_SIZE / 2,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  axisText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
