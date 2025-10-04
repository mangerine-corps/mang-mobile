import React, { useCallback, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStack as MainStackType } from '@/utils/ParamList';
import Onboarding from '@/screens/Authentication/OnboardingScreen';
import LoginScreen from '@/screens/Authentication/LoginScreen';
import ForgotPasswordScreen from '@/screens/Authentication/ForgotPasswordScreen';
import ForgotPasswordOTPScreen from '@/screens/Authentication/ForgotPasswordOTPScreen';
import ResetPasswordScreen from '@/screens/Authentication/ResetPasswordScreen';
import SignupScreen from '@/screens/Authentication/SignupScreen';
import SignupOTPScreen from '@/screens/Authentication/SignupOTPScreen';
import FinishRegistrationScreen from '@/screens/Authentication/FinishRegistrationScreen';
import SignupAvatarScreen from '@/screens/Authentication/SignupAvatarScreen';
import SignupResumeScreen from '@/screens/Authentication/SignupResumeScreen';
import BottomTab from './BottomTab';
import { useAuth } from '@/state/hooks/user.hook';
import { useLoadAuth } from '@/state/hooks/loadauth.hook';
import { useDispatch } from 'react-redux';
import { setAuthTrigger } from '@/state/reducers/user.reducer';
import CreatePostScreen from '@/screens/Post/CreatePostScreen';
import PostDetailsScreen from '@/screens/Post/PostDetailsScreen';
import EditProfileScreen from '@/screens/Main/EditProfileScreen';
import { useLoadPosts } from '@/state/hooks/loadposts.hook';
import ProfileScreen from '@/screens/Tabs/ProfileScreen';
import AddWorkScreen from '@/screens/Main/AddWorkScreen';
import UserPostsScreen from '@/screens/Main/UserPostsScreen';
import UpdateContactScreen from '@/screens/Main/UpdateContactScreen';
import ManageSkillsScreen from '@/screens/Main/ManageSkillsScreen';
import ManageEducationScreen from '@/screens/Main/ManageEducationScreen';
import ManageExperienceScreen from '@/screens/Main/ManageExperienceScreen';
import ManageLanguagesScreen from '@/screens/Main/ManageLanguagesScreen';
import ViewProfileScreen from '@/screens/Main/ViewProfileScreen';
import BookConsultationScreen from '@/screens/Main/BookConsultationScreen';
import PayConsultationScreen from '@/screens/Main/PayConsultationScreen';
import ChatScreen from '@/screens/Main/ChatScreen';
import CreateGroupScreen from '@/screens/Main/CreateGroupScreen';
import SettingsScreen from '@/screens/Main/SettingsScreen';
import AccountSettingScreen from '@/screens/Main/AccountSettingScreen';
import PrivacySettingscreen from '@/screens/Main/PrivacySettingScreen';
import NotificationSettingscreen from '@/screens/Main/NotificationSettingsScreen';
import PaymentSettingscreen from '@/screens/Main/PaymentSettingsScreen';
import HelpAndSupportcreen from '@/screens/Main/HelpAndSupportScreen';
import SecuritySettingscreen from '@/screens/Main/SecuritySettingScreen';
import GeneralSettingscreen from '@/screens/Main/GeneralSettingScreen';
import JoinGroupScreen from '@/screens/Main/JoinGroupScreen';
import ViewGroupScreen from '@/screens/Main/ViewGroupScreen';
import UserFollowingScreen from '@/screens/Main/UserFollowingScreen';
import UserFollowersScreen from '@/screens/Main/UserFollowersScreen';
import AddConsultancyScreen from '@/screens/Main/AddConsultancyScreen';
import MyConsultationScreen from '@/screens/Main/MyConsultationScreen';
import ScheduledConsultationScreen from '@/screens/Main/ScheduledConsultationScreen';
import FavouriteConsultantsScreen from '@/screens/Main/FavoriteConsultantsScreen';
import MyBusinessScreen from '@/screens/Main/MyBusinessScreen';
import RescheduleConsultationScreen from '@/screens/Main/RescehduleConsultationScreen';
import { useLoadConversations } from '@/state/hooks/loadchat.hook';
import { useSocketContext } from '@/state/context/SocketProvider';
import { MessageType } from '@/utils/types';
import { addMessageToConversationByConversationId } from '@/state/reducers/chat.reducer';
import MyDashboardScreen from '@/screens/Main/MyDashboardScreen';
import AvailabilitySettingsScreen from '@/screens/Main/AvailabilitySettingsScreen';
import MeetingPreferenceScreen from '@/screens/Main/MeetingPreferenceScreen';
import PricingScreen from '@/screens/Main/PricingScreen';
import CalendarViewScreen from '@/screens/Main/CalendarViewScreen';
import UserWorksScreen from '@/screens/Main/UserWorksScreen';
import { useLoadSettings } from '@/state/hooks/loadsettings.hook';

const Stack = createNativeStackNavigator<MainStackType>();

const MainStack = () => {
  const { token, authTrigger, authBlocked, user } = useAuth();
  const {
    loadAuth,
    profileLoading,
    loadUserSkills,
    loadUserEducation,
    loadUserExperience,
    loadUserLanguages,
    loadUserFollowers,
    loadUserFollows,
    loadUserConsultancy,
    loadPricing,
  } = useLoadAuth();
  const { loadUserPosts, loadUserWorks } = useLoadPosts();
  const { loadSettings } = useLoadSettings();
  const dispatch = useDispatch();
  const { loadConversations } = useLoadConversations();
  const { socket } = useSocketContext();

  const addMessage = useCallback(
    (message: MessageType) => {
      dispatch(
        addMessageToConversationByConversationId({
          value: message,
        }),
      );
    },
    [dispatch],
  );

  const runMain = useCallback(() => {
    loadAuth();
    loadUserPosts();
    loadUserWorks();
    loadUserSkills();
    loadUserEducation();
    loadUserExperience();
    loadUserLanguages();
    loadUserFollowers();
    loadUserFollows();
    loadUserConsultancy();
    loadConversations();
    loadPricing();
    loadSettings();
  }, [
    loadAuth,
    loadUserPosts,
    loadUserWorks,
    loadUserSkills,
    loadUserEducation,
    loadUserExperience,
    loadUserLanguages,
    loadUserFollows,
    loadUserFollowers,
    loadUserConsultancy,
    loadConversations,
    loadPricing,
    loadSettings,
  ]);

  useEffect(() => {
    if (authTrigger && token && !profileLoading) {
      runMain();
      dispatch(setAuthTrigger({ trigger: false }));
    }
  }, [authTrigger, runMain, dispatch, profileLoading, token]);

  useEffect(() => {
    dispatch(
      setAuthTrigger({
        trigger: true,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('newChatMessage', addMessage);
      // socket.on('newChatMessage', () => {
      //   console.log('new Message triggered');
      // });
    }

    return () => {
      if (socket) {
        socket.off('newChatMessage', addMessage);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {!(token && user && !authBlocked) ? (
        <Stack.Group>
          <Stack.Screen name="Onboarding" component={Onboarding} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen
            name="ForgotPasswordOTP"
            component={ForgotPasswordOTPScreen}
          />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="SignupOTP" component={SignupOTPScreen} />
          <Stack.Screen
            name="FinishRegistration"
            component={FinishRegistrationScreen}
          />
          <Stack.Screen name="SignupAvatar" component={SignupAvatarScreen} />
          <Stack.Screen name="SignupResume" component={SignupResumeScreen} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          <Stack.Screen name="Tabs" component={BottomTab} />
          <Stack.Screen name="CreatePost" component={CreatePostScreen} />
          <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen as any} />
          <Stack.Screen name="AddWork" component={AddWorkScreen} />
          <Stack.Screen
            name="AddConsultancy"
            component={AddConsultancyScreen}
          />
          <Stack.Screen name="UserPosts" component={UserPostsScreen} />
          <Stack.Screen name="UserWorks" component={UserWorksScreen} />
          <Stack.Screen name="UpdateContact" component={UpdateContactScreen} />
          <Stack.Screen name="ManageSkills" component={ManageSkillsScreen} />
          <Stack.Screen
            name="ManageEducation"
            component={ManageEducationScreen}
          />
          <Stack.Screen
            name="ManageExperience"
            component={ManageExperienceScreen}
          />
          <Stack.Screen
            name="ManageLanguages"
            component={ManageLanguagesScreen}
          />
          <Stack.Screen name="ViewProfile" component={ViewProfileScreen} />
          <Stack.Screen
            name="BookConsultation"
            component={BookConsultationScreen}
          />
          <Stack.Screen
            name="PayConsultation"
            component={PayConsultationScreen}
          />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
          <Stack.Screen name="JoinGroup" component={JoinGroupScreen} />
          <Stack.Screen name="ViewGroup" component={ViewGroupScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="MyBusiness" component={MyBusinessScreen} />
          <Stack.Screen name="Dashboard" component={MyDashboardScreen} />
          <Stack.Screen
            name="AvailabilitySettings"
            component={AvailabilitySettingsScreen}
          />
          <Stack.Screen
            name="MeetingPreference"
            component={MeetingPreferenceScreen}
          />
          <Stack.Screen name="Pricing" component={PricingScreen} />
          <Stack.Screen name="CalendarView" component={CalendarViewScreen} />
          <Stack.Screen
            name="AccountSettings"
            component={AccountSettingScreen}
          />
          <Stack.Screen
            name="PrivacySettings"
            component={PrivacySettingscreen}
          />
          <Stack.Screen
            name="NotificationSettings"
            component={NotificationSettingscreen}
          />
          <Stack.Screen
            name="PaymentSettings"
            component={PaymentSettingscreen}
          />
          <Stack.Screen
            name="SecuritySettings"
            component={SecuritySettingscreen}
          />
          <Stack.Screen
            name="MyConsultation"
            component={MyConsultationScreen}
          />
          <Stack.Screen
            name="ScheduledConsultation"
            component={ScheduledConsultationScreen}
          />
          <Stack.Screen
            name="RescheduleConsultation"
            component={RescheduleConsultationScreen}
          />
          <Stack.Screen
            name="FavouriteConsultants"
            component={FavouriteConsultantsScreen}
          />
          <Stack.Screen
            name="GeneralSettings"
            component={GeneralSettingscreen}
          />
          <Stack.Screen name="HelpAndSupport" component={HelpAndSupportcreen} />
          <Stack.Screen name="UserFollowing" component={UserFollowingScreen} />
          <Stack.Screen name="UserFollowers" component={UserFollowersScreen} />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default MainStack;
