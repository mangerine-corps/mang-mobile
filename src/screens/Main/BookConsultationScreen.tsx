import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@/components/Box';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import { useThemeColors, useThemeText } from '@/hooks/useTheme';
import { MainStack } from '@/utils/ParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '@/components/Text';
import Input from '@/components/Input';
import CheckBox from '@/components/CheckBox';
import Button from '@/components/Button';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { useGetConsultantAvailabilityMutation } from '@/state/services/availability.service';
import { Availability, ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import { useBookAppointmentMutation } from '@/state/services/appointment.service';
import { useAuth } from '@/state/hooks/user.hook';
import { useDispatch } from 'react-redux';
import { setAuthTrigger } from '@/state/reducers/user.reducer';
import { useCreateIntentMutation } from '@/state/services/payment.service';
import { useStripe } from '@stripe/stripe-react-native';

LocaleConfig.locales.en = {
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthNamesShort: [
    'Jan',
    'Feb.',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Déc',
  ],
  dayNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],

  dayNamesShort: ['S', 'M', 'T', 'W', 'TH', 'F', 'S'],
  today: 'Today',
};

LocaleConfig.defaultLocale = 'en';

const BookConsultationScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<MainStack, 'BookConsultation'>) => {
  const { foreground, faded_border, label, foreground_primary } =
    useThemeColors();
  const { user } = useAuth();
  const [selectedTime, setSelectedTime] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [video, setVideo] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [markedDate, setMarkedDate] = useState('');
  const [activeMonth, setActiveMonth] = useState(moment().format('YYYY-MM-DD'));
  const { semibold } = useThemeText();
  const [getAvailability, { isLoading: availabilityLoading }] =
    useGetConsultantAvailabilityMutation();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [createBooking, { isLoading }] = useBookAppointmentMutation();
  const [createIntent, { isLoading: intentLoading }] =
    useCreateIntentMutation();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const fullMonth = useMemo(
    () =>
      Array.from(
        {
          length: moment(activeMonth).daysInMonth(),
        },
        (_, i) => ({
          index: i,
          dateString:
            moment(activeMonth).format('YYYY-MM') +
            '-' +
            (i <= 8 ? `0${i + 1}` : `${i + 1}`),
        }),
      ),
    [activeMonth],
  );
  const dispatch = useDispatch();

  const availableMarkedDate = useMemo(() => {
    const transformedAvailability = availability.map(availabledate => ({
      [availabledate.date]: {
        marked: true,
        dotColor:
          markedDate === availabledate.date ? foreground_primary : undefined,
        selected: markedDate === availabledate.date,
      },
    }));
    return Object.values({
      ...transformedAvailability.flat(),
    }).reduce(
      (
        acc: {
          [x: string]: {
            marked: boolean;
            dotColor: string | undefined;
          };
        },
        obj,
      ) => {
        const [key, value] = Object.entries(obj)[0]; // Get the single key-value inside each object
        acc[key] = value;
        return acc;
      },
      {},
    );
  }, [availability, foreground_primary, markedDate]);

  const inactiveDates = useMemo(() => {
    const stringAvaialableDates = Object.keys(availableMarkedDate || {});

    return fullMonth.filter(d => {
      return !stringAvaialableDates.includes(d.dateString);
    });
  }, [availableMarkedDate, fullMonth]);

  const loadConsultancy = useCallback(async () => {
    try {
      const response = await getAvailability({
        params: {
          userId: route?.params?.consultant?.id!,
          startDate: moment(activeMonth).startOf('month').format('YYYY/MM/DD'),
          endDate: moment(activeMonth).endOf('month').format('YYYY/MM/DD'),
        },
      });
      // console.log('availability response', JSON.stringify(response));
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
      setAvailability((response as any)?.data?.data || []);
    } catch (error) {
      console.log('get availability error', JSON.stringify(error));
    }
  }, [getAvailability, route, activeMonth]);

  useEffect(() => {
    loadConsultancy();
  }, [loadConsultancy]);

  const bookAppointment = useCallback(async () => {
    try {
      const response = await createBooking({
        body: {
          availabilityId: availability.find(a => a.date === markedDate)?.id!,
          consultantId: route?.params?.consultant?.id,
          message,
          timeslots: selectedTime,
          userId: user?.id!,
          videoOption: video,
        },
      });
      // console.log('book response', JSON.stringify(response));
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
      dispatch(
        setAuthTrigger({
          trigger: true,
        }),
      );
      navigation?.goBack();
      showMessage({
        message: 'You have sucessfully created a booking',
        type: 'success',
      });
    } catch (error) {
      console.log('book error:', error);
    }
  }, [
    availability,
    createBooking,
    dispatch,
    markedDate,
    message,
    navigation,
    route?.params?.consultant?.id,
    selectedTime,
    user?.id,
    video,
  ]);

  const initiatePayment = useCallback(async () => {
    try {
      const response = await createIntent({
        body: {
          amount: 20,
          currency: 'usd',
          consultationDetails: {
            availabilityId: availability.find(a => a.date === markedDate)?.id!,
            consultantId: route?.params?.consultant?.id,
            message,
            timeslots: selectedTime,
            userId: user?.id!,
            videoOption: video,
          },
        },
      });
      // console.log('book response', JSON.stringify(response));
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
      // navigation.navigate('PayConsultation', {
      //   consultant: route?.params?.consultant,
      //   paymentData: response?.data?.data,
      // });

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Nazza',
        paymentIntentClientSecret: response?.data?.data?.secret || '',
      });
      if (initError) {
        console.log('initError--XSD', JSON.stringify(initError));
        showMessage({
          message:
            `Error: ${initError?.code} - ${initError.message}` ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        console.log('presentErrorX', JSON.stringify(presentError));
        showMessage({
          message:
            `Error: ${presentError?.code} - ${presentError.message}` ||
            'Something went wrong',
          type: 'danger',
        });
        return;
      }
      bookAppointment();
    } catch (error) {
      console.log('book error:', error);
    }
  }, [
    availability,
    bookAppointment,
    createIntent,
    initPaymentSheet,
    markedDate,
    message,
    presentPaymentSheet,
    route?.params?.consultant?.id,
    selectedTime,
    user?.id,
    video,
  ]);

  return (
    <BaseScreenComponent>
      <Box flex={1}>
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
                  onPress={navigation.goBack}
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
                  Book Consultation
                </Text>
              </Box>
              <Box padding="s" opacity={0}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={foreground}
                />
              </Box>
            </Box>
            <Box flex={1} position="relative">
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingVertical="l">
                  <Box marginHorizontal="l" gap="m" marginBottom="m">
                    {availabilityLoading && (
                      <Box alignItems="center">
                        <Text fontSize={12} textAlign="center">
                          Loading availability for the month...
                        </Text>
                      </Box>
                    )}
                    <Box>
                      <TouchableOpacity
                        onPress={() => setShowCalendar(!showCalendar)}>
                        <Box
                          borderWidth={1}
                          borderRadius={8}
                          borderColor="faded_border"
                          height={50}
                          backgroundColor="background"
                          overflow="hidden"
                          flexDirection="row"
                          paddingHorizontal={'m'}
                          justifyContent="space-between"
                          alignItems="center">
                          <Text fontSize={16}>Select Date</Text>
                          <MaterialCommunityIcons
                            name="chevron-down"
                            size={16}
                            color={foreground}
                          />
                        </Box>
                      </TouchableOpacity>
                    </Box>
                    {showCalendar && (
                      <Box
                        borderRadius={8}
                        backgroundColor="background"
                        elevation={4}
                        shadowColor="foreground"
                        shadowOpacity={0.1}
                        shadowRadius={10}
                        shadowOffset={{
                          height: 4,
                          width: 0,
                        }}>
                        <Calendar
                          // Customize the appearance of the calendar
                          style={{
                            borderWidth: 1,
                            borderColor: faded_border,
                            height: 350,
                          }}
                          onMonthChange={dateData => {
                            setActiveMonth(dateData.dateString);
                          }}
                          disableAllTouchEventsForInactiveDays
                          disableAllTouchEventsForDisabledDays
                          // Specify the current date
                          // current={
                          //   Object.keys(availableMarkedDate?.[0] || {})?.[0]
                          // }
                          hideExtraDays
                          markedDates={availableMarkedDate}
                          monthFormat={'MMM, yyyy'}
                          disabledDaysIndexes={inactiveDates.map(x => x.index)}
                          minDate={moment().toISOString()}
                          // Callback that gets called when the user selects a day
                          onDayPress={day => {
                            if (
                              availability.find(a => a.date === day.dateString)
                            ) {
                              setMarkedDate(day.dateString);
                            }
                            // const availableDate = false;
                          }}
                          theme={{
                            backgroundColor: 'transparent',
                            calendarBackground: 'transparent',
                            textSectionTitleColor: foreground_primary,
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: foreground,
                            dayTextColor: foreground,
                            textDisabledColor: label,
                            textDayFontFamily: semibold.fontFamily,
                            textMonthFontFamily: semibold.fontFamily,
                            textDayHeaderFontFamily: semibold.fontFamily,
                            textDayFontSize: 12,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 12,
                            dotColor: foreground_primary,
                            arrowColor: foreground_primary,
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                  {markedDate && (
                    <Box marginHorizontal="l" gap="m">
                      <Text fontSize={20} variant="semibold">
                        Select Time
                      </Text>
                      <Box
                        flexDirection="row"
                        alignItems="flex-start"
                        gap="l"
                        flexWrap="wrap">
                        {availability
                          .find(a => a.date === markedDate)
                          ?.timeslots?.map(t => (
                            <TouchableOpacity
                              disabled={t?.isBooked}
                              key={t.id}
                              onPress={() => {
                                if (selectedTime.includes(t.id)) {
                                  setSelectedTime(x =>
                                    x.filter(xx => xx !== t.id),
                                  );
                                } else {
                                  setSelectedTime(x => [...x, t.id]);
                                }
                              }}>
                              <Box
                                height={40}
                                justifyContent="center"
                                paddingHorizontal="mid"
                                opacity={t?.isBooked ? 0.5 : undefined}
                                borderWidth={1}
                                borderRadius={6}
                                borderColor={
                                  selectedTime.includes(t.id)
                                    ? 'foreground_primary'
                                    : 'label'
                                }>
                                <Text
                                  fontSize={16}
                                  variant="semibold"
                                  color={
                                    selectedTime.includes(t.id)
                                      ? 'foreground_primary'
                                      : 'label'
                                  }>
                                  {t.startTime}
                                </Text>
                              </Box>
                            </TouchableOpacity>
                          ))}
                      </Box>
                    </Box>
                  )}
                  {selectedTime && (
                    <Box marginHorizontal="l" gap="m" marginTop="l">
                      <Text fontSize={20} variant="semibold">
                        Duration & Pricing
                      </Text>
                      <Box>
                        <Input
                          value={
                            selectedTime?.length > 0
                              ? `${selectedTime
                                  .map(x =>
                                    availability
                                      .find(a => a.date === markedDate)
                                      ?.timeslots.find(xx => xx.id === x),
                                  )
                                  .reduce(
                                    (accum, currentValue) =>
                                      accum + (currentValue?.duration || 0),
                                    0,
                                  )} minutes`
                              : ''
                          }
                        />
                        {/* <Select
                          borderColor={faded_border}
                          value={selectedRate}
                          data={[
                            {
                              title: '60 minutes (1hr)  ($75)',
                              value: '60 minutes (1hr)  ($75)',
                            },
                            {
                              title: '60 minutes (2hr)  ($105)',
                              value: '60 minutes (2hr)  ($105)',
                            },
                          ]}
                          onSelect={setSelectedRate}
                        /> */}
                      </Box>
                    </Box>
                  )}
                  <Box marginHorizontal="l" gap="m" marginTop="l">
                    <Text fontSize={20} variant="semibold">
                      Message to Consultant
                    </Text>
                    <Box>
                      <Input
                        textAlignVertical="top"
                        borderColor="faded_border"
                        height={120}
                        multiline
                        placeholder="Have anything to say to this consultant?"
                        value={message}
                        onChangeText={setMessage}
                      />
                    </Box>
                  </Box>
                  <Box
                    marginTop="m"
                    marginHorizontal="l"
                    flexDirection="row"
                    alignItems="flex-start"
                    gap="mid">
                    <CheckBox
                      checked={video}
                      size={16}
                      onPress={() => setVideo(!video)}
                    />
                    <Box flex={1}>
                      <Text color="label" fontSize={16}>
                        Send me a recorded video of the consultation at{' '}
                        <Text fontSize={16}>$5</Text>
                      </Text>
                    </Box>
                  </Box>
                  <Box marginHorizontal="l" marginTop="xxl" marginBottom="xl">
                    <Button
                      disabled={!markedDate || !selectedTime.length}
                      // onPress={() => {
                      //   navigation.navigate('PayConsultation', {
                      //     consultant: route?.params?.consultant,
                      //   });
                      // }}
                      loading={intentLoading || isLoading}
                      onPress={initiatePayment}
                      displayText="Book Consultation"
                      // displayText="Proceed to Payment"
                    />
                  </Box>
                </Box>
              </ScrollView>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default BookConsultationScreen;
