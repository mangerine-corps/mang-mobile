import { Dimensions, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useRef, useState } from 'react';
import Box from '@/components/Box';
import Carousel from 'react-native-snap-carousel';
import ScaledImage from '@/components/ScaledImage';
import Text from '@/components/Text';
import Button from '@/components/Button';
import { useThemeColors } from '@/hooks/useTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import BaseScreenComponent from '@/components/BaseScreenComponent';

const items = [
  {
    title: 'Stay connected. Solve Real Problems',
    content:
      'Talk directly with professionals and businesses. Get expert help when it matters.',
  },
  {
    title: 'Join the Community, Share Your Value',
    content:
      'Explore posts, connect live, and show the world what you can do—in your own words.',
  },
  {
    title: 'Go Live, Get Discovered',
    content: 'Consult, showcase your work to others. Earn income.',
  },
];

export const SwipeIndicator = ({
  active,
  activeColor,
  inactiveColor,
}: {
  active?: boolean;
  activeColor?: string;
  inactiveColor?: string;
}) => {
  const { white } = useThemeColors();
  const [width] = useState(new Animated.Value(9));
  const duration = 150;
  width.addListener(() => {
    return;
  });

  useEffect(() => {
    if (active) {
      Animated.timing(width, {
        toValue: 33,
        duration,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
    } else {
      Animated.timing(width, {
        toValue: 9,
        duration,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
    }
  }, [active, width]);

  return (
    <Animated.View
      style={{
        backgroundColor: active
          ? activeColor || white
          : inactiveColor || '#ADADAD',
        height: 9,
        borderRadius: 6,
        width,
      }}
    />
  );
};

interface Props extends NativeStackScreenProps<MainStack, 'Onboarding'> {}

const OnboardingScreen = ({ navigation }: Props) => {
  const [activeItem, setActiveItem] = useState(0);
  const swipeRef = useRef<any>(null);

  useEffect(() => {
    swipeRef.current.snapToItem(0, false);
  }, []);

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="primary">
        <SafeAreaView style={{ flex: 1 }}>
          <Box flex={1} gap="l">
            <Box flex={1} justifyContent="space-between">
              <Box alignItems="center" marginTop="mxl">
                <ScaledImage
                  source={require('@/assets/images/onboarding.png')}
                  width={Dimensions.get('window').width - 48}
                />
              </Box>
              <Box
                flex={1}
                justifyContent="space-between"
                paddingBottom="mxl"
                paddingTop="l">
                <Box
                  width="100%"
                  alignItems="center"
                  flexDirection="row"
                  justifyContent="center"
                  gap="xs">
                  {items.map((_, i) => (
                    <SwipeIndicator key={i} active={activeItem === i} />
                  ))}
                </Box>
                <Box alignItems="center">
                  <Carousel
                    vertical={false}
                    ref={swipeRef}
                    firstItem={0}
                    autoplay
                    autoplayDelay={10}
                    autoplayInterval={5000}
                    sliderHeight={120}
                    itemHeight={120}
                    data={items}
                    // loop
                    renderItem={({
                      item,
                    }: {
                      item: any | (typeof items)[0];
                      index: number;
                      dataIndex: number;
                    }) => (
                      <Box>
                        <Text
                          marginBottom="mid"
                          textAlign="center"
                          marginHorizontal="xl"
                          fontSize={24}
                          variant="bold"
                          color="white">
                          {item?.title}
                        </Text>
                        <Text textAlign="center" fontSize={16} color="white">
                          {item?.content}
                        </Text>
                      </Box>
                    )}
                    sliderWidth={Dimensions.get('window').width - 48}
                    itemWidth={Dimensions.get('window').width - 48}
                    enableSnap
                    onSnapToItem={setActiveItem}
                  />
                </Box>
                {activeItem === 2 ? (
                  <Box flexDirection="row" gap="s" paddingHorizontal="l">
                    <Box flex={1}>
                      <Button
                        onPress={() => {
                          navigation.navigate('Login');
                        }}
                        displayText="Get Started"
                        buttonProps={{
                          backgroundColor: 'white',
                        }}
                        textProps={{
                          color: 'primary',
                        }}
                      />
                    </Box>
                  </Box>
                ) : (
                  <Box flexDirection="row" gap="s" paddingHorizontal="l">
                    <Box flex={1}>
                      <Button
                        onPress={() => {
                          navigation.navigate('Login');
                        }}
                        displayText="Login"
                        buttonProps={{
                          backgroundColor: 'primary',
                          borderColor: 'white',
                          borderWidth: 1,
                        }}
                        textProps={{
                          color: 'white',
                        }}
                      />
                    </Box>
                    <Box flex={1}>
                      <Button
                        displayText="Next"
                        buttonProps={{
                          backgroundColor: 'white',
                        }}
                        textProps={{
                          color: 'primary',
                        }}
                        onPress={() => {
                          swipeRef.current?.snapToNext();
                        }}
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default OnboardingScreen;
