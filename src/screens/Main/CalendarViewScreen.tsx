import { Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@/components/Box';
import Text from '@/components/Text';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import { MainStack } from '@/utils/ParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors, useThemeText } from '@/hooks/useTheme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { useAuth } from '@/state/hooks/user.hook';
import { useGetConsultantAvailabilityMutation } from '@/state/services/availability.service';
import { Appointment, Availability, ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import { useGetMyAppointmentsMutation } from '@/state/services/appointment.service';
import Modal from '@/components/Modal';

const CalendarViewScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'CalendarView'>) => {
  const { foreground, label, faded_border, foreground_primary } =
    useThemeColors();
  const { user } = useAuth();
  const { semibold } = useThemeText();
  const [markedDate, setMarkedDate] = useState('');
  const [getAvailability, {}] = useGetConsultantAvailabilityMutation();

  const [availability, setAvailability] = useState<Availability[]>([]);
  const [activeMonth, setActiveMonth] = useState(moment().format('YYYY-MM-DD'));
  const [getAppointments, {}] = useGetMyAppointmentsMutation();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const availableMarkedDate = useMemo(() => {
    const transformedAvailability = availability.map(availabledate => ({
      [availabledate.date]: {
        marked: true,
        dotColor:
          markedDate === availabledate.date ? foreground_primary : undefined,
        selected: markedDate === availabledate.date,
        appointments: appointments?.filter(
          x => x?.availability?.date === availabledate?.date,
        ),
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
            appointments: Appointment[];
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
  }, [availability, foreground_primary, markedDate, appointments]);
  const [selectedView, setSelectedView] = useState<
    | {
        marked: boolean;
        dotColor: string | undefined;
        appointments: Appointment[];
        date: string;
      }
    | undefined
  >(undefined);

  console.log('availableMarkedDate', availableMarkedDate);
  console.log('appointments', appointments);

  const loadAppointments = useCallback(async () => {
    try {
      const response = await getAppointments({
        params: {
          limit: 50,
          page: 1,
          status: 'UPCOMING',
        },
      });
      // console.log('appointments response', JSON.stringify(response));
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
      setAppointments((response as any)?.data?.data || []);
    } catch (error) {
      console.log('get availability error', JSON.stringify(error));
    }
  }, [getAppointments]);

  const loadConsultancy = useCallback(async () => {
    try {
      const response = await getAvailability({
        params: {
          userId: user?.id!,
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
  }, [getAvailability, user, activeMonth]);

  useEffect(() => {
    loadConsultancy();
  }, [loadConsultancy]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <SafeAreaView style={{ flex: 1 }}>
          <Modal isVisible={selectedView !== undefined} style={{ margin: 0 }}>
            <Box
              marginHorizontal="l"
              paddingVertical="l"
              paddingHorizontal="m"
              borderRadius={16}
              backgroundColor="background">
              <Box
                flexDirection="row"
                alignItems="center"
                paddingBottom="s"
                marginBottom="m"
                borderBottomColor="faded_border"
                borderBottomWidth={1}
                justifyContent="space-between">
                <Box>
                  <Text variant="medium" fontSize={20}>
                    Appointment for{' '}
                    {selectedView !== undefined &&
                      moment(selectedView?.date).format('DD/MM/YYYY')}
                  </Text>
                </Box>
                <Box>
                  <TouchableOpacity onPress={() => setSelectedView(undefined)}>
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color={foreground}
                    />
                  </TouchableOpacity>
                </Box>
              </Box>
              <Box maxHeight={Dimensions.get('window').height * 0.65}>
                <ScrollView>
                  <Box>
                    {(selectedView?.appointments?.length || 0) > 0 &&
                      selectedView?.appointments?.map((x, index) => (
                        <Box key={x?.id}>
                          <Text
                            variant="semibold"
                            fontSize={16}
                            marginBottom="l">
                            Appointment {index + 1}
                          </Text>
                          <Box gap="m">
                            <Box
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center">
                              <Box>
                                <Text color="label">Client Name:</Text>
                              </Box>
                              <Box>
                                <Text>
                                  {x?.consultantId === user?.id
                                    ? x?.user?.fullName
                                    : x?.consultant?.fullName}
                                </Text>
                              </Box>
                            </Box>
                            <Box
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center">
                              <Box>
                                <Text color="label">Consultation Topic:</Text>
                              </Box>
                              <Box>
                                <Text>{x?.message}</Text>
                              </Box>
                            </Box>
                            <Box
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center">
                              <Box>
                                <Text color="label">Time:</Text>
                              </Box>
                              <Box>
                                <Text>{x?.timeslots?.[0]?.startTime}</Text>
                              </Box>
                            </Box>
                            <Box
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center">
                              <Box>
                                <Text color="label">Duration:</Text>
                              </Box>
                              <Box>
                                <Text>{x?.timeslots?.[0]?.duration}</Text>
                              </Box>
                            </Box>
                            <Box
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center">
                              <Box>
                                <Text color="label">Status:</Text>
                              </Box>
                              <Box>
                                <Text>{x?.status}</Text>
                              </Box>
                            </Box>
                          </Box>
                          <Box flexDirection="row" gap="m" marginTop="l">
                            <Box flex={1}>
                              <Button
                                displayText="Reshedule"
                                buttonProps={{
                                  borderWidth: 1,
                                  borderColor: 'button_primary',
                                  backgroundColor: 'background',
                                }}
                                textProps={{
                                  color: 'button_primary',
                                }}
                              />
                            </Box>
                            <Box flex={1}>
                              <Button displayText="View Details" />
                            </Box>
                          </Box>
                        </Box>
                      ))}
                  </Box>
                </ScrollView>
              </Box>
            </Box>
          </Modal>
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
                  Calendar
                </Text>
              </Box>
              <Box padding="s" opacity={0} width={32}></Box>
            </Box>
            <Box flex={1}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingVertical="m" paddingHorizontal="l">
                  <Box flexDirection="row" gap="m">
                    <Box flex={1}>
                      <Input
                        noMargin
                        borderColor="faded"
                        placeholder="Search calendar"
                        leftComponent={
                          <Box paddingRight="s">
                            <MaterialCommunityIcons
                              name="magnify"
                              size={24}
                              color={label}
                            />
                          </Box>
                        }
                      />
                    </Box>
                    <Box>
                      <Button
                        buttonProps={{
                          height: 48,
                          width: 48,
                        }}>
                        <MaterialCommunityIcons
                          name="plus"
                          size={36}
                          color="#FFF"
                        />
                      </Button>
                    </Box>
                  </Box>
                  <Box marginTop="l">
                    <Box>
                      <Calendar
                        // Customize the appearance of the calendar
                        style={{
                          borderWidth: 1,
                          borderColor: faded_border,
                          minHeight: 350,
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
                        dayComponent={({ date }) => (
                          <TouchableOpacity
                            onPress={() => {
                              console.log('dayfired', date);
                              if (
                                date !== undefined &&
                                availableMarkedDate?.[date?.dateString || ''] &&
                                availableMarkedDate?.[date?.dateString || '']
                                  ?.appointments?.length
                              ) {
                                setSelectedView({
                                  date: date?.dateString,
                                  ...availableMarkedDate?.[
                                    date?.dateString || ''
                                  ],
                                });
                              }
                            }}>
                            <Box
                              height={44}
                              width={44}
                              justifyContent="center"
                              alignItems="center">
                              <Box
                                height={32}
                                width={32}
                                borderRadius={32}
                                backgroundColor={
                                  availableMarkedDate?.[date?.dateString || '']
                                    ?.appointments?.length
                                    ? 'foreground_primary'
                                    : undefined
                                }
                                justifyContent="center"
                                alignItems="center">
                                <Text
                                  color={
                                    availableMarkedDate?.[
                                      date?.dateString || ''
                                    ]?.appointments?.length
                                      ? 'background'
                                      : undefined
                                  }
                                  fontSize={16}>
                                  {date?.day}
                                </Text>
                                {availableMarkedDate?.[date?.dateString || '']
                                  ?.marked ? (
                                  <Box />
                                ) : undefined}
                              </Box>
                            </Box>
                          </TouchableOpacity>
                        )}
                        monthFormat={'MMM, yyyy'}
                        // disabledDaysIndexes={inactiveDates.map(x => x.index)}
                        minDate={moment().toISOString()}
                        // Callback that gets called when the user selects a day
                        onDayPress={day => {
                          console.log('dayfired', day);
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

export default CalendarViewScreen;
