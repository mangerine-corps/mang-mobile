import React from 'react';
// import { BASE_URL, DEV_BASE_URL } from '@env';
import Config from 'react-native-config';
// import { getDeviceName, getManufacturer } from 'react-native-device-info';
// import VersionCheck from 'react-native-version-check';
export const {
  BASE_URL,
  ENV,
  APP_ID,
  REDUX_KEY,
  AGORA_APP_ID,
  AGORA_MESSAGE_KEY,
  AGORA_APP_CERTIFICATE,
  STRIPE_PUBLIC_KEY,
} = Config;
import { withAlphaHex } from 'with-alpha-hex';
// import Toast from 'react-native-toast-message';
// import { Wallet } from './types';
// import { Platform } from 'react-native';

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const useAutoFocus = (autoFocus = true) => {
  const inputRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      if (inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 500);
      }
    }
  }, [autoFocus, inputRef]);

  return inputRef;
};

export const numberWithCommas = (x: number, decimals?: number) => {
  return x.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const frequency = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

export const addAlpha = (color: string, opacity: number) => {
  return withAlphaHex(color, opacity);
};

export const makeCamelCase = (str: string) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) {
      return '';
    } // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

export const camelToCapitalize = (str: string) => {
  const text = str || '';
  const result = text.replace(/([A-Z])/g, ' $1');
  const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
  return finalResult;
};

export const getFormattedTime = (duration: number) => {
  let totalSeconds = duration;
  // let hours: string | number = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  let minutes: string | number = Math.floor(totalSeconds / 60);
  let seconds: string | number = totalSeconds % 60;

  minutes = String(minutes).padStart(2, '0');
  // hours = String(hours).padStart(2, '0');
  seconds = String(seconds.toFixed()).padStart(2, '0');
  return `${minutes && minutes + ':'}${seconds}`;
};

function padZero(str: number, len?: number) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

export const invertColor = (hex: string, bw?: boolean) => {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    // https://stackoverflow.com/a/3943023/112731
    return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
  }
  // invert color components
  r = Number((255 - r).toString(16));
  g = Number((255 - g).toString(16));
  b = Number((255 - b).toString(16));
  // pad each with zeros and return
  return '#' + padZero(r) + padZero(g) + padZero(b);
};

export const periodRange = (period: string) => {
  if (period.toLowerCase() === 'Today'.toLowerCase()) {
    return {
      from: new Date(new Date().toLocaleDateString('en-US')).toISOString(),
      to: new Date().toISOString(),
    };
  }

  if (period.toLowerCase() === 'Yesterday'.toLowerCase()) {
    return {
      from: new Date(
        new Date(
          new Date().setDate(new Date().getDate() - 1),
        ).toLocaleDateString('en-US'),
      ).toISOString(),
      to: new Date(
        new Date(
          new Date().setDate(new Date().getDate() - 1),
        ).toLocaleDateString('en-US') + '@ 23:59:59',
      ).toISOString(),
    };
  }

  if (period.toLowerCase() === 'This Week'.toLowerCase()) {
    const date_today = new Date();

    const firstDay = new Date(
      new Date(
        date_today.setDate(date_today.getDate() - date_today.getDay()),
      ).toLocaleDateString('en-US'),
    );

    return {
      from: firstDay.toISOString(),
      to: new Date().toISOString(),
    };
  }

  if (period.toLowerCase() === 'This Month'.toLowerCase()) {
    return {
      from: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1,
      ).toISOString(),
      to: new Date().toISOString(),
    };
  }

  if (period.toLowerCase() === 'This Year'.toLowerCase()) {
    return {
      from: new Date(new Date().getFullYear(), 0, 1).toISOString(),
      to: new Date().toISOString(),
    };
  }

  return undefined;
};

export const convertTime12to24 = (time12h: string) => {
  if (!time12h?.includes(' ')) {
    return time12h;
  }
  const [time, modifier] = time12h.split(' ');

  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier?.toLowerCase() === 'pm') {
    hours = (parseInt(hours, 10) + 12)?.toString();
  }

  return `${hours}:${minutes}`;
};

export const getUrl = () => {
  if (__DEV__) {
    return BASE_URL;
  } else {
    return BASE_URL;
  }
};

export const getUniqueArray = (arr: unknown[], objectKey: string) => {
  let uniqueObjects: any = {};
  arr.forEach((obj: any) => {
    uniqueObjects[obj[objectKey]] = obj;
  });
  let output = Object.values(uniqueObjects);
  return output as typeof arr;
};

export const getReduxKey = () => REDUX_KEY;

// export const currentAppVersion = (includePlatform?: boolean) => {
//   return `${
//     includePlatform ? Platform.OS : ''
//   } ${VersionCheck.getCurrentVersion()}`;
// };

// export const currentDeviceInfo = async () => {
//   const manu = await getManufacturer();
//   const device = await getDeviceName();
//   return `${manu} ${device}`;
// };

// export const appEnvironment = () => {
//   return ENV;
// };

export const validateEmail = (email: string) => {
  return email.match(
    // eslint-disable-next-line no-useless-escape
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
};

export const getHoursAndMinutes = (videoDuration: number) => {
  let totalSeconds = videoDuration / 1000;
  let hours: string | number = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  // let minutes: string | number = Math.floor(totalSeconds / 60);
  // let seconds: string | number = totalSeconds % 60;

  // minutes = String(Number(minutes.toFixed(0))).padStart(2, '0');
  hours = String(hours).padStart(2, '0');
  // seconds = String(seconds.toFixed()).padStart(2, '0');
  return hours + 'hr(s) ';
  // + minutes + 'min(s)';
};

export const makeid = (length: number) => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
