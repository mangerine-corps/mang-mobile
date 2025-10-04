import { Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Modal from './Modal';
import Box from './Box';
import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  RtcSurfaceView,
  RtcConnection,
  IRtcEngineEventHandler,
  VideoSourceType,
} from 'react-native-agora';
import { AGORA_APP_ID } from '@/utils/helpers';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import { Conversation, ErrorData } from '@/utils/types';
import { useAuth } from '@/state/hooks/user.hook';
import Text from './Text';
import FontelloCocoIcon from '@/utils/custom-fonts/FontelloCocoIcon';
import { useGetVideoTokenMutation } from '@/state/services/video.service';
import { showMessage } from 'react-native-flash-message';

interface Props {
  isVisible?: boolean;
  closeModal?: () => void;
  conversation: Conversation;
  caller: string;
}

function stringToAgoraUid(str: string): number {
  const FNV_PRIME = 0x01000193; // 16777619
  const OFFSET_BASIS = 0x811c9dc5; // 2166136261

  let hash = OFFSET_BASIS;

  for (let i = 0; i < str.length; i++) {
    // eslint-disable-next-line no-bitwise
    hash ^= str.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = (hash * FNV_PRIME) >>> 0; // Force unsigned 32-bit int
  }

  // Ensure UID is in [1, 2147483647] (non-zero positive)
  const MAX_UID = 0x7fffffff; // 2,147,483,647
  const safeUid = hash % MAX_UID;

  // Avoid zero
  return safeUid === 0 ? 12345 : safeUid;
}
const appId = AGORA_APP_ID;

const AgoraCallModal = ({
  isVisible,
  closeModal,
  conversation,
}: // caller,
Props) => {
  const { user } = useAuth();
  const agoraEngineRef = useRef<IRtcEngine>(null);
  // Define basic information
  const [isJoined, setIsJoined] = useState(false); // Whether the local user has joined the channel
  // const [isHost] = useState(conversation?.consultantId === user?.id); // User role
  const isHost = true; // User role
  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user
  const channelName = conversation?.id;
  // const localUid = 0; // Local user Uid, no need to modify
  const localUid = stringToAgoraUid(user?.id!);
  const eventHandler = useRef<IRtcEngineEventHandler>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraMuted, setIsCameraMuted] = useState(false);
  const otherUser = useMemo(
    () =>
      conversation?.consultantId === user?.id
        ? conversation?.user
        : conversation?.consultant,
    [conversation, user],
  );
  const [triggerJoin, setTriggerJoin] = useState(false);
  const [getVideoToken, {}] = useGetVideoTokenMutation();
  const [videoToken, setVideoToken] = useState('');

  const loadVideoToken = useCallback(async () => {
    try {
      if (!user?.id || !conversation?.id) {
        return;
      }
      const response = await getVideoToken({
        channelName: conversation?.id,
      });
      console.log('videoToken response', response);
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
      setVideoToken((response as any)?.data?.token || '');
      // loadConversations();
    } catch (error) {
      console.log('get availability error', JSON.stringify(error));
    }
  }, [getVideoToken, conversation, user]);

  const toggleMic = () => {
    const mute = !isMicMuted;
    agoraEngineRef.current?.muteLocalAudioStream(mute);
    setIsMicMuted(mute);
  };

  const toggleCamera = () => {
    const mute = !isCameraMuted;
    agoraEngineRef.current?.muteLocalVideoStream(mute);
    setIsCameraMuted(mute);
  };

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await requestMultiple([
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.CAMERA,
      ]);
    } else {
      await requestMultiple([
        PERMISSIONS.IOS.MICROPHONE,
        PERMISSIONS.IOS.CAMERA,
      ]);
    }
  };

  // const checkPermissions = async () => {
  //   const mic = await check(
  //     Platform.OS === 'android'
  //       ? PERMISSIONS.ANDROID.RECORD_AUDIO
  //       : PERMISSIONS.IOS.MICROPHONE,
  //   );

  //   const cam = await check(
  //     Platform.OS === 'android'
  //       ? PERMISSIONS.ANDROID.CAMERA
  //       : PERMISSIONS.IOS.CAMERA,
  //   );

  //   console.log('Mic permission:', mic);
  //   console.log('Cam permission:', cam);
  // };

  /// new life

  const setupEventHandler = useCallback(() => {
    eventHandler.current = {
      onJoinChannelSuccess: (...args) => {
        console.log('onJoinChannelSuccess', ...args);
        // setMessage('Successfully joined channel: ' + channelName);
        setIsJoined(true);
      },
      onUserJoined: (_connection: RtcConnection, uid: number) => {
        // setMessage('Remote user ' + uid + ' joined');
        setRemoteUid(uid);
      },
      onUserOffline: (_connection: RtcConnection, uid: number) => {
        // setMessage('Remote user ' + uid + ' left the channel');
        setRemoteUid(uid);
      },
      onError: err => {
        console.log('Agora Error:', err);
        // setMessage('Agora Error: ' + JSON.stringify(err));
      },
    };

    console.log('registering handler...');
    agoraEngineRef.current?.registerEventHandler({
      onJoinChannelSuccess: (...args) => {
        console.log('onJoinChannelSuccess', ...args);
        // setMessage('Successfully joined channel: ' + channelName);
        setIsJoined(true);
      },
      onUserJoined: (_connection: RtcConnection, uid: number) => {
        // setMessage('Remote user ' + uid + ' joined');
        setRemoteUid(uid);
      },
      onUserOffline: (_connection: RtcConnection, uid: number) => {
        // setMessage('Remote user ' + uid + ' left the channel');
        setRemoteUid(uid);
      },
      onError: err => {
        console.log('Agora Error:', err);
        // setMessage('Agora Error: ' + JSON.stringify(err));
      },
    });
    console.log('registered handler...');
    setTriggerJoin(true);
  }, []);

  const setupVideoSDKEngine = useCallback(async () => {
    try {
      if (Platform.OS === 'android') {
        await getPermission();
      }
      console.log('setting up engine...');
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;
      console.log('initiaizing engine...');
      await agoraEngine.initialize({ appId: appId });
      console.log('initialized engine...');
      console.log('enabling video and starting preview...');
      agoraEngine.enableVideo();
      agoraEngine.startPreview();
      console.log('enabled video and started preview...');
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      const init = async () => {
        await setupVideoSDKEngine();
        setupEventHandler();
      };
      init();
    }
    return () => {
      if (isVisible) {
        cleanupAgoraEngine();
      } // Ensure this is synchronous
    };
  }, [isVisible, setupEventHandler, setupVideoSDKEngine]); // Empty dependency array ensures it runs only once

  // const setupLocalVideo = () => {
  //   agoraEngineRef.current?.enableVideo();
  //   agoraEngineRef.current?.startPreview();
  // };
  // Define the join method called after clicking the join channel button
  const join = useCallback(async () => {
    if (!videoToken) {
      return;
    }
    if (isJoined) {
      return;
    }
    try {
      console.log('joining channel...');
      if (isHost) {
        console.log('as host...');
        console.log('JOIN DEBUG:', { videoToken, channelName, localUid });
        // Join the channel as a broadcaster
        agoraEngineRef.current?.joinChannel(videoToken, channelName, localUid, {
          // Set channel profile to live broadcast
          channelProfile: ChannelProfileType.ChannelProfileCommunication,
          // Set user role to broadcaster
          clientRoleType: ClientRoleType.ClientRoleBroadcaster,
          // Publish audio collected by the microphone
          publishMicrophoneTrack: true,
          // Publish video collected by the camera
          publishCameraTrack: true,
          // Automatically subscribe to all audio streams
          autoSubscribeAudio: true,
          // Automatically subscribe to all video streams
          autoSubscribeVideo: true,
          token: videoToken,
        });
        agoraEngineRef.current?.enableLocalVideo(true);
        agoraEngineRef.current?.enableLocalAudio(true);
        console.log('joined...');
      } else {
        console.log('as non host...');
        console.log('JOIN DEBUG:', { videoToken, channelName, localUid });
        // Join the channel as an audience
        agoraEngineRef.current?.joinChannel(videoToken, channelName, localUid, {
          // Set channel profile to live broadcast
          channelProfile: ChannelProfileType.ChannelProfileCommunication,
          // Set user role to audience
          clientRoleType: ClientRoleType.ClientRoleAudience,
          // Do not publish audio collected by the microphone
          publishMicrophoneTrack: false,
          // Do not publish video collected by the camera
          publishCameraTrack: false,
          // Automatically subscribe to all audio streams
          autoSubscribeAudio: true,
          // Automatically subscribe to all video streams
          autoSubscribeVideo: true,
        });
        console.log('joined...');
      }
    } catch (e) {
      console.log(e);
    }
  }, [channelName, isHost, isJoined, localUid, videoToken]);

  // Define the leave method called after clicking the leave channel button
  const leave = useCallback(() => {
    try {
      console.log('leaving...');
      // Call leaveChannel method to leave the channel
      agoraEngineRef.current?.leaveChannel();
      setRemoteUid(0);
      setIsJoined(false);
      closeModal && closeModal();
      console.log('left...');
      // showMessage('Left the channel');
    } catch (e) {
      console.log(e);
    }
  }, [closeModal]);

  const cleanupAgoraEngine = () => {
    console.log('cleaning engine...');
    agoraEngineRef.current?.unregisterEventHandler(eventHandler.current!);
    agoraEngineRef.current?.release();
    console.log('cleaned engine...');
  };

  useEffect(() => {
    if (triggerJoin) {
      setTriggerJoin(false);
      join();
    }
  }, [triggerJoin, join]);

  useEffect(() => {
    loadVideoToken();
  }, [loadVideoToken]);

  return (
    <Modal style={{ margin: 0 }} isVisible={isVisible}>
      <Box flex={1} backgroundColor="faded">
        <SafeAreaView
          style={{
            flex: 1,
          }}>
          <Box
            flex={1}
            backgroundColor="faded"
            position="relative"
            justifyContent="center">
            <Box flex={1}>
              {isJoined && remoteUid !== 0 ? (
                <React.Fragment key={remoteUid}>
                  <RtcSurfaceView
                    canvas={{
                      uid: remoteUid,
                      sourceType: VideoSourceType.VideoSourceCamera,
                    }}
                    style={{
                      height: '100%',
                      width: '100%',
                    }}
                  />
                </React.Fragment>
              ) : (
                <Box paddingTop="l">
                  <Text textAlign="center">
                    {isJoined && !isHost
                      ? 'Call from ' + otherUser?.fullName
                      : 'Call with ' + otherUser?.fullName}
                  </Text>
                </Box>
              )}
            </Box>

            <Box position="absolute" bottom={60} left={0} width="100%">
              <Box
                flexDirection="row"
                justifyContent="flex-end"
                marginBottom="l"
                paddingHorizontal="l">
                {isVisible && (
                  <Box
                    width={125}
                    height={188}
                    borderRadius={8}
                    overflow="hidden"
                    backgroundColor="placeholder">
                    <RtcSurfaceView
                      canvas={{
                        uid: localUid,
                        sourceType: VideoSourceType.VideoSourceCamera,
                      }}
                      style={{
                        height: '100%',
                        width: '100%',
                      }}
                    />
                  </Box>
                )}
              </Box>
              <Box paddingHorizontal="l">
                <Box
                  flexDirection="row"
                  borderRadius={100}
                  justifyContent="space-between"
                  backgroundColor="minute_black"
                  paddingHorizontal="l"
                  paddingVertical="mid"
                  alignItems="center">
                  <Box>
                    <TouchableOpacity onPress={toggleMic}>
                      <Box
                        height={40}
                        width={40}
                        justifyContent="center"
                        alignItems="center"
                        borderRadius={40}
                        backgroundColor={isMicMuted ? 'label' : 'white'}
                        overflow="hidden">
                        <FontelloCocoIcon name="mic" size={24} color="#000" />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                  <Box>
                    <TouchableOpacity onPress={toggleCamera}>
                      <Box
                        height={40}
                        width={40}
                        justifyContent="center"
                        alignItems="center"
                        borderRadius={40}
                        overflow="hidden"
                        backgroundColor="white">
                        <FontelloCocoIcon name="video" size={24} color="#000" />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                  {!isHost && !isJoined && (
                    <Box>
                      <TouchableOpacity onPress={join}>
                        <Box
                          height={40}
                          width={40}
                          justifyContent="center"
                          alignItems="center"
                          borderRadius={40}
                          overflow="hidden"
                          backgroundColor="success">
                          <FontelloCocoIcon
                            name="phone"
                            size={24}
                            color="#FFF"
                          />
                        </Box>
                      </TouchableOpacity>
                    </Box>
                  )}
                  <Box>
                    <TouchableOpacity onPress={leave}>
                      <Box
                        height={40}
                        width={40}
                        justifyContent="center"
                        alignItems="center"
                        borderRadius={40}
                        overflow="hidden"
                        backgroundColor="danger">
                        <FontelloCocoIcon name="phone" size={24} color="#FFF" />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </Modal>
  );
};

export default AgoraCallModal;
