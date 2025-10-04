import React from 'react';
import RNModal, { ModalProps } from 'react-native-modal';
// import MyToast from './MyToast';
import FlashMessage from 'react-native-flash-message';
import { Platform, StatusBar } from 'react-native';

const Modal = ({
  children,
  flashRef,
  ...props
}: Partial<ModalProps> & {
  flashRef?: React.RefObject<FlashMessage | null>;
}) => {
  return (
    <RNModal {...props}>
      {children}
      {/* <MyToast /> */}
      <FlashMessage
        ref={flashRef}
        position="top"
        hideStatusBar={Platform.OS === 'android' ? false : undefined}
        statusBarHeight={
          Platform.OS === 'android' ? StatusBar.currentHeight : undefined
        }
      />
    </RNModal>
  );
};

export default Modal;
