import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@/components/Box';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { BottomTabList } from '@/utils/ParamList';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import BottomTabHeader from '@/components/BottomTabHeader';
import Input from '@/components/Input';
import { useThemeColors } from '@/hooks/useTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Consultant, ErrorData } from '@/utils/types';
import { useGetConsultantsMutation } from '@/state/services/consultants.service';
import { showMessage } from 'react-native-flash-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ConsultantItem from '@/components/ConsultantItem';
import Text from '@/components/Text';
import EmptyState from '@/components/EmptyState';

interface Props extends BottomTabScreenProps<BottomTabList, 'Consultant'> {}

const ConsultantScreen = ({}: Props) => {
  const { placeholder, foreground_primary, primary_background } =
    useThemeColors();
  const [consultants, setConsultants] = useState<Consultant[]>([]);
  const [getConsultants, { isLoading }] = useGetConsultantsMutation();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const searchConsultants = useMemo(
    () =>
      consultants.filter(c =>
        c?.fullName?.toLowerCase()?.includes(search?.toLowerCase()),
      ),
    [consultants, search],
  );

  const loadConsultants = useCallback(async () => {
    try {
      const response = await getConsultants({});
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
      setConsultants((response as any)?.data?.data?.consultants || []);
    } catch (error) {
      console.log('consultants error:', error);
    }
  }, [getConsultants]);

  useEffect(() => {
    loadConsultants();
  }, [loadConsultants]);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <Box flex={1}>
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={20}
              // enabled={Platform.OS === 'ios'}
              behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: 1 }}>
              <Box flex={1} position="relative">
                <BottomTabHeader onSearch={() => setShowSearch(!showSearch)} />
                <Box flex={1}>
                  {showSearch && (
                    <Box
                      flexDirection="row"
                      marginTop="m"
                      gap="s"
                      paddingHorizontal="l">
                      <Box flex={1}>
                        <Input
                          leftComponent={
                            <MaterialCommunityIcons
                              name="magnify"
                              size={24}
                              color={placeholder}
                              style={{ marginRight: 8 }}
                            />
                          }
                          backgroundColor={primary_background}
                          borderWidth={0}
                          value={search}
                          onChangeText={setSearch}
                          placeholder="Search Consultant"
                        />
                      </Box>
                      <Box>
                        <TouchableOpacity>
                          <Box
                            backgroundColor="primary_background"
                            height={50}
                            justifyContent="center"
                            alignItems="center"
                            width={50}
                            borderRadius={8}>
                            <FontAwesome
                              name="sliders"
                              color={foreground_primary}
                              size={24}
                            />
                          </Box>
                        </TouchableOpacity>
                      </Box>
                    </Box>
                  )}
                  {isLoading && (
                    <Box padding="l" alignItems="center">
                      <ActivityIndicator
                        size="small"
                        color={foreground_primary}
                      />
                    </Box>
                  )}
                  <Box
                    flexDirection="row"
                    marginBottom="m"
                    paddingHorizontal="l"
                    gap="mid">
                    <TouchableOpacity>
                      <Box
                        paddingBottom="s"
                        borderBottomWidth={2}
                        borderBottomColor="foreground_primary">
                        <Text
                          fontSize={12}
                          variant="semibold"
                          color="foreground_primary">
                          All Consultants
                        </Text>
                      </Box>
                    </TouchableOpacity>
                  </Box>
                  <Box flex={1}>
                    <FlatList
                      contentContainerStyle={{
                        paddingHorizontal: 24,
                        gap: 16,
                        paddingBottom: 40,
                      }}
                      refreshControl={
                        <RefreshControl
                          refreshing={isLoading}
                          onRefresh={() => {
                            loadConsultants();
                          }}
                        />
                      }
                      data={searchConsultants}
                      keyExtractor={({ id }) => id}
                      renderItem={({ item }) => (
                        <ConsultantItem consultant={item} />
                      )}
                      ListEmptyComponent={
                        <Box>
                          <EmptyState subtitle="No consultants here yet" />
                        </Box>
                      }
                    />
                  </Box>
                </Box>
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default ConsultantScreen;
