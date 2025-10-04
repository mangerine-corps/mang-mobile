import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useMemo, useState } from 'react';
import Box from '@/components/Box';
import Text from '@/components/Text';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import { MainStack } from '@/utils/ParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors } from '@/hooks/useTheme';
import { convertTime12to24 } from '@/utils/helpers';
import Select from '@/components/Select';
import AvailabilityAccordion from '@/components/AvailabilityAccordion';
import moment from 'moment';
import { useCreateAvailabilityMutation } from '@/state/services/availability.service';
import { useDispatch } from 'react-redux';
import { setAuthTrigger } from '@/state/reducers/user.reducer';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import Button from '@/components/Button';

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const AvailabilitySettingsScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'AvailabilitySettings'>) => {
  const { foreground, faded } = useThemeColors();
  const [timezone, setTimezone] = useState('');
  const [preferredDur, setPreferredDur] = useState('60');
  const [createAvailabil, { isLoading }] = useCreateAvailabilityMutation();
  const sortedDates = useMemo(
    () =>
      days.map(d => ({
        day: d,
        dates: Array.from(
          {
            length: moment().daysInMonth(),
          },
          (_, i) => ({
            dayString: moment(moment().format('YYYY-MM-' + (i + 1))).format(
              'dddd',
            ),
            date: moment(moment().format('YYYY-MM-' + (i + 1))).format(
              'YYYY-MM-DD',
            ),
          }),
        ).filter(x => x.dayString.toLowerCase() === d.toLowerCase()),
      })),
    [],
  );
  const dispatch = useDispatch();
  const [timeSlots, setTimeSlots] = useState<
    {
      day: string;
      enabled: boolean;
      slots: { from: string[]; to: string[] }[];
      duration: string[];
    }[]
  >([]);
  const preparedDates = useMemo(() => {
    const datesWithSlots = timeSlots
      .map(x =>
        sortedDates
          .find(xx => xx.day.toLowerCase() === x.day.toLowerCase())
          ?.dates?.map(sx => ({
            date: sx.date,
            timeslots: x?.slots?.map(xp => ({
              startTime: xp?.from?.[0],
              endTime: xp?.to?.[0],
              duration: Number(preferredDur),
              isAvailable: true,
            })),
          })),
      )
      ?.flat()
      ?.filter(
        x => x !== undefined && moment(x?.date).valueOf() > moment()?.valueOf(),
      );
    return datesWithSlots;
  }, [preferredDur, sortedDates, timeSlots]);

  const addSlot = useCallback(
    (day: string, duration: string) => {
      if (!day || !duration) {
        return;
      }
      const freshSlots = [...timeSlots];
      const slotDayExists = freshSlots.findIndex(t => t.day === day);
      if (slotDayExists > -1) {
        const previousSlot = convertTime12to24(
          freshSlots[slotDayExists].slots?.[
            freshSlots[slotDayExists].slots.length - 1
          ]?.to?.[0] || '07:00',
        );
        console.log('previousSlot', previousSlot);
        const fromDateString =
          moment().format('YYYY-MM-DD') + ' ' + previousSlot;
        freshSlots[slotDayExists].slots.push({
          from: [moment(fromDateString).format('hh:mm a')],
          to: [
            moment(fromDateString)
              .add(Number(duration), 'minutes')
              .format('hh:mm a'),
          ],
        });
        freshSlots[slotDayExists].enabled = true;
        setTimeSlots(freshSlots);
      } else {
        const previousSlot = '07:00';
        const fromDateString =
          moment().format('YYYY-MM-DD') + ' ' + previousSlot;
        freshSlots.push({
          day,
          duration: [duration],
          enabled: true,
          slots: [
            {
              from: [moment(fromDateString).format('hh:mm a')],
              to: [
                moment(fromDateString)
                  .add(Number(duration), 'minutes')
                  .format('hh:mm a'),
              ],
            },
          ],
        });
        setTimeSlots(freshSlots);
      }
    },
    [timeSlots],
  );

  const removeSlot = useCallback(
    (day: string, index: number) => {
      if (!day || index < 0) {
        return;
      }
      const freshSlots = [...timeSlots];
      const slotDayExists = freshSlots.findIndex(t => t.day === day);
      freshSlots[slotDayExists].slots = [
        ...freshSlots[slotDayExists].slots,
      ].filter((_, ind) => ind !== index);
      setTimeSlots(freshSlots);
    },
    [timeSlots],
  );

  const updateSlot = useCallback(
    (day: string, index: number, time: string, duration: string) => {
      if (!day || index < 0) {
        return;
      }
      const freshSlots = [...timeSlots];
      const slotDayExists = freshSlots.findIndex(t => t.day === day);
      if (slotDayExists > -1) {
        freshSlots[slotDayExists].slots[index].from[0] =
          moment(time).format('hh:mm a');
        setTimeSlots(freshSlots);
        freshSlots[slotDayExists].slots[index].to[0] = moment(time)
          .add(Number(duration), 'minutes')
          .format('hh:mm a');
        setTimeSlots(freshSlots);
      }
    },
    [timeSlots],
  );

  const newAvailability = useCallback(async () => {
    try {
      const avObj = {
        timezone,
        availability_settings: [],
        availabilities: preparedDates,
      };
      if (!preparedDates.length) {
        return;
      }
      const response = await createAvailabil({
        body: avObj as any,
      });
      // console.log('avObj', JSON.stringify(avObj));
      console.log('response', JSON.stringify(response));
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
    } catch (error) {
      console.log('availability error:', error);
    }
  }, [createAvailabil, dispatch, preparedDates, timezone]);

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
                  Availability
                </Text>
              </Box>
              <Box padding="s" opacity={0} width={32}></Box>
            </Box>
            <Box flex={1}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Box paddingVertical="m" paddingHorizontal="l">
                  <Box marginBottom="l">
                    <Text textAlign="center" color="label">
                      Please update your availability for consultation
                    </Text>
                  </Box>
                  <Box flexDirection="row" marginBottom="m" gap="m">
                    <Box>
                      <Text fontSize={16} variant="medium">
                        Time Zone
                      </Text>
                      <Text color="label">Set your time zone</Text>
                    </Box>
                    <Box flex={1}>
                      <Select
                        borderColor={faded}
                        // label="Default Time Zone"
                        defaultValue={timezone}
                        data={[
                          {
                            title: 'PST (Pacific Standard Time)  ',
                            value: 'pst',
                          },
                          {
                            title: 'GMT (Greenwich Mean Time)',
                            value: 'gmt',
                          },
                          {
                            title: 'EST (Eastern Standard Time)',
                            value: 'est',
                          },
                        ]}
                        value={timezone}
                        onSelect={v => setTimezone(v)}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Text variant="medium" marginBottom="s" fontSize={16}>
                      Preferred Appointment Duration
                    </Text>
                    <Select
                      borderColor={faded}
                      // label="Default Time Zone"
                      defaultValue={preferredDur}
                      data={[
                        {
                          title: '15 Mins',
                          value: '15',
                        },
                        {
                          title: '30 Mins',
                          value: '30',
                        },
                        {
                          title: '60 Mins',
                          value: '60',
                        },
                        {
                          title: 'Custom',
                          value: 'Custom',
                        },
                      ]}
                      value={preferredDur}
                      onSelect={v => setPreferredDur(v)}
                    />
                  </Box>
                  <Box>
                    {days?.map(d => (
                      <AvailabilityAccordion
                        key={d}
                        day={d}
                        active={timeSlots.find(x => x.day === d)?.enabled}
                        toggleDay={() => {
                          const freshSlots = [...timeSlots];
                          const existinIndex = freshSlots.findIndex(
                            x => x.day === d,
                          );
                          if (existinIndex > -1) {
                            freshSlots[existinIndex].enabled =
                              !freshSlots[existinIndex].enabled;
                            setTimeSlots(freshSlots);
                          } else {
                            addSlot(d, preferredDur || '60');
                          }
                        }}
                        addSlot={() => {
                          addSlot(d, preferredDur || '60');
                        }}
                        updateSlot={(index, value) => {
                          updateSlot(d, index, value, preferredDur || '60');
                        }}
                        removeSlot={index => {
                          removeSlot(d, index);
                        }}
                        slots={timeSlots.find(x => x.day === d)?.slots}
                      />
                    ))}
                  </Box>
                </Box>
              </ScrollView>
            </Box>
            <Box gap="l" paddingHorizontal="l" paddingTop="l">
              <Box>
                <Button
                  displayText="Save"
                  loading={isLoading}
                  onPress={newAvailability}
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

export default AvailabilitySettingsScreen;
