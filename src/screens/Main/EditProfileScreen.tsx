import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback } from 'react';
import Box from '@/components/Box';
import { useThemeColors } from '@/hooks/useTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '@/components/Text';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@/state/hooks/user.hook';
import Input from '@/components/Input';
import Button from '@/components/Button';
// import Select from '@/components/Select';
// import { useLocation } from '@/hooks/useTransformLocation';
import DatePicker from '@/components/DatePicker';
import { useUpdateProfileInfoMutation } from '@/state/services/users.service';
import { useDispatch } from 'react-redux';
import { setAuthTrigger } from '@/state/reducers/user.reducer';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';

const schema = yup
  .object({
    fullName: yup.string().max(255).required('Full name is required'),
    occupation: yup.string().max(255),
    location: yup.string().max(255),
    dob: yup.string().max(255),
    bio: yup.string().max(4000),
  })
  .required();

const EditProfileScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'EditProfile'>) => {
  const { foreground } = useThemeColors();
  const { user } = useAuth();
  // const { cities } = useLocation();
  const [updateProfile, { isLoading }] = useUpdateProfileInfoMutation();
  const dispatch = useDispatch();

  // const [finalCities, setFinalCities] = useState<typeof cities>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    // getValues,
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || '',
      bio: user?.bio || '',
      dob: user?.dateOfBirth || '',
      location: user?.location || '',
      occupation: user?.title || '',
    },
    resolver: yupResolver(schema),
  });

  const proceed = useCallback(
    async (cred: { [key: string]: string }) => {
      try {
        const { fullName, bio, dob, location, occupation } = cred;

        if (!fullName || !bio || !dob || !location) {
          showMessage({
            message: 'Kindly fill all fields to proceed',
            type: 'danger',
          });
          return;
        }
        if (
          fullName === user?.fullName &&
          bio === user?.bio &&
          dob === user?.dateOfBirth &&
          location === user?.location &&
          occupation &&
          user?.title
        ) {
          return;
        }
        const response = await updateProfile({
          body: {
            bio,
            dateOfBirth: dob,
            fullName,
            location,
            occupation,
          },
        });
        // console.log('signup response:', JSON.stringify(response));
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
          message: 'Profile updated',
          type: 'success',
        });
        dispatch(
          setAuthTrigger({
            trigger: true,
          }),
        );
      } catch (error) {
        console.log('signup error:', error);
      }
    },
    [dispatch, updateProfile, user],
  );

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
              keyboardVerticalOffset={15}
              // enabled={Platform.OS === 'ios'}
              behavior={Platform.OS === 'ios' ? 'height' : 'padding'}
              style={{ flex: 1 }}
              contentContainerStyle={{ flex: 1 }}>
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
                      Edit Profile
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
                <Box flex={1}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Box paddingHorizontal="l">
                      <Box>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          name="fullName"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              required
                              error={errors.fullName?.message}
                              label="Full Name"
                              value={value}
                              subtext="Can only be changed after 90days."
                              onChangeText={onChange}
                              placeholder="Input Full Name"
                            />
                          )}
                        />
                      </Box>
                      {/* <Box>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          name="occupation"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              error={errors.occupation?.message}
                              label="Occupation"
                              value={value}
                              onChangeText={onChange}
                              placeholder="Input Occupation"
                            />
                          )}
                        />
                      </Box> */}
                      <Box>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          name="location"
                          render={({ field: { onChange, value } }) => (
                            // <Select
                            //   error={errors?.location?.message}
                            //   required
                            //   search
                            //   label="Location"
                            //   onSelect={onChange}
                            //   data={cities.map(c => ({
                            //     title: `${c.name}, ${c.fullCountry}`,
                            //     value: `${c.name}, ${c.fullCountry}`,
                            //   }))}
                            //   value={value || ''}
                            // />

                            <Input
                              required
                              value={value}
                              onChangeText={onChange}
                              label="Location"
                              placeholder="Input Location"
                              error={errors?.location?.message}
                            />
                          )}
                        />
                      </Box>
                      <Box>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          name="dob"
                          render={({ field: { onChange, value } }) => (
                            <DatePicker
                              required
                              error={errors.dob?.message}
                              label="Date Of Birth"
                              value={value || ''}
                              onChange={onChange}
                              placeholder="Input DOB"
                            />
                          )}
                        />
                      </Box>
                      <Box>
                        <Controller
                          control={control}
                          rules={{
                            required: true,
                          }}
                          name="bio"
                          render={({ field: { onChange, value } }) => (
                            <Input
                              required
                              error={errors.bio?.message}
                              label="Bio"
                              value={value}
                              verticalAlign="top"
                              height={120}
                              multiline
                              onChangeText={onChange}
                              placeholder="Input Bio"
                              maxLength={500}
                              subtext={`${value?.length}/500`}
                            />
                          )}
                        />
                      </Box>
                      <Box>
                        <Button
                          loading={isLoading}
                          onPress={handleSubmit(proceed)}
                          displayText="Save"
                        />
                      </Box>
                    </Box>
                  </ScrollView>
                </Box>
              </Box>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Box>
      </TouchableWithoutFeedback>
    </BaseScreenComponent>
  );
};

export default EditProfileScreen;
