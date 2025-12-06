import {
  FlatList,
  StyleSheet,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import Animated, {
  AnimatedRef,
  SharedValue,
  interpolateColor,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { OnboardingData } from './data';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  dataLength: number;
  flatListIndex: SharedValue<number>;
  flatListRef: AnimatedRef<FlatList<OnboardingData>>;
  x: SharedValue<number>;
  isLast: boolean;
};

const CustomButton = ({ flatListRef, flatListIndex, dataLength, x, isLast }: Props) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const routes = useRouter();

  const buttonAnimationStyle = useAnimatedStyle(() => {
    return {
      width:
        isLast
          ? withSpring(140)
          : withSpring(60),
      height: 60,
    };
  });

  const textAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity:
        isLast ? withTiming(1) : withTiming(0),
      transform: [
        {
          translateX:
            isLast
              ? withTiming(0)
              : withTiming(-100),
        },
      ],
    };
  });
  const animatedColor = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      x.value,
      [0, SCREEN_WIDTH, 2 * SCREEN_WIDTH],
      ['#005b4f', '#1e2169', '#F15937'],
    );

    return {
      backgroundColor: backgroundColor,
    };
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (isLast) {
          routes.replace('/(tabs)');
        } else {
          flatListRef.current?.scrollToIndex({ index: flatListIndex.value + 1 });
        }
      }}>
      <Animated.View
        style={[styles.container, buttonAnimationStyle, animatedColor]}>
        {/* Last slide: show 'Get Started' text only */}
        {isLast && (
          <Animated.Text style={[styles.textButton, textAnimationStyle]}>
            Get Started
          </Animated.Text>
        )}

        {/* Other slides: show arrow icon only */}
        {!isLast && (
          <Ionicons name="arrow-forward" size={27} color="white" />
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default CustomButton;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e2169',
    padding: 10,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  arrow: {
    position: 'absolute',
  },
  textButton: {color: 'white', fontSize: 16, position: 'absolute'},
});