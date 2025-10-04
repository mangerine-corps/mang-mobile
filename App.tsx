/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef } from 'react';
import MainStack from '@/navigators/MainStack';
import theme, { darkTheme } from '@/utils/theme';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from '@shopify/restyle';
import BootSplash from 'react-native-bootsplash';
import { Platform, StatusBar, useColorScheme } from 'react-native';
// import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { SmileID } from '@smile_identity/react-native';
// import BaseScreenComponent from '@/components/BaseScreenComponent';
import { useThemeColors } from '@/hooks/useTheme';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
import { store } from '@/state/store';
import { useSetting } from '@/state/hooks/setting.hook';
import { SocketProvider } from '@/state/context/SocketProvider';
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLIC_KEY } from '@/utils/helpers';

const persistor = persistStore(store);

export const RootNav = () => {
  const navigationRef = useRef(null);
  const { background } = useThemeColors();

  return (
    <NavigationContainer
      onReady={() => {
        const init = async () => {
          try {
            await BootSplash.hide({
              fade: true,
            });
          } catch (error) {
            console.log('splash error: ', error);
          }
        };
        setTimeout(() => {
          init();
          // SmileID.initialize(__DEV__ ? true : false);
        }, 2000);
      }}
      theme={{
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: background,
        },
      }}
      ref={navigationRef}>
      <MainStack />
      <StatusBar backgroundColor={background} barStyle="dark-content" />
      {/* <MyToast /> */}
      <FlashMessage
        position="top"
        hideStatusBar={Platform.OS === 'android' ? false : undefined}
        statusBarHeight={
          Platform.OS === 'android' ? StatusBar.currentHeight : undefined
        }
      />
    </NavigationContainer>
  );
};

export const ThemeHandler = () => {
  const { theme: appTheme } = useSetting();
  const system = useColorScheme();
  const isDarkTheme =
    appTheme === 'dark' || (appTheme === 'system' && system === 'dark');

  useEffect(() => {
    if (isDarkTheme) {
      StatusBar.setBarStyle('light-content');
    } else {
      StatusBar.setBarStyle('dark-content');
    }
  }, [isDarkTheme]);

  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : theme}>
      {/* <BaseScreenComponent noNav> */}
      <SocketProvider>
        <RootNav />
      </SocketProvider>
      {/* </BaseScreenComponent> */}
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <>
      <StripeProvider publishableKey={STRIPE_PUBLIC_KEY!}>
        <GestureHandlerRootView>
          <SafeAreaProvider>
            <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
                <ThemeHandler />
              </PersistGate>
            </Provider>
          </SafeAreaProvider>
        </GestureHandlerRootView>
      </StripeProvider>
    </>
  );
};

export default App;
