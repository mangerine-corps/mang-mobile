import { SafeAreaView } from 'react-native-safe-area-context';
import React, { ReactNode, useState } from 'react';
import Box from '@/components/Box';
import { useNavigation } from '@react-navigation/native';
import Text from './Text';
import Button from './Button';
import ErrorBoundary from 'react-native-error-boundary';
import { useThemeColors } from '@/hooks/useTheme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import firestore from '@react-native-firebase/firestore';
// import { useAuth } from '@/state/hooks/user.hook';
// import {
//   getVersion,
//   getDeviceName,
//   getManufacturer,
// } from 'react-native-device-info';
// import { ENV } from '@/utils/helpers';
// import Toast from 'react-native-toast-message';

const FallBackScreen = ({
  error,
  resetError,
}: {
  error?: Error;
  resetError?: () => void;
}) => {
  const navigation = useNavigation();
  const { pending } = useThemeColors();
  // const { user, token } = useAuth();
  const [loading] = useState(false);

  // const reportAppCrash = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const error_log_object = {
  //       user: user || null,
  //       token: token || null,
  //       error: error || null,
  //       date: new Date().toISOString(),
  //       platform: Platform.OS,
  //       version: getVersion(),
  //       device: await getDeviceName(),
  //       manufacturer: await getManufacturer(),
  //       environment: ENV,
  //       log_source: 'user_reported',
  //     };
  //     await firestore().collection('app_error_logs').add(error_log_object);
  //     setLoading(false);
  //     Toast.show({
  //       text1: 'Info',
  //       text2: 'Your crash has been reported',
  //       type: 'info',
  //     });
  //     resetError && resetError();
  //   } catch (erx) {
  //     console.log(erx);
  //     setLoading(false);
  //   }
  // }, [error, token, user, resetError]);

  // useEffect(() => {
  //   if (error) {
  //     const createLog = async () => {
  //       const error_log_object = {
  //         user: user || null,
  //         token: token || null,
  //         error: error || null,
  //         date: new Date().toISOString(),
  //         platform: Platform.OS,
  //         version: getVersion(),
  //         device: await getDeviceName(),
  //         manufacturer: await getManufacturer(),
  //         environment: ENV,
  //         log_source: 'auto_crash_log',
  //       };
  //       await firestore()
  //         .collection('auto_app_error_logs')
  //         .add(error_log_object);
  //     };
  //     createLog();
  //   }
  // }, [error, token, user]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1}>
        <Box flex={1} justifyContent="center" paddingHorizontal="l" gap="l">
          <Box alignItems="center">
            <FontAwesome name="warning" size={42} color={pending} />
          </Box>
          <Text fontSize={20} textAlign="center" variant="semibold">
            Something went wrong while loading this page
          </Text>
          <Text textAlign="center">err: {error?.message}</Text>
          <Button
            displayText="Report This Crash"
            loading={loading}
            // onPress={reportAppCrash}
          />
          <Button displayText="Try Again" onPress={resetError} />
          {navigation?.canGoBack() && (
            <Button displayText="Go back" onPress={navigation.goBack} />
          )}
        </Box>
      </Box>
    </SafeAreaView>
  );
};

const FallBackScreenNoNav = ({
  error,
  resetError,
}: {
  error?: Error;
  resetError?: () => void;
}) => {
  const { pending } = useThemeColors();
  // const { user, token } = useAuth();
  const [loading] = useState(false);

  // const reportAppCrash = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const error_log_object = {
  //       user: user || null,
  //       token: token || null,
  //       error: error || null,
  //       date: new Date().toISOString(),
  //       platform: Platform.OS,
  //       version: getVersion(),
  //       device: await getDeviceName(),
  //       manufacturer: await getManufacturer(),
  //       environment: ENV,
  //       log_source: 'user_reported',
  //     };
  //     await firestore().collection('app_error_logs').add(error_log_object);
  //     setLoading(false);
  //     Toast.show({
  //       text1: 'Info',
  //       text2: 'Your crash has been reported',
  //       type: 'info',
  //     });
  //     resetError && resetError();
  //   } catch (erx) {
  //     console.log(erx);
  //     setLoading(false);
  //   }
  // }, [error, token, user, resetError]);

  // useEffect(() => {
  //   if (error) {
  //     const createLog = async () => {
  //       const error_log_object = {
  //         user: user || null,
  //         token: token || null,
  //         error: error || null,
  //         date: new Date().toISOString(),
  //         platform: Platform.OS,
  //         version: getVersion(),
  //         device: await getDeviceName(),
  //         manufacturer: await getManufacturer(),
  //         environment: ENV,
  //         log_source: 'auto_crash_log',
  //       };
  //       await firestore()
  //         .collection('auto_app_error_logs')
  //         .add(error_log_object);
  //     };
  //     createLog();
  //   }
  // }, [error, token, user]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1}>
        <Box flex={1} justifyContent="center" paddingHorizontal="l" gap="l">
          <Box alignItems="center">
            <FontAwesome name="warning" size={42} color={pending} />
          </Box>
          <Text fontSize={20} textAlign="center" variant="semibold">
            Something went wrong while loading this page
          </Text>
          <Text textAlign="center">err: {error?.message}</Text>
          <Button
            displayText="Report This Crash"
            loading={loading}
            // onPress={reportAppCrash}
          />
          <Button displayText="Try Again" onPress={resetError} />
        </Box>
      </Box>
    </SafeAreaView>
  );
};

interface Props {
  children: ReactNode;
  err?: boolean;
  noNav?: boolean;
}

const BaseScreenComponent = ({ children, err, noNav }: Props) => {
  if (__DEV__) {
    return children;
  }
  return (
    <ErrorBoundary
      FallbackComponent={noNav ? FallBackScreenNoNav : FallBackScreen}>
      {err ? <FallBackScreen /> : <Box flex={1}>{children}</Box>}
    </ErrorBoundary>
  );
};

export default BaseScreenComponent;
