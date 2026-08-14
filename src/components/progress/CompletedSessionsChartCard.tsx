import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { CARD, COLORS } from '@/constants/theme';
import type { CompletedSessionPoint } from '@/types/progress';

const SCREEN_HORIZONTAL_PADDING = 20;
const Y_AXIS_LABEL_WIDTH = 35;
const CHART_HEIGHT = 160;
const BAR_WIDTH = 18;
const BAR_BORDER_RADIUS = 4;

interface CompletedSessionsChartCardProps {
  sessions: CompletedSessionPoint[];
}

export const CompletedSessionsChartCard: React.FC<
  CompletedSessionsChartCardProps
> = ({ sessions }) => {
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth =
    screenWidth -
    SCREEN_HORIZONTAL_PADDING * 2 -
    CARD.padding * 2 -
    Y_AXIS_LABEL_WIDTH;

  const maxCount = Math.max(...sessions.map(session => session.count));
  const yAxisLabels = Array.from({ length: maxCount + 1 }, (_, index) =>
    String(index),
  );

  const data = sessions.map(session => ({
    value: session.count,
    label: session.day,
    frontColor: COLORS.primary,
  }));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Sesiones completadas</Text>
      <BarChart
        data={data}
        width={chartWidth}
        height={CHART_HEIGHT}
        barWidth={BAR_WIDTH}
        barBorderRadius={BAR_BORDER_RADIUS}
        noOfSections={maxCount}
        maxValue={maxCount}
        yAxisLabelTexts={yAxisLabels}
        yAxisTextStyle={styles.axisText}
        xAxisLabelTexts={sessions.map(session => session.day)}
        xAxisLabelTextStyle={styles.axisText}
        rulesType="solid"
        rulesColor={COLORS.progressTrack}
        rulesThickness={1}
        yAxisColor={COLORS.border}
        xAxisColor={COLORS.border}
        yAxisLabelWidth={Y_AXIS_LABEL_WIDTH}
        isAnimated
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
  axisText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});
