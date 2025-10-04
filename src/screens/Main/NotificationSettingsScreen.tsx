import { ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Box from '@/components/Box';
import Text from '@/components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStack } from '@/utils/ParamList';
import BaseScreenComponent from '@/components/BaseScreenComponent';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useThemeColors } from '@/hooks/useTheme';
import Switch from '@/components/Switch';
import CheckBox from '@/components/CheckBox';
import { camelToCapitalize } from '@/utils/helpers';
import { useUserSettings } from '@/state/hooks/usersettings.hook';
import { useLoadSettings } from '@/state/hooks/loadsettings.hook';
import { useFocusEffect } from '@react-navigation/native';
import Button from '@/components/Button';
import { useGetNotificationSettingsMutation } from '@/state/services/setting.service';
import { ErrorData } from '@/utils/types';
import { showMessage } from 'react-native-flash-message';

const defaultMain = {
  newMessage: {
    email: false,
    push: false,
  },
  consultationRequest: {
    email: false,
    push: false,
  },
  platformAnnouncement: {
    email: false,
    push: false,
  },
};

const defaultPayment = {
  paymentConfirmation: {
    email: false,
    push: false,
  },
  failedPayments: {
    email: false,
    push: false,
  },
  subscriptionRenewal: {
    email: false,
    push: false,
  },
  paymentReminder: {
    email: false,
    push: false,
  },
};

const NotificationSettingscreen = ({
  navigation,
}: NativeStackScreenProps<MainStack, 'NotificationSettings'>) => {
  const { foreground, foreground_primary } = useThemeColors();
  const { notification } = useUserSettings();
  const { loadNotificationSettings, notificationSettingsLoading } =
    useLoadSettings();
  const [patchNotifications, { isLoading: patching }] =
    useGetNotificationSettingsMutation();
  const [email, setEmail] = useState(
    notification?.emailNotificationsEnabled || false,
  );
  const [push, setPush] = useState(
    notification?.pushNotificationsEnabled || false,
  );
  const _mainNotifications = useMemo<typeof defaultMain>(
    () => ({
      ...defaultMain,
      consultationRequest: {
        email: notification?.consultationRequestEmail || false,
        push: notification?.consultationRequestPush || false,
      },
      newMessage: {
        email: notification?.newMessageEmail || false,
        push: notification?.newMessagePush || false,
      },
      platformAnnouncement: {
        email: notification?.platformAnnouncementEmail || false,
        push: notification?.platformAnnouncementPush || false,
      },
    }),
    [notification],
  );
  const [mainNotifications, setMainNotifications] = useState<
    typeof defaultMain
  >({
    ...defaultMain,
    consultationRequest: {
      email: notification?.consultationRequestEmail || false,
      push: notification?.consultationRequestPush || false,
    },
    newMessage: {
      email: notification?.newMessageEmail || false,
      push: notification?.newMessagePush || false,
    },
    platformAnnouncement: {
      email: notification?.platformAnnouncementEmail || false,
      push: notification?.platformAnnouncementPush || false,
    },
  });
  const _paymentNotifications = useMemo(
    () => ({
      ...defaultPayment,
      paymentConfirmation: {
        email: notification?.paymentConfirmationEmail || false,
        push: notification?.paymentConfirmationPush || false,
      },
      failedPayments: {
        email: notification?.failedPaymentsEmail || false,
        push: notification?.failedPaymentsPush || false,
      },
      paymentReminder: {
        email: notification?.paymentReminderEmail || false,
        push: notification?.paymentConfirmationPush || false,
      },
      subscriptionRenewal: {
        email: notification?.subscriptionRenewalEmail || false,
        push: notification?.subscriptionRenewalPush || false,
      },
    }),
    [notification],
  );
  const [paymentNotifications, setPaymentNotifications] = useState({
    ...defaultPayment,
    paymentConfirmation: {
      email: notification?.paymentConfirmationEmail || false,
      push: notification?.paymentConfirmationPush || false,
    },
    failedPayments: {
      email: notification?.failedPaymentsEmail || false,
      push: notification?.failedPaymentsPush || false,
    },
    paymentReminder: {
      email: notification?.paymentReminderEmail || false,
      push: notification?.paymentConfirmationPush || false,
    },
    subscriptionRenewal: {
      email: notification?.subscriptionRenewalEmail || false,
      push: notification?.subscriptionRenewalPush || false,
    },
  });

  const hasUpdated = useMemo(
    () =>
      Object.entries(paymentNotifications)
        .map(
          notif =>
            _paymentNotifications[notif[0]].email !== notif[1].email ||
            _paymentNotifications[notif[0]].push !== notif[1].push,
        )
        .includes(true) ||
      Object.entries(mainNotifications)
        .map(
          notif =>
            _mainNotifications[notif[0]].email !== notif[1].email ||
            _mainNotifications[notif[0]].push !== notif[1].push,
        )
        .includes(true),

    [
      paymentNotifications,
      mainNotifications,
      _paymentNotifications,
      _mainNotifications,
    ],
  );

  const patchUserSettings = useCallback(async () => {
    try {
      const submitObject: typeof notification = {
        consultationRequestEmail: mainNotifications.consultationRequest.email,
        consultationRequestPush: mainNotifications.consultationRequest.push,
        newMessageEmail: mainNotifications.newMessage.email,
        newMessagePush: mainNotifications.newMessage.push,
        platformAnnouncementEmail: mainNotifications.platformAnnouncement.email,
        platformAnnouncementPush: mainNotifications.platformAnnouncement.push,
        failedPaymentsEmail: paymentNotifications.failedPayments.email,
        failedPaymentsPush: paymentNotifications.failedPayments.push,
        paymentConfirmationEmail:
          paymentNotifications.paymentConfirmation.email,
        paymentConfirmationPush: paymentNotifications.paymentConfirmation.push,
        paymentReminderEmail: paymentNotifications.paymentReminder.email,
        paymentReminderPush: paymentNotifications.paymentReminder.push,
        subscriptionRenewalEmail:
          paymentNotifications.subscriptionRenewal.email,
        subscriptionRenewalPush: paymentNotifications.subscriptionRenewal.push,
        emailNotificationsEnabled: email,
        pushNotificationsEnabled: push,
      };
      const response = await patchNotifications({
        patch: {
          ...submitObject,
        },
      });
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
      loadNotificationSettings();
      showMessage({
        message: 'You have updated your notification settings',
        type: 'success',
      });
    } catch (error) {
      console.log('patch settiings error', error);
    }
  }, [
    loadNotificationSettings,
    patchNotifications,
    mainNotifications,
    paymentNotifications,
    email,
    push,
  ]);

  useEffect(() => {
    if (!email) {
      setMainNotifications(x => ({
        newMessage: {
          email: false,
          push: x.newMessage.push,
        },
        consultationRequest: {
          email: false,
          push: x.consultationRequest.push,
        },
        platformAnnouncement: {
          email: false,
          push: x.platformAnnouncement.push,
        },
      }));
      setPaymentNotifications(x => ({
        paymentConfirmation: {
          email: false,
          push: x.paymentConfirmation.push,
        },
        failedPayments: {
          email: false,
          push: x.failedPayments.push,
        },
        subscriptionRenewal: {
          email: false,
          push: x.subscriptionRenewal.push,
        },
        paymentReminder: {
          email: false,
          push: x.paymentReminder.push,
        },
      }));
    }
  }, [email]);

  useEffect(() => {
    if (!push) {
      setMainNotifications(x => ({
        newMessage: {
          email: x.newMessage.email,
          push: false,
        },
        consultationRequest: {
          email: x.consultationRequest.email,
          push: false,
        },
        platformAnnouncement: {
          email: x.platformAnnouncement.email,
          push: false,
        },
      }));
      setPaymentNotifications(x => ({
        paymentConfirmation: {
          email: x.paymentConfirmation.email,
          push: false,
        },
        failedPayments: {
          email: x.failedPayments.email,
          push: false,
        },
        subscriptionRenewal: {
          email: x.subscriptionRenewal.email,
          push: false,
        },
        paymentReminder: {
          email: x.paymentReminder.email,
          push: false,
        },
      }));
    }
  }, [push]);

  useFocusEffect(
    useCallback(() => {
      loadNotificationSettings();
    }, [loadNotificationSettings]),
  );

  return (
    <BaseScreenComponent>
      <Box flex={1} backgroundColor="background">
        <SafeAreaView style={{ flex: 1 }}>
          <Box flex={1}>
            <Box flex={1}>
              <Box
                flexDirection="row"
                alignItems="center"
                paddingHorizontal="l"
                gap="mid"
                paddingVertical="mid">
                <Box>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.goBack();
                    }}
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
                    Notifcation Setting
                  </Text>
                </Box>
                <Box padding="s" width={32} opacity={0}></Box>
              </Box>
              <Box flex={1}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Box paddingVertical="l" paddingHorizontal="l">
                    {notificationSettingsLoading && (
                      <Box alignItems="center" padding="l">
                        <ActivityIndicator
                          size="small"
                          color={foreground_primary}
                        />
                      </Box>
                    )}
                    <Box marginBottom="mxl">
                      <Box
                        marginBottom="s"
                        flexDirection="row"
                        alignItems="center"
                        gap="l"
                        justifyContent="space-between">
                        <Text variant="semibold" fontSize={18}>
                          Email Notification
                        </Text>
                        <Switch
                          value={email}
                          onPress={() => setEmail(!email)}
                        />
                      </Box>
                      <Text color="label" marginBottom="l">
                        Receive updates via email for messages, requests,
                        announcements, and payments.
                      </Text>
                      <Box gap="s">
                        {Object.keys(mainNotifications).map(key => (
                          <TouchableOpacity key={key} onPress={() => {}}>
                            <Box
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center">
                              <Text>{camelToCapitalize(key)}</Text>
                              <CheckBox
                                size={16}
                                checked={
                                  mainNotifications[
                                    key as keyof typeof mainNotifications
                                  ].email
                                }
                                onPress={() => {
                                  if (!email) {
                                    return;
                                  }
                                  const newNots = { ...mainNotifications };
                                  newNots[
                                    key as keyof typeof mainNotifications
                                  ].email =
                                    !mainNotifications[
                                      key as keyof typeof mainNotifications
                                    ].email;
                                  setMainNotifications(newNots);
                                }}
                              />
                            </Box>
                          </TouchableOpacity>
                        ))}
                      </Box>
                      <Text
                        fontSize={16}
                        variant="semibold"
                        marginTop="m"
                        marginBottom="s">
                        Payment Notifications
                      </Text>
                      <Box gap="s">
                        {Object.keys(paymentNotifications).map(key => (
                          <TouchableOpacity key={key} onPress={() => {}}>
                            <Box
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center">
                              <Text>{camelToCapitalize(key)}</Text>
                              <CheckBox
                                size={16}
                                checked={
                                  paymentNotifications[
                                    key as keyof typeof paymentNotifications
                                  ].email
                                }
                                onPress={() => {
                                  if (!email) {
                                    return;
                                  }
                                  const newNots = { ...paymentNotifications };
                                  newNots[
                                    key as keyof typeof paymentNotifications
                                  ].email =
                                    !paymentNotifications[
                                      key as keyof typeof paymentNotifications
                                    ].email;
                                  setPaymentNotifications(newNots);
                                }}
                              />
                            </Box>
                          </TouchableOpacity>
                        ))}
                      </Box>
                    </Box>
                    <Box marginBottom="l">
                      <Box
                        marginBottom="s"
                        flexDirection="row"
                        alignItems="center"
                        gap="l"
                        justifyContent="space-between">
                        <Text variant="semibold" fontSize={18}>
                          Push Notification
                        </Text>
                        <Switch value={push} onPress={() => setPush(!push)} />
                      </Box>
                      <Text color="label" marginBottom="l">
                        Get instant alerts on your device for messages,
                        requests, announcements, and payments.
                      </Text>
                      <Box gap="s">
                        {Object.keys(mainNotifications).map(key => (
                          <TouchableOpacity key={key} onPress={() => {}}>
                            <Box
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center">
                              <Text>{camelToCapitalize(key)}</Text>
                              <CheckBox
                                size={16}
                                checked={
                                  mainNotifications[
                                    key as keyof typeof mainNotifications
                                  ].push
                                }
                                onPress={() => {
                                  if (!push) {
                                    return;
                                  }
                                  const newNots = { ...mainNotifications };
                                  newNots[
                                    key as keyof typeof mainNotifications
                                  ].push =
                                    !mainNotifications[
                                      key as keyof typeof mainNotifications
                                    ].push;
                                  setMainNotifications(newNots);
                                }}
                              />
                            </Box>
                          </TouchableOpacity>
                        ))}
                      </Box>
                      <Text
                        fontSize={16}
                        variant="semibold"
                        marginTop="m"
                        marginBottom="s">
                        Payment Notifications
                      </Text>
                      <Box gap="s">
                        {Object.keys(paymentNotifications).map(key => (
                          <TouchableOpacity key={key} onPress={() => {}}>
                            <Box
                              flexDirection="row"
                              justifyContent="space-between"
                              alignItems="center">
                              <Text>{camelToCapitalize(key)}</Text>
                              <CheckBox
                                size={16}
                                checked={
                                  paymentNotifications[
                                    key as keyof typeof paymentNotifications
                                  ].push
                                }
                                onPress={() => {
                                  if (!push) {
                                    return;
                                  }
                                  const newNots = { ...paymentNotifications };
                                  newNots[
                                    key as keyof typeof paymentNotifications
                                  ].push =
                                    !paymentNotifications[
                                      key as keyof typeof paymentNotifications
                                    ].push;
                                  setPaymentNotifications(newNots);
                                }}
                              />
                            </Box>
                          </TouchableOpacity>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </ScrollView>
              </Box>
            </Box>
            <Box paddingBottom="xl" paddingHorizontal="l">
              <Button
                disabled={!hasUpdated}
                loading={patching}
                displayText="Save Changes"
                onPress={() => {
                  patchUserSettings();
                }}
              />
            </Box>
          </Box>
        </SafeAreaView>
      </Box>
    </BaseScreenComponent>
  );
};

export default NotificationSettingscreen;
