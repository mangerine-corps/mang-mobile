import { ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import Box from './Box';
import Text from './Text';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';
import { useThemeColors } from '@/hooks/useTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from './Button';
import { Appointment, ErrorData } from '@/utils/types';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import ConfirmModal from './ConfirmModal';
import { addAlpha } from '@/utils/helpers';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import { useCancelAppointmentMutation } from '@/state/services/appointment.service';
import { useDispatch } from 'react-redux';
import { setAuthTrigger } from '@/state/reducers/user.reducer';
import { showMessage } from 'react-native-flash-message';

interface Props {
  item: Appointment;
  onRefresh?: () => void;
}

const ConsultationItem = ({ item, onRefresh }: Props) => {
  const { label, success, foreground_primary } = useThemeColors();
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [apptDeleted, setApptDeleted] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<MainStack>>();
  const [cancelBooking, { isLoading: cancelLoading }] =
    useCancelAppointmentMutation();
  const dispatch = useDispatch();

  const cancelThisAppointment = useCallback(async () => {
    try {
      const response = await cancelBooking({
        appointmentId: item?.id,
        userId: item?.userId,
      });
      // console.log('cancel response', JSON.stringify(response));
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
      onRefresh && onRefresh();
      setApptDeleted(true);
    } catch (error) {
      console.log('cancel error:', error);
    }
  }, [cancelBooking, dispatch, item, onRefresh]);

  return (
    <>
      <Box
        backgroundColor="primary_background"
        borderRadius={8}
        padding="m"
        shadowColor="foreground"
        shadowOpacity={0.1}
        shadowRadius={4}
        elevation={2}
        shadowOffset={{
          height: 0,
          width: 0,
        }}>
        <Box
          marginBottom="l"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <Box flexDirection="row" alignItems="center" gap="s">
            <Box
              height={44}
              width={44}
              borderRadius={4}
              backgroundColor="faded"
              overflow="hidden">
              <FastImage
                source={{
                  uri: item?.consultant?.profilePics || '',
                }}
                style={{ height: '100%', width: '100%' }}
              />
            </Box>
            <Box>
              <Text variant="semibold" fontSize={16}>
                {item?.consultant?.fullName}
              </Text>
              <Text>{item?.consultant?.title}</Text>
            </Box>
          </Box>
          <Box flexDirection="row" alignItems="center" gap="s">
            <TouchableOpacity>
              <Box
                width={40}
                height={40}
                borderRadius={6}
                backgroundColor="primary_background"
                justifyContent="center"
                alignItems="center"
                shadowColor="foreground"
                shadowOpacity={0.1}
                shadowRadius={4}
                elevation={2}
                shadowOffset={{
                  height: 0,
                  width: 0,
                }}>
                <FontelloCocoIcon name="message-5" color={label} size={20} />
              </Box>
            </TouchableOpacity>
            <TouchableOpacity>
              <Box
                width={40}
                height={40}
                backgroundColor="primary_background"
                borderRadius={6}
                justifyContent="center"
                alignItems="center"
                shadowColor="foreground"
                shadowOpacity={0.1}
                shadowRadius={4}
                elevation={2}
                shadowOffset={{
                  height: 0,
                  width: 0,
                }}>
                <FontelloCocoIcon name="video" color={label} size={20} />
              </Box>
            </TouchableOpacity>
          </Box>
        </Box>
        <Box
          backgroundColor="background"
          marginBottom="l"
          borderRadius={6}
          paddingHorizontal="mid"
          height={40}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center">
          <Box flexDirection="row" alignItems="center" gap="xs">
            <MaterialCommunityIcons
              name="calendar-text-outline"
              size={16}
              color={label}
            />
            <Text>
              {moment(item?.availability?.date).format('MMM D, YYYY')}
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="center" gap="xs">
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color={label}
            />
            <Text>
              {item?.timeslots?.[0]?.startTime} -{' '}
              {item?.timeslots?.[0]?.endTime}
            </Text>
          </Box>
        </Box>
        <Box flexDirection="row" gap="l">
          <Box flex={1}>
            <Button
              buttonProps={{
                height: 40,
                backgroundColor: 'primary_background',
                borderColor: 'button_primary',
                borderWidth: 1,
              }}
              textProps={{
                color: 'button_primary',
              }}
              displayText="Cancel"
              onPress={() => setCancelConfirm(true)}
            />
          </Box>
          <Box flex={1}>
            <Button
              buttonProps={{
                height: 40,
              }}
              displayText="Reschedule"
              onPress={() =>
                navigation.navigate('RescheduleConsultation', {
                  appointment: item,
                })
              }
            />
          </Box>
        </Box>
      </Box>
      {cancelLoading && (
        <Box alignItems="center" padding="l">
          <ActivityIndicator size="small" color={foreground_primary} />
        </Box>
      )}

      <ConfirmModal
        closeModal={() => setCancelConfirm(false)}
        isVisible={cancelConfirm}
        title={'Are you sure you want to cancel?'}
        subtitle="You’ll lose the option to reschedule, and 10% of your payment will be deducted. Proceed?"
        confirmButton="Yes, Cancel"
        cancelButton="No, Keep"
        confirm={() => {
          setCancelConfirm(false);
          setTimeout(() => {
            cancelThisAppointment();
          }, 900);
        }}
        headComponent={
          <Box>
            <Box
              height={80}
              width={80}
              justifyContent="center"
              alignItems="center"
              borderRadius={100}
              style={{
                backgroundColor: addAlpha('#FFC107', 0.1),
              }}>
              <Box
                justifyContent="center"
                alignItems="center"
                borderRadius={12}
                height={36}
                width={36}
                style={{
                  backgroundColor: '#FFC107',
                }}>
                <MaterialCommunityIcons
                  name="exclamation"
                  color="#FFF"
                  size={24}
                />
              </Box>
            </Box>
          </Box>
        }
      />

      <ConfirmModal
        closeModal={() => setApptDeleted(false)}
        isVisible={apptDeleted}
        title={'Consultation Canceled Successfully'}
        subtitle="10% has been deducted, and the remaining amount is credited to your wallet."
        confirmButton="View Transaction"
        cancelButton="Cancel"
        confirm={() => {
          setApptDeleted(false);
          setTimeout(() => {
            navigation.navigate('MyConsultation');
          }, 900);
        }}
        headComponent={
          <Box>
            <Box
              height={80}
              width={80}
              justifyContent="center"
              alignItems="center"
              borderRadius={100}
              style={{
                backgroundColor: addAlpha(success, 0.1),
              }}>
              <Box
                justifyContent="center"
                alignItems="center"
                borderRadius={12}
                height={36}
                width={36}
                style={{
                  backgroundColor: success,
                }}>
                <MaterialCommunityIcons name="check" color="#FFF" size={24} />
              </Box>
            </Box>
          </Box>
        }
      />
    </>
  );
};

export default ConsultationItem;
