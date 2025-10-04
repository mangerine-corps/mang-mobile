import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect } from 'react';
import Box from '@/components/Box';
import Text from '@/components/Text';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import { MainStack } from '@/utils/ParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors } from '@/hooks/useTheme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import FontelloCocoIconOutline from '@/utils/custom-fonts/FontelloCocoIconOutline';
import { useUpdatePricingMutation } from '@/state/services/consultants.service';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';
import { useDispatch } from 'react-redux';
import { setAuthTrigger, setPricingData } from '@/state/reducers/user.reducer';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from '@/state/hooks/user.hook';
import { useLoadAuth } from '@/state/hooks/loadauth.hook';

const PricingScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'Pricing'>) => {
  const { foreground, background, foreground_primary } = useThemeColors();
  const dispatch = useDispatch();
  const [updatePricing, { isLoading }] = useUpdatePricingMutation();
  const { pricingData } = useAuth();
  const { loadPricing, pricingLoading } = useLoadAuth();

  const postPricing = useCallback(async () => {
    try {
      const response = await updatePricing({
        body: pricingData,
      });
      // console.log('postPricing response:', JSON.stringify(response));
      if (response?.error) {
        const err = response as ErrorData;
        showMessage({
          message:
            err?.error?.data?.message ||
            err?.error?.data?.error ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      showMessage({
        message: 'Pricing updated',
        type: 'success',
      });
      dispatch(
        setAuthTrigger({
          trigger: true,
        }),
      );
    } catch (error) {
      console.log('postPricing error:', error);
    }
  }, [dispatch, updatePricing, pricingData]);

  useEffect(() => {
    loadPricing();
  }, [loadPricing]);

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <SafeAreaView style={{ flex: 1 }}>
          <Box flex={1}>
            <Box
              flexDirection="row"
              alignItems="center"
              paddingHorizontal="l"
              gap="mid"
              paddingVertical="mid">
              <Box>
                <TouchableOpacity
                  onPress={() => {
                    navigation.goBack();
                  }}
                  style={{ padding: 8, paddingLeft: 0 }}>
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={24}
                    color={foreground}
                  />
                </TouchableOpacity>
              </Box>
              <Box flex={1} alignItems="center">
                <Text
                  variant="semibold"
                  fontSize={20}
                  textTransform="capitalize">
                  Pricing
                </Text>
              </Box>
              <Box padding="s" opacity={0} width={32}></Box>
            </Box>
            <Box flex={1}>
              {pricingLoading && (
                <Box alignItems="center" padding="l">
                  <ActivityIndicator size="small" color={foreground_primary} />
                </Box>
              )}
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingVertical="m" paddingHorizontal="l">
                  <Box marginBottom="l" gap="s">
                    <Text variant="semibold" fontSize={16}>
                      Consultant Pricing Setting
                    </Text>
                    <Text color="label">
                      Brief description of the flexibility consultants have to
                      set their prices.
                    </Text>
                  </Box>
                  <Box>
                    <Box>
                      <Text marginBottom="mid" fontSize={16}>
                        An Hour Session Pricing
                      </Text>
                      <Box>
                        <Input
                          borderColor="faded"
                          noMargin
                          label="Define the price for an hour session"
                          keyboardType="numeric"
                          placeholder="Enter amount"
                          rightComponent={
                            <Box>
                              <FontelloCocoIcon
                                name="dollar"
                                size={24}
                                color={foreground}
                              />
                            </Box>
                          }
                          value={pricingData?.flatPrice}
                          onChangeText={v => {
                            const newData = {
                              ...pricingData,
                              flatPrice: v,
                            };
                            dispatch(
                              setPricingData({
                                value: newData,
                              }),
                            );
                          }}
                        />
                        <Text marginTop="s" color="label">
                          Note: "This price applies for a standard 1-hour
                          session without discounts.
                        </Text>
                      </Box>
                    </Box>
                    <Box marginTop="l">
                      <Text marginBottom="mid" fontSize={16}>
                        Last - Minute Booking
                      </Text>
                      <Text marginBottom="mid" fontSize={16}>
                        24-Hours
                      </Text>
                      <Box>
                        <Input
                          borderColor="faded"
                          label="Set percentage increase for bookings"
                          keyboardType="numeric"
                          placeholder="Enter percentage increase"
                          rightComponent={
                            <Box>
                              <FontelloCocoIconOutline
                                name="dollar"
                                size={24}
                                color={background}
                              />
                            </Box>
                          }
                          value={pricingData.dayBookPercentage.toString()}
                          onChangeText={v => {
                            dispatch(
                              setPricingData({
                                value: {
                                  ...pricingData,
                                  dayBookPercentage: Number(v) || 0,
                                },
                              }),
                            );
                          }}
                        />
                      </Box>

                      <Text marginBottom="mid" fontSize={16}>
                        12-Hours
                      </Text>
                      <Box>
                        <Input
                          borderColor="faded"
                          label="Set percentage increase for bookings"
                          keyboardType="numeric"
                          noMargin
                          placeholder="Enter percentage increase"
                          rightComponent={
                            <Box>
                              <FontelloCocoIconOutline
                                name="dollar"
                                size={24}
                                color={background}
                              />
                            </Box>
                          }
                          value={pricingData.midDayBookPercentage.toString()}
                          onChangeText={v => {
                            dispatch(
                              setPricingData({
                                value: {
                                  ...pricingData,
                                  midDayBookPercentage: Number(v) || 0,
                                },
                              }),
                            );
                          }}
                        />
                        <Text marginTop="s" color="label">
                          Note: "This price applies for a standard 1-hour
                          session without discounts.
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                  <Box marginTop="l">
                    <Box>
                      <Text marginBottom="mid" fontSize={16}>
                        Extended Sessions
                      </Text>
                      <Text color="label">
                        Set discount for sessions longer than 1 hour
                      </Text>
                    </Box>
                    <Box marginTop="l">
                      <Text marginBottom="mid" fontSize={16}>
                        2-Hours Session
                      </Text>
                      <Box>
                        <Input
                          borderColor="faded"
                          label="Set your 2-hour session discount"
                          keyboardType="numeric"
                          placeholder="|"
                          rightComponent={
                            <Box>
                              <Text fontSize={20}>%</Text>
                            </Box>
                          }
                          value={pricingData.twoHoursDiscount.toString()}
                          onChangeText={v => {
                            dispatch(
                              setPricingData({
                                value: {
                                  ...pricingData,
                                  twoHoursDiscount: Number(v) || 0,
                                },
                              }),
                            );
                          }}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <Text marginBottom="mid" fontSize={16}>
                        3-Hours Session
                      </Text>
                      <Box>
                        <Input
                          borderColor="faded"
                          label="Set your 3-hour session discount"
                          keyboardType="numeric"
                          placeholder="|"
                          rightComponent={
                            <Box>
                              <Text fontSize={20}>%</Text>
                            </Box>
                          }
                          value={pricingData.threeHoursDiscount.toString()}
                          onChangeText={v => {
                            dispatch(
                              setPricingData({
                                value: {
                                  ...pricingData,
                                  threeHoursDiscount: Number(v) || 0,
                                },
                              }),
                            );
                          }}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <Text marginBottom="mid" fontSize={16}>
                        4-Hours Session
                      </Text>
                      <Box>
                        <Input
                          borderColor="faded"
                          label="Set your 4-hour session discount"
                          keyboardType="numeric"
                          placeholder="|"
                          rightComponent={
                            <Box>
                              <Text fontSize={20}>%</Text>
                            </Box>
                          }
                          value={pricingData.fourHoursDiscount.toString()}
                          onChangeText={v => {
                            dispatch(
                              setPricingData({
                                value: {
                                  ...pricingData,
                                  fourHoursDiscount: Number(v) || 0,
                                },
                              }),
                            );
                          }}
                        />
                      </Box>
                    </Box>
                    <Box>
                      <Text marginBottom="mid" fontSize={16}>
                        More than 4-Hours Price
                      </Text>
                      <Box>
                        <Input
                          borderColor="faded"
                          // label="Set your 3-hour session discount"
                          keyboardType="numeric"
                          placeholder="|"
                          rightComponent={
                            <Box>
                              <Text fontSize={20}>%</Text>
                            </Box>
                          }
                          value={pricingData.otherHoursDiscount.toString()}
                          onChangeText={v => {
                            dispatch(
                              setPricingData({
                                value: {
                                  ...pricingData,
                                  otherHoursDiscount: Number(v) || 0,
                                },
                              }),
                            );
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </ScrollView>
            </Box>
            <Box gap="l" paddingHorizontal="l" paddingTop="l">
              <Box>
                <Button
                  displayText="Save"
                  loading={isLoading}
                  onPress={postPricing}
                />
              </Box>
              <Box>
                <Button
                  buttonProps={{
                    backgroundColor: 'background',
                    borderWidth: 1,
                    borderColor: 'button_primary',
                  }}
                  textProps={{
                    color: 'button_primary',
                  }}
                  displayText="Cancel"
                  onPress={navigation.goBack}
                />
              </Box>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default PricingScreen;
