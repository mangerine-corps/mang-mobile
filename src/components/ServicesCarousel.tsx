import { Dimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Box from './Box';
import { useAuth } from '@/state/hooks/user.hook';
import Carousel from 'react-native-snap-carousel';
import { SwipeIndicator } from '@/screens/Authentication/OnboardingScreen';
import Text from './Text';
import { useThemeColors } from '@/hooks/useTheme';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';
import FastImage from 'react-native-fast-image';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { exampleconsultationTime } from '@/screens/Main/ViewProfileScreen';
import { Consultancy } from '@/utils/types';
import { examplePricingData } from '@/state/reducers/user.reducer';

interface Props {
  consultationTime?: typeof exampleconsultationTime;
  userConsultancy?: Consultancy[];
  pricingData?: typeof examplePricingData;
}

const ServicesCarousel = ({
  consultationTime,
  userConsultancy,
  pricingData,
}: Props) => {
  const { services = [], pricingData: mainPricingData } = useAuth();
  const [snapItem, setSnapItem] = useState(0);
  const { foreground, label, foreground_primary } = useThemeColors();
  const navigation = useNavigation<NativeStackNavigationProp<MainStack>>();

  return (
    <Box gap="m">
      <Box backgroundColor="primary_background" padding="m" borderRadius={8}>
        <Box
          flexDirection="row"
          marginBottom="s"
          alignItems="center"
          justifyContent="space-between">
          <Box>
            <Text variant="semibold" fontSize={18}>
              Consulting Services
            </Text>
          </Box>
          <Box>
            {!consultationTime && (
              <TouchableOpacity
                onPress={() => navigation.navigate('AddConsultancy')}>
                <FontelloCocoIcon name="edit-1" size={24} color={foreground} />
              </TouchableOpacity>
            )}
          </Box>
        </Box>
        <Box
          alignItems="center"
          backgroundColor="primary_background"
          borderRadius={6}
          elevation={4}
          shadowColor="foreground"
          shadowOpacity={0.1}
          shadowRadius={4}
          shadowOffset={{
            height: 0,
            width: 0,
          }}>
          <Carousel
            vertical={false}
            // ref={swipeRef}
            firstItem={0}
            sliderHeight={232}
            itemHeight={232}
            data={userConsultancy || services}
            // loop
            renderItem={({
              item,
            }: {
              item: any | (typeof services)[0];
              index: number;
              dataIndex: number;
            }) => (
              <Box gap="s" padding="s">
                <Box
                  height={120}
                  // backgroundColor="faded"
                  borderRadius={4}
                  overflow="hidden">
                  <FastImage
                    style={{ height: '100%', width: '100%' }}
                    source={{ uri: item?.file }}
                  />
                </Box>
                <Box gap="s">
                  <Box>
                    <Text variant="semibold">
                      {item?.title} {item?.hours}hr(s)
                    </Text>
                  </Box>
                  <Box>
                    <Text numberOfLines={3}>{item?.description}</Text>
                  </Box>
                </Box>
              </Box>
            )}
            sliderWidth={Dimensions.get('window').width - 48 - 32}
            itemWidth={Dimensions.get('window').width - 48 - 32}
            enableSnap
            onSnapToItem={setSnapItem}
          />
        </Box>
        <Box marginTop="m">
          <Box
            width="100%"
            alignItems="center"
            flexDirection="row"
            justifyContent="center"
            gap="xs">
            {(userConsultancy || services).map((_, i) => (
              <SwipeIndicator
                activeColor={foreground_primary}
                inactiveColor={label}
                key={i}
                active={snapItem === i}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <Box backgroundColor="primary_background" padding="m" borderRadius={8}>
        <Box
          flexDirection="row"
          marginBottom="s"
          alignItems="center"
          justifyContent="space-between">
          <Box>
            <Text variant="semibold" fontSize={18}>
              Available Time
            </Text>
          </Box>
          <Box>
            {!consultationTime && (
              <TouchableOpacity
                onPress={() => navigation.navigate('AvailabilitySettings')}>
                <FontelloCocoIcon name="edit-1" size={24} color={foreground} />
              </TouchableOpacity>
            )}
          </Box>
        </Box>
        {consultationTime !== undefined && (
          <Box paddingTop="s" gap="s">
            {consultationTime?.availability?.map(x => (
              <Box key={x?.day}>
                <Text fontSize={16} variant="medium">
                  {x?.day}:{' '}
                  {x?.slots?.map(xx => `${xx?.from} - ${xx?.to}`)?.join(', ')}{' '}
                  {consultationTime?.timezone}
                </Text>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Box backgroundColor="primary_background" padding="m" borderRadius={8}>
        <Box
          flexDirection="row"
          marginBottom="s"
          alignItems="center"
          justifyContent="space-between">
          <Box>
            <Text variant="semibold" fontSize={18}>
              Pricing
            </Text>
          </Box>
          <Box>
            {!consultationTime && (
              <TouchableOpacity onPress={() => navigation.navigate('Pricing')}>
                <FontelloCocoIcon name="edit-1" size={24} color={foreground} />
              </TouchableOpacity>
            )}
          </Box>
        </Box>
        {pricingData !== undefined ? (
          <Box paddingTop="s" gap="s">
            <Box>
              <Text fontSize={16} variant="medium">
                Flat Price: {pricingData?.flatPrice} {pricingData?.currency}
              </Text>
            </Box>
            <Box>
              <Text fontSize={16} variant="medium">
                Two Hours Discount: {pricingData?.twoHoursDiscount}%
              </Text>
            </Box>
            <Box>
              <Text fontSize={16} variant="medium">
                Three Hours Discount: {pricingData?.threeHoursDiscount}%
              </Text>
            </Box>
            <Box>
              <Text fontSize={16} variant="medium">
                Four Hours Discount: {pricingData?.fourHoursDiscount}%
              </Text>
            </Box>
          </Box>
        ) : (
          <Box paddingTop="s" gap="s">
            <Box>
              <Text fontSize={16} variant="medium">
                Flat Price: {mainPricingData?.flatPrice}{' '}
                {mainPricingData?.currency}
              </Text>
            </Box>
            <Box>
              <Text fontSize={16} variant="medium">
                Two Hours Discount: {mainPricingData?.twoHoursDiscount}%
              </Text>
            </Box>
            <Box>
              <Text fontSize={16} variant="medium">
                Three Hours Discount: {mainPricingData?.threeHoursDiscount}%
              </Text>
            </Box>
            <Box>
              <Text fontSize={16} variant="medium">
                Four Hours Discount: {mainPricingData?.fourHoursDiscount}%
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ServicesCarousel;
