import { NavigatorScreenParams } from '@react-navigation/native';
import {
  Appointment,
  Consultant,
  Conversation,
  Group,
  MiniGroup,
  Post,
  User,
  Work,
} from './types';

export type MainStack = {
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  FinishRegistration: {
    email: string;
    password: string;
    fullName: string;
  };
  SignupAvatar: undefined;
  SignupResume: undefined;
  ForgotPassword: undefined;
  SignupOTP: {
    email: string;
    password: string;
    fullName: string;
  };
  ForgotPasswordOTP: {
    email: string;
    otpHash?: string;
  };
  ResetPassword: {
    email: string;
  };

  Tabs: NavigatorScreenParams<BottomTabList>;
  CreatePost?: {
    groupId?: string;
    post?: Post;
  };
  EditPost: {
    post: Post;
  };
  EditProfile: undefined;
  PostDetails: {
    post: Post;
  };
  Profile: {
    user?: User | Consultant;
    userId?: string;
  };
  ViewProfile: {
    user?: User | Consultant;
    userId?: string;
  };
  AddWork?: {
    url?: string;
    work?: Work;
  };
  AddConsultancy?: {};
  UserPosts?: {
    posts?: Post[];
  };
  UserWorks?: {
    works?: Work[];
  };
  ManageSkills: undefined;
  ManageEducation: undefined;
  ManageExperience: undefined;
  ManageLanguages: undefined;
  UpdateContact: undefined;
  BookConsultation: {
    consultant: Consultant;
  };
  RescheduleConsultation?: {
    // consultant: Consultant;
    appointment: Appointment;
  };
  PayConsultation: {
    consultant: Consultant;
  };
  MyConsultation: undefined;
  ScheduledConsultation: undefined;
  FavouriteConsultants: undefined;
  ChatScreen?: {
    user?: User | Consultant;
    appointment?: Appointment;
    conversation?: Conversation;
  };
  CreateGroup?: {
    group?: MiniGroup | Group;
  };
  JoinGroup: {
    group: MiniGroup | Group;
  };
  ViewGroup: {
    group: MiniGroup | Group;
  };
  Settings: undefined;
  MyBusiness: undefined;
  Dashboard: undefined;
  AvailabilitySettings: undefined;
  MeetingPreference: undefined;
  Pricing: undefined;
  CalendarView: undefined;
  MyWallet: undefined;
  UserFollowing: {
    user: User;
    users: User[];
  };
  UserFollowers: {
    user: User;
    users: User[];
  };
  AccountSettings: undefined;
  PrivacySettings: undefined;
  NotificationSettings: undefined;
  PaymentSettings: undefined;
  GeneralSettings: undefined;
  SecuritySettings: undefined;
  HelpAndSupport: undefined;
};

export type BottomTabList = {
  Home: undefined;
  Consultant: undefined;
  Message: undefined;
  Communities: undefined;
  Profile: undefined;
};
