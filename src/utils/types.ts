export interface CustomSVGProps {
  color?: string;
}

export interface ErrorData {
  error: {
    status: number;
    data: {
      message: string;
      error: string;
      statusCode: number;
    };
  };
}

export interface UserType {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interest {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AllowedFileData {
  file: any;
}

export interface FileUploadData
  extends Record<keyof AllowedFileData, string | Blob> {}

export interface User {
  fullName: string;
  email: string;
  businessName: string;
  location: string;
  password: string;
  interests: Interest[];
  userType: UserType;
  websiteAddress: string | null;
  mobileNumber: string | null;
  secondaryNumber: string | null;
  postalAddress: string | null;
  dateOfBirth: string | null;
  title: string | null;
  profilePics: string | null;
  profilePicsId: string | null;
  profileBanner: string | null;
  profileBannerId: string | null;
  resume: string | null;
  videoIntro: string | null;
  bio: string | null;
  isConsultant: boolean;
  videoIntroPubId: string | null;
  messagingPreference: string;
  id: string;
  step: number;
  authType: string;
  pricingPlan: string;
  billingCycle: string;
  isVerified: boolean;
  isActive: boolean;
  regComplete: boolean;
  followerCount: number;
  createdAt: string;
  updatedAt: string;
  appearInSearchResults: boolean;
  emailVisible: boolean;
  websiteVisible: boolean;
  phoneVisible: boolean;
}

export interface Post {
  id: string;
  content: string;
  images: string[];
  likeCount: number;
  reportCount: number;
  commentCount: number;
  likes: {
    id: string;
    fullName: string;
    profilePics: string;
    followerCount: number;
  }[];
  shareCount: number;
  createdAt: string;
  creator: {
    id: string;
    fullName: string;
    followerCount: number;
    createdAt: string;
    updatedAt: string;
    profilePics: string;
  };
}

export interface CompleteComment {
  id: number;
  comment: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  author: {
    id: string;
    fullName: string;
    profilePics: string;
  };
  post: { id: string };
  likes: {
    id: string;
    fullName: string;
    profilePics: string;
    followerCount: number;
  }[];
}

export interface Comment {
  id: number;
  comment: string;
  createdAt: string;
  creator: {
    id: string;
    fullName: string;
    profilePics: string;
  };
}

export interface CommentReplies {
  id: number;
  comment: string;
  createdAt: string;
  replyCount: number;
  likeCount: number;
  commentCount: number;
  author: {
    id: string;
    fullName: string;
    profilePics: string;
  };
  parent: { id: number };
  likes: {
    id: string;
    fullName: string;
    profilePics: string;
    followerCount: number;
  }[];
}

export interface Work {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  file: string;
  file_public_id: string;
  link: string;
}

export interface Skill {
  id: string;
  name: string;
  skills: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  school_name: string;
  degree: string;
  field_of_study: string;
  start_month: string;
  start_year: string;
  end_month: string;
  end_year: string;
  isCurrent: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  title: string;
  employment_type: string;
  company_name: string;
  location: string;
  start_month: string;
  start_year: string;
  end_month: string;
  end_year: string;
  isCurrent: boolean;
  created_at: string;
  updated_at: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Consultant extends User {
  works: Work[];
  skills: Skill[];
  languages: Language[];
  educations: Education[];
  experiences: Experience[];
  isConsultant: boolean;
}

export interface Group {
  id: string;
  category: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  name: string;
  description: string;
  image: string;
  rules: string;
  questionnaire: string;
  isPrivate: boolean;
  updatedAt: string;
  createdAt: string;
  creator: User;
  users: User[];
}

export interface MiniGroup {
  id: string;
  category: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  name: string;
  description: string;
  image: string;
  rules: string;
  questionnaire: string;
  isPrivate: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface Availability {
  id: string;
  date: string;
  isRecurring: boolean;
  timeslots: {
    id: string;
    startTime: string;
    endTime: string;
    duration: number;
    isBooked: boolean;
  }[];
}

export interface Appointment {
  id: string;
  userId: string;
  consultantId: string;
  availabilityId: string;
  message: string;
  videoOption: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  timeslots: [
    {
      id: string;
      startTime: string;
      endTime: string;
      duration: number;
      isBooked: boolean;
    },
  ];
  user: User;
  consultant: Consultant;
  availability: {
    id: string;
    date: string;
    isRecurring: boolean;
  };
}

export interface Conversation {
  id: string;
  userId: string;
  consultantId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    agoraId: string | null;
    profilePics: string;
  };
  consultant: {
    id: string;
    fullName: string;
    agoraId: string | null;
    profilePics: string;
  };
  lastAppointment: {
    id: string;
    userId: string;
    consultantId: string;
    availabilityId: string;
    message: string;
    videoOption: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface MessageType {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  parentId: null;
  content: string;
  isSeen: false;
  seenAt: null;
  editedAt: null;
  isDeleted: false;
  deletedAt: null;
  deletedBySender: false;
  deletedByReceiver: false;
  isFlagged: false;
  isReply: false;
  status: string;
  createdAt: string;
  parent: null;
  attachments: {
    id: string;
    messageId: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    url: string;
    type: string;
    uploadedAt: string;
  }[];
}

export interface LocalConversations {
  conversation: Conversation;
  messages: MessageType[];
  lastMessage?: MessageType;
}

export interface Consultancy {
  id: string;
  title: string;
  description: string;
  hours: number;
  file: string;
  file_public_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface PricingObject {
  currency: string;
  flatPrice: string;
  dayBookPercentage: number;
  midDayBookPercentage: number;
  twoHoursDiscount: number;
  threeHoursDiscount: number;
  fourHoursDiscount: number;
  otherHoursDiscount: number;
}
