import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';

interface GuideStepItemProps {
  stepNumber: number;
  title: string;
  description: string;
  imageUri?: ImageSourcePropType;
}

export const GuideStepItem: React.FC<GuideStepItemProps> = ({
  stepNumber,
  title,
  description,
  imageUri,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.stepNumber}>{stepNumber}</Text>

      <View style={styles.imageContainer}>
        {imageUri && (
          <Image
            resizeMode="contain"
            source={imageUri}
            style={styles.image}
          />
        )}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textPrimary,
    width: 24,
    textAlign: 'center',
  },
  imageContainer: {
    width: 84,
    height: 84,
    borderRadius: 18,
    backgroundColor: '#F5F6FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 14,
  },
  image: {
    width: 64,
    height: 64,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
});
