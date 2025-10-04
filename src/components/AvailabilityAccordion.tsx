import { TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Box from './Box';
import Switch from './Switch';
import Text from './Text';
import { useThemeColors } from '@/hooks/useTheme';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TimePicker from './TimePicker';
import moment from 'moment';
import Button from './Button';
import { convertTime12to24 } from '@/utils/helpers';

interface Props {
  active?: boolean;
  toggleDay?: () => void;
  day: string;
  preferredDuration?: string;
  slots?: { from: string[]; to: string[] }[];
  addSlot?: () => void;
  updateSlot?: (index: number, value: string) => void;
  removeSlot?: (index: number) => void;
}

const AvailabilityAccordion = ({
  active,
  toggleDay,
  day,
  slots = [],
  // preferredDuration,
  addSlot,
  removeSlot,
  updateSlot,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const { foreground, background } = useThemeColors();
  // const [preferredLocal, setPreferredLocal] = useState(
  //   preferredDuration || '60',
  // );

  return (
    <Box
      borderBottomWidth={1}
      borderBottomColor="faded_border"
      paddingBottom="m">
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Box flexDirection="row" alignItems="center" paddingVertical="m">
          <Box flex={1} flexDirection="row" gap="m">
            <Switch value={active} onPress={toggleDay} />
            <Text fontSize={20} variant="medium">
              {day}
            </Text>
          </Box>
          <Box>
            <MaterialCommunityIcons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={foreground}
            />
          </Box>
        </Box>
      </TouchableOpacity>
      <Box>
        {slots.map((s, ind) => (
          <Box
            marginBottom="m"
            flexDirection="row"
            gap="l"
            key={s.from[0]}
            alignItems="stretch">
            <Box flex={1}>
              <TimePicker
                noMargin
                onChange={v => {
                  updateSlot && updateSlot(ind, v);
                }}
                value={moment(
                  moment().format('YYYY-MM-DD') +
                    ' ' +
                    convertTime12to24(s.from[0]),
                ).toISOString()}
                format="[From:] hh:mm A"
                borderColor="faded"
              />
            </Box>
            <Box flex={1}>
              <TimePicker
                disabled
                noMargin
                onChange={() => {}}
                value={moment(
                  moment().format('YYYY-MM-DD') +
                    ' ' +
                    convertTime12to24(s.to[0]),
                ).toISOString()}
                format="[To:] hh:mm A"
                borderColor="faded"
                backgroundColor={background}
              />
            </Box>
            <Box justifyContent="center">
              <TouchableOpacity
                onPress={() => {
                  removeSlot && removeSlot(ind);
                }}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={24}
                  color={foreground}
                />
              </TouchableOpacity>
            </Box>
          </Box>
        ))}
        <Box flexDirection="row">
          <Box width="50%">
            <Button
              buttonProps={{
                height: 38,
              }}
              textProps={{
                fontSize: 14,
              }}
              displayText="Add Slot"
              onPress={() => {
                console.log('adding slot');
                addSlot && addSlot();
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AvailabilityAccordion;
