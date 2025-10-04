import { useCallback, useMemo, useState } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
// import { GOOGLE_IOS_CLIENT_ID } from '@/utils/helpers';
// import { appleAuth } from '@invertase/react-native-apple-authentication';

import { useDispatch } from 'react-redux';
import { setCredentials } from '@/state/reducers/user.reducer';
import { useGoogleLoginMutation } from '@/state/services/auth.service';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';

export const useSocialAuth = () => {
  // const { existingApple = [] } = useAuth();
  const dispatch = useDispatch();
  const [fatalError] = useState('');
  const [googleSignin, { isLoading: googleLoading }] = useGoogleLoginMutation();
  // const [appleSignin, { isLoading: appleLoading }] =
  //   useLoginWithAppleMutation();
  const appleLoading = false;

  const doGoogleAuth = useCallback(async () => {
    try {
      GoogleSignin.configure({
        webClientId:
          '336729115608-6gh1td9gbifkpellahkbj42tg1s4ovtl.apps.googleusercontent.com',
        offlineAccess: true,
        // iosClientId: GOOGLE_IOS_CLIENT_ID,
      });
      await GoogleSignin.signOut();
      const currentUser = await GoogleSignin.getCurrentUser();
      if (!currentUser) {
        const mode = 'signup';
        const signIn = await GoogleSignin.signIn();
        if (mode === 'signup' && signIn.data) {
          const response = await googleSignin({
            body: {
              access_token: signIn.data.idToken!,
            },
          });
          // console.log('response', JSON.stringify(response));
          if ((response as any)?.error) {
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
          const r = (response as any)?.data?.data;
          dispatch(
            setCredentials({
              token: r?.token,
              user: r?.user,
            }),
          );
        } else {
          //
        }
      } else {
        const mode = 'signup';
        if (mode === 'signup') {
          const response = await googleSignin({
            body: {
              access_token: currentUser.idToken!,
            },
          });
          // console.log('response', JSON.stringify(response));
          if ((response as any)?.error) {
            const err = response as ErrorData;

            if (
              (err?.error?.data?.message || '')
                .toLowerCase()
                .includes('already in use') ||
              err?.error?.status === 402
            ) {
              showMessage({
                message:
                  err?.error?.data?.message ||
                  err?.error?.data?.error ||
                  'Something went wrong',
                type: 'danger',
              });
              return;
            }
            setTimeout(() => {
              showMessage({
                message:
                  err?.error?.data?.message ||
                  err?.error?.data?.error ||
                  'Something went wrong',
                type: 'danger',
              });
            }, 900);
            return;
          }
          const r = (response as any)?.data?.data;
          dispatch(
            setCredentials({
              token: r?.token,
              user: r?.user,
            }),
          );
        } else {
          //
        }
      }
    } catch (e) {
      console.log(JSON.stringify(e));
      await GoogleSignin.signOut();
      const err = e as any;
      if (((err?.message as string) || '').includes('cancel')) {
        return;
      }
      showMessage({
        message:
          err?.error?.data?.message ||
          err?.error?.data?.error ||
          'Something went wrong',
        type: 'danger',
      });
    }
  }, [dispatch, googleSignin]);

  const onAppleButtonPress = useCallback(
    async () => {
      // try {
      //   setFatalError('');
      //   // performs login request
      //   const appleAuthRequestResponse = await appleAuth.performRequest({
      //     requestedOperation: appleAuth.Operation.LOGIN,
      //     // Note: it appears putting FULL_NAME first is important, see issue #293
      //     requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      //   });
      //   // get current authentication state for user
      //   // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      //   const credentialState = await appleAuth.getCredentialStateForUser(
      //     appleAuthRequestResponse.user,
      //   );
      //   // use credentialState response to ensure the user is authenticated
      //   if (credentialState === appleAuth.State.AUTHORIZED) {
      //     if (appleAuthRequestResponse.email) {
      //       dispatch(
      //         setExistingApple({
      //           existing: [...existingApple, appleAuthRequestResponse],
      //         }),
      //       );
      //     }
      //     const { email: token_email } = jwtDecode(
      //       appleAuthRequestResponse.identityToken!,
      //     ) as { email?: string };
      //     const selecteAppleResponse =
      //       existingApple.find(e => e.email === token_email) ||
      //       appleAuthRequestResponse;
      //     const mode = 'signup';
      //     if (mode === 'signup') {
      //       // setLoading(false);
      //       if (
      //         !appleAuthRequestResponse?.email &&
      //         !selecteAppleResponse?.email
      //       ) {
      //         setFatalError(
      //           'Error: Your apple id needs to be unlinked from the Nazza app. Unlink your apple id by going to your Settings > Apple ID, Sign in with Apple, tap on Nazza and tap Stop',
      //         );
      //         return;
      //       }
      //       const passEmail = selecteAppleResponse?.email! || token_email! || '';
      //       if (!passEmail) {
      //         return;
      //       }
      //       const response = await appleSignin({
      //         email: passEmail,
      //         appleId:
      //           selecteAppleResponse?.identityToken ||
      //           selecteAppleResponse?.user ||
      //           passEmail,
      //       });
      //       if ((response as any)?.error) {
      //         const err = response as ErrorData;
      //         if (
      //           (err?.error?.data?.message || '')
      //             .toLowerCase()
      //             .includes('already in use') ||
      //           err?.error?.status === 402
      //         ) {
      //           const regResponse = await reg({
      //             email: passEmail,
      //           });
      //           if ((regResponse as any)?.error) {
      //             const inerr = regResponse as ErrorData;
      //             setTimeout(() => {
      //               Toast.show({
      //                 type: 'error',
      //                 text1: inerr?.error?.data?.title || 'Error',
      //                 text2:
      //                   inerr?.error?.data?.message || 'Something went wrong',
      //               });
      //             }, 900);
      //             return;
      //           }
      //           setTimeout(() => {
      //             navigation.navigate('VerifySocialLink', {
      //               email: passEmail,
      //               provider: 'apple',
      //               providerId:
      //                 selecteAppleResponse?.identityToken ||
      //                 selecteAppleResponse?.user ||
      //                 passEmail,
      //             });
      //           }, 900);
      //           return;
      //         }
      //         setTimeout(() => {
      //           Toast.show({
      //             type: 'error',
      //             text1: err?.error?.data?.title || 'Error',
      //             text2: err?.error?.data?.message || 'Something went wrong',
      //           });
      //         }, 900);
      //         return;
      //       }
      //       const r = (response as any)?.data?.data?.data;
      //       if (r?.token) {
      //         setTimeout(() => {
      //           dispatch(
      //             updateToken({
      //               token: r.token,
      //             }),
      //           );
      //           if (!r?.name) {
      //             dispatch(
      //               setAuthBlocked({
      //                 value: true,
      //               }),
      //             );
      //             navigation.replace('OptionalSetupBVN', {
      //               email: passEmail,
      //               id: r.id,
      //             });
      //           } else {
      //             updateLoaded(true);
      //             updateAllowModals(true);
      //             dispatch(
      //               setAuthBlocked({
      //                 value: false,
      //               }),
      //             );
      //             dispatch(
      //               setAuthTrigger({
      //                 trigger: true,
      //               }),
      //             );
      //           }
      //         }, 900);
      //       } else {
      //         setTimeout(() => {
      //           navigation.navigate('Verify2FA', {
      //             id: r.id,
      //             authenticator: r.twoFa?.authenticator,
      //             email: r.twoFa?.email,
      //             address: passEmail,
      //           });
      //         }, 900);
      //       }
      //     } else {
      //       //
      //     }
      //   }
      // } catch (err) {
      //   console.log('apple login error', JSON.stringify(err));
      // }
    },
    [
      // existingApple,
      // dispatch,
      // appleSignin,
      // reg,
      // navigation,
      // updateLoaded,
      // updateAllowModals,
    ],
  );

  return useMemo(
    () => ({
      googleAuth: doGoogleAuth,
      appleAuth: onAppleButtonPress,
      googleLoading,
      appleLoading,
      fatalError,
    }),
    [appleLoading, doGoogleAuth, fatalError, googleLoading, onAppleButtonPress],
  );
};
