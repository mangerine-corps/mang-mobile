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
import React, { useCallback, useRef, useState } from 'react';
import Box from '@/components/Box';
import { useThemeColors } from '@/hooks/useTheme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '@/components/Text';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';
import {
  useAddSkillMutation,
  useDeleteSkillMutation,
} from '@/state/services/users.service';
import { useAuth } from '@/state/hooks/user.hook';
import { useLoadAuth } from '@/state/hooks/loadauth.hook';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';

const ManageSkillsScreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'ManageSkills'>) => {
  const { skills = [] } = useAuth();
  const { foreground, danger, foreground_primary } = useThemeColors();
  const { loadUserSkills, skillsLoading } = useLoadAuth();
  const [createSkill, { isLoading: createLoading }] = useAddSkillMutation();
  const [deleteSkill, { isLoading: deleteLoading }] = useDeleteSkillMutation();
  const [selectedDeleteId, setSelectedDeleteId] = useState('');
  const [skillsToAdd, setSkillsToAdd] = useState<string[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [addNew, setAddNew] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const proceed = useCallback(
    async (addSkill?: string) => {
      try {
        if ((skillsToAdd.length < 1 || !newTitle) && !addSkill?.trim()) {
          showMessage({
            message: 'Kindly add a title and add skills to proceed',
            type: 'danger',
          });
          return;
        }

        const response = await createSkill({
          body: {
            name: newTitle,
            skills: addSkill ? [...skillsToAdd, addSkill.trim()] : skillsToAdd,
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
        setNewSkill('');
        setNewTitle('');
        setSkillsToAdd([]);
        setAddNew(false);
        showMessage({
          message: 'You have added a new skill',
          type: 'success',
        });
        loadUserSkills();
      } catch (error) {
        console.log('wwork error:', error);
      }
    },
    [skillsToAdd, newTitle, createSkill, loadUserSkills],
  );

  const removeSkill = useCallback(async () => {
    try {
      if (!selectedDeleteId) {
        showMessage({
          message: 'Kindly select a skill to delete',
          type: 'danger',
        });
        return;
      }
      const response = await deleteSkill({
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
        message: 'You have removed a skill',
        type: 'success',
      });
      loadUserSkills();
    } catch (error) {
      console.log('wwork error:', error);
    }
  }, [selectedDeleteId, deleteSkill, loadUserSkills]);

  return (
    <BaseScreenComponent>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <Box flex={1} backgroundColor="background">
          <DeleteConfirmModal
            isVisible={selectedDeleteId.trim().length > 0 && !deleteLoading}
            closeModal={() => setSelectedDeleteId('')}
            title="Want to delete this skill?"
            subtitle="This skill wil be deleted from your profile. Are you sure?"
            confirmDelete={() => {
              removeSkill();
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
                      Skills
                    </Text>
                  </Box>
                  <Box padding="s">
                    <TouchableOpacity
                      onPress={() => {
                        setNewTitle('');
                        setNewSkill('');
                        setSkillsToAdd([]);
                        setAddNew(true);
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
                    onContentSizeChange={() => {
                      scrollRef.current?.scrollToEnd();
                    }}
                    showsVerticalScrollIndicator={false}>
                    <Box
                      onStartShouldSetResponder={() => true}
                      paddingHorizontal="mid"
                      paddingVertical="l"
                      gap="l">
                      {(deleteLoading || skillsLoading) && (
                        <Box alignItems="center">
                          <ActivityIndicator
                            size="small"
                            color={foreground_primary}
                          />
                        </Box>
                      )}
                      {skills.map(s => (
                        <Box
                          key={s.id}
                          borderRadius={8}
                          borderWidth={1}
                          padding="mid"
                          borderColor="border">
                          <Box flexDirection="row" justifyContent="flex-end">
                            <Box
                              flexDirection="row"
                              gap="mid"
                              alignItems="center">
                              <TouchableOpacity
                                onPress={() => {
                                  setSelectedDeleteId(s.id);
                                }}>
                                <Box padding="s">
                                  <MaterialCommunityIcons
                                    name="trash-can-outline"
                                    size={24}
                                    color={danger}
                                  />
                                </Box>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => {
                                  setNewTitle(s.name);
                                  setSkillsToAdd(s.skills);
                                  setNewSkill('');
                                  setAddNew(true);
                                }}
                                style={{ padding: 8 }}>
                                <MaterialCommunityIcons
                                  name="content-copy"
                                  size={18}
                                  color={foreground}
                                />
                              </TouchableOpacity>
                            </Box>
                          </Box>
                          <Box>
                            <Input
                              label="Skill Name"
                              dud
                              required
                              value={s.name}
                            />
                          </Box>
                          <Box paddingBottom="mid">
                            <Text
                              fontSize={12}
                              color={'label'}
                              marginBottom="s">
                              Skills
                            </Text>
                            <Box>
                              <Text>{s.skills.join(', ')}</Text>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                      {addNew && (
                        <Box
                          marginBottom="mxl"
                          borderRadius={8}
                          borderWidth={1}
                          padding="mid"
                          borderColor="border">
                          <Box>
                            <Input
                              label="Skill Name"
                              value={newTitle}
                              required
                              onChangeText={setNewTitle}
                            />
                          </Box>
                          <Box>
                            <Input
                              label="Skills"
                              placeholder="Enter a skill and press enter to enter multiple skills"
                              value={newSkill}
                              onChangeText={setNewSkill}
                              onSubmitEditing={() => {
                                if (!newSkill) {
                                  return;
                                }
                                setSkillsToAdd(s => [...s, newSkill]);
                                setNewSkill('');
                              }}
                            />
                            <Box>
                              <Text>{skillsToAdd.join(', ')}</Text>
                            </Box>
                          </Box>
                          <Box marginTop="mid">
                            <Button
                              displayText="Save Skill"
                              onPress={() => {
                                proceed(newSkill);
                              }}
                              loading={createLoading}
                            />
                          </Box>
                        </Box>
                      )}
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

export default ManageSkillsScreen;
