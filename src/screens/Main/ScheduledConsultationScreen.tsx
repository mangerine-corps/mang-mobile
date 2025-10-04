import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useState } from 'react';
import Box from '@/components/Box';
import Text from '@/components/Text';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import { useThemeColors } from '@/hooks/useTheme';
import { MainStack } from '@/utils/ParamList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ConsultationItem from '@/components/ConsultationItem';
import { useGetMyAppointmentsMutation } from '@/state/services/appointment.service';
import { Appointment, ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import { useFocusEffect } from '@react-navigation/native';

const ScheduledConsultationScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'ScheduledConsultation'>) => {
  const { foreground, foreground_primary } = useThemeColors();
  const [getAppointments, { isLoading }] = useGetMyAppointmentsMutation();
  const limit = 50;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const loadAppointments = useCallback(async () => {
    try {
      const response = await getAppointments({
        params: {
          limit,
          page,
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
      setTotalPages((response as any)?.data?.totalPages || 1);
    } catch (error) {
      console.log('get availability error', JSON.stringify(error));
    }
  }, [getAppointments, page]);

  useFocusEffect(
    useCallback(() => {
      if (page === 1) {
        loadAppointments();
      } else {
        setPage(1);
      }
    }, [loadAppointments, page]),
  );

  useEffect(() => {
    if (page !== 1) {
      loadAppointments();
    }
  }, [loadAppointments, page]);

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
                  Scheduled Consultation
                </Text>
              </Box>
              <Box padding="s" opacity={0} width={32}></Box>
            </Box>
            <Box flex={1}>
              {isLoading && (
                <Box alignItems="center" padding="l">
                  <ActivityIndicator size="small" color={foreground_primary} />
                </Box>
              )}
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={isLoading}
                    onRefresh={() => {
                      if (page === 1) {
                        loadAppointments();
                      } else {
                        setPage(1);
                      }
                    }}
                  />
                }
                data={appointments}
                // style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  gap: 16,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                }}
                keyExtractor={({ id }) => id}
                renderItem={({ item }) => (
                  <ConsultationItem
                    item={item}
                    onRefresh={() => {
                      if (page === 1) {
                        loadAppointments();
                      } else {
                        setPage(1);
                      }
                    }}
                  />
                )}
                onEndReachedThreshold={0.3}
                onEndReached={() => {
                  if (!isLoading && page < totalPages) {
                    setPage(page + 1);
                  }
                }}
              />
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default ScheduledConsultationScreen;
