import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Box from '@/components/Box';
import { useThemeColors } from '@/hooks/useTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '@/components/Text';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Education, ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from '@/state/hooks/user.hook';
import { useLoadAuth } from '@/state/hooks/loadauth.hook';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import {
  useCreateEducationMutation,
  useDeleteEducationMutation,
  useUpdateEducationMutation,
} from '@/state/services/education.service';
import CheckBox from '@/components/CheckBox';
import EmptyState from '@/components/EmptyState';

const ManageEducationScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'ManageEducation'>) => {
  const { education = [] } = useAuth();
  const { foreground, foreground_primary } = useThemeColors();
  const { loadUserEducation, educationLoading } = useLoadAuth();
  const [selectedDeleteId, setSelectedDeleteId] = useState('');
  const [addEducation, { isLoading: createLoading }] =
    useCreateEducationMutation();
  const [deleteEducation, { isLoading: deleteLoading }] =
    useDeleteEducationMutation();
  const [editEducation, { isLoading: editLoading }] =
    useUpdateEducationMutation();
  const [editables, setEditables] = useState<Partial<Education>[]>([]);
  const scrollRef = useRef<ScrollView>(null);

  const proceed = useCallback(
    async (id?: string) => {
      try {
        if (!id) {
        }
        const newEd = editables.find(e => e?.id === id);
        if (!newEd) {
          showMessage({
            message: 'Kindly fill all details to proceed',
            type: 'danger',
          });
          return;
        }

        const response = await (!newEd?.id
          ? addEducation({
              body: {
                degree: newEd.degree || '',
                end_month: newEd.end_month || '',
                end_year: newEd.end_year || '',
                field_of_study: newEd.field_of_study || '',
                isCurrent: newEd.isCurrent || false,
                school_name: newEd.school_name || '',
                start_month: newEd.start_month || '',
                start_year: newEd.start_year || '',
              },
            })
          : editEducation({
              body: {
                degree: newEd.degree || '',
                end_month: newEd.end_month || '',
                end_year: newEd.end_year || '',
                field_of_study: newEd.field_of_study || '',
                isCurrent: newEd.isCurrent || false,
                school_name: newEd.school_name || '',
                start_month: newEd.start_month || '',
                start_year: newEd.start_year || '',
              },
              id: newEd?.id,
            }));
        console.log('education response:', JSON.stringify(response));
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
        setEditables(e => [
          ...e.filter(ex => ex?.id),
          // {
          //   degree: '',
          //   end_month: '',
          //   end_year: '',
          //   field_of_study: '',
          //   isCurrent: false,
          //   school_name: '',
          //   start_month: '',
          //   start_year: '',
          // },
        ]);
        showMessage({
          message: 'Education updated',
          type: 'success',
        });
        loadUserEducation();
      } catch (error) {
        console.log('wwork error:', error);
      }
    },
    [editables, addEducation, editEducation, loadUserEducation],
  );

  const removeEducation = useCallback(async () => {
    try {
      if (!selectedDeleteId) {
        showMessage({
          message: 'Kindly select an education to delete',
          type: 'danger',
        });
        return;
      }
      const response = await deleteEducation({
        id: selectedDeleteId,
      });
      setSelectedDeleteId('');
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
        message: 'Education updated',
        type: 'success',
      });
      loadUserEducation();
    } catch (error) {
      console.log('wwork error:', error);
    }
  }, [selectedDeleteId, deleteEducation, loadUserEducation]);

  useEffect(() => {
    setEditables(education);
  }, [education]);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <DeleteConfirmModal
            isVisible={selectedDeleteId.trim().length > 0 && !deleteLoading}
            closeModal={() => setSelectedDeleteId('')}
            title="Want to delete this education?"
            subtitle="This education wil be deleted from your profile. Are you sure?"
            confirmDelete={() => {
              removeEducation();
            }}
          />
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
                  <Box flexDirection="row">
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
                      Education
                    </Text>
                  </Box>
                  <Box padding="s">
                    <TouchableOpacity
                      onPress={() => {
                        setEditables(e => [
                          ...e,
                          {
                            degree: '',
                            end_month: '',
                            end_year: '',
                            field_of_study: '',
                            isCurrent: false,
                            school_name: '',
                            start_month: '',
                            start_year: '',
                          },
                        ]);
                        setTimeout(() => {
                          scrollRef.current?.scrollToEnd();
                        }, 500);
                      }}>
                      <MaterialCommunityIcons
                        name="plus"
                        size={24}
                        color={foreground}
                      />
                    </TouchableOpacity>
                  </Box>
                </Box>
                <Box flex={1}>
                  <ScrollView
                    ref={scrollRef}
                    showsVerticalScrollIndicator={false}>
                    {(deleteLoading ||
                      educationLoading ||
                      editLoading ||
                      createLoading) && (
                      <Box alignItems="center">
                        <ActivityIndicator
                          size="small"
                          color={foreground_primary}
                        />
                      </Box>
                    )}
                    {editables.length < 1 && (
                      <EmptyState
                        subtitle="No education added yet"
                        buttonText="Add education"
                        doSomething={() => {
                          setEditables(e => [
                            ...e,
                            {
                              degree: '',
                              end_month: '',
                              end_year: '',
                              field_of_study: '',
                              isCurrent: false,
                              school_name: '',
                              start_month: '',
                              start_year: '',
                            },
                          ]);
                          setTimeout(() => {
                            scrollRef.current?.scrollToEnd();
                          }, 500);
                        }}
                      />
                    )}
                    <Box
                      onStartShouldSetResponder={() => true}
                      paddingHorizontal="mid"
                      paddingVertical="l"
                      gap="l">
                      {editables.map((s, index) => (
                        <Box
                          key={s.id}
                          borderRadius={8}
                          borderWidth={1}
                          padding="mid"
                          borderColor="border">
                          <Box>
                            <Input
                              label="School Name"
                              required
                              value={s.school_name}
                              onChangeText={v => {
                                const newEditable = [...editables];
                                newEditable[index].school_name = v;
                                setEditables(newEditable);
                              }}
                            />
                          </Box>
                          <Box>
                            <Input
                              label="Degree"
                              required
                              value={s.degree}
                              onChangeText={v => {
                                const newEditable = [...editables];
                                const myEdt = { ...newEditable[index] };
                                myEdt.degree = v || '';
                                newEditable[index] = myEdt;
                                setEditables(newEditable);
                              }}
                            />
                          </Box>
                          <Box>
                            <Input
                              label="Field of Study"
                              required
                              value={s.field_of_study}
                              onChangeText={v => {
                                const newEditable = [...editables];
                                newEditable[index].field_of_study = v;
                                setEditables(newEditable);
                              }}
                            />
                          </Box>
                          <Box
                            flexDirection="row"
                            alignItems="center"
                            gap="mid">
                            <Box flex={1}>
                              <Input
                                label="Start Month"
                                required
                                value={s.start_month}
                                onChangeText={v => {
                                  const newEditable = [...editables];
                                  newEditable[index].start_month = v;
                                  setEditables(newEditable);
                                }}
                              />
                            </Box>
                            <Box flex={1}>
                              <Input
                                label="Start Year"
                                required
                                value={s.start_year}
                                onChangeText={v => {
                                  const newEditable = [...editables];
                                  newEditable[index].start_year = v;
                                  setEditables(newEditable);
                                }}
                              />
                            </Box>
                          </Box>
                          <Box
                            flexDirection="row"
                            alignItems="center"
                            gap="mid">
                            <Box flex={1}>
                              <Input
                                label="End Month"
                                required
                                value={s.end_month}
                                onChangeText={v => {
                                  const newEditable = [...editables];
                                  newEditable[index].end_month = v;
                                  setEditables(newEditable);
                                }}
                              />
                            </Box>
                            <Box flex={1}>
                              <Input
                                label="End Year"
                                required
                                value={s.end_year}
                                onChangeText={v => {
                                  const newEditable = [...editables];
                                  newEditable[index].end_year = v;
                                  setEditables(newEditable);
                                }}
                              />
                            </Box>
                          </Box>
                          <Box
                            flexDirection="row"
                            gap="mid"
                            alignItems="center">
                            <CheckBox
                              size={24}
                              checked={s?.isCurrent}
                              onPress={() => {
                                const newEditable = [...editables];
                                newEditable[index].isCurrent =
                                  !s?.isCurrent || true;
                                setEditables(newEditable);
                              }}
                            />
                            <Text>Currently Schooling</Text>
                          </Box>
                          <Box
                            flexDirection="row"
                            alignItems="center"
                            gap="mid"
                            marginBottom="m"
                            marginTop="xl">
                            <Box flex={1}>
                              <Button
                                onPress={() => {
                                  if (s?.id) {
                                    setSelectedDeleteId(s.id);
                                  } else {
                                    setEditables(e =>
                                      e.filter(
                                        ex =>
                                          ex?.id !== undefined &&
                                          ex?.id?.trim()?.length > 0,
                                      ),
                                    );
                                  }
                                }}
                                displayText="Delete"
                                textProps={{
                                  color: 'foreground',
                                }}
                                buttonProps={{
                                  backgroundColor: 'background',
                                  borderWidth: 1,
                                  borderColor: 'foreground',
                                }}
                              />
                            </Box>
                            <Box flex={1}>
                              <Button
                                displayText="Save"
                                onPress={() => {
                                  proceed(s?.id);
                                }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      ))}
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

export default ManageEducationScreen;
