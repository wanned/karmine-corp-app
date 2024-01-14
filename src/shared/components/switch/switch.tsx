import { Pressable, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { SwitchThumb } from './components/switch-thumb';
import { SwitchTrack } from './components/switch-track';
import { switchHeight } from './constants';
import { useToggle } from './hooks/use-toggle';

import { useStyles } from '~/shared/hooks/use-styles';
import { createStylesheet } from '~/shared/styles/create-stylesheet';

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const Switch = ({ value, onValueChange }: SwitchProps) => {
  const trackStyles = useStyles(getTrackStyles);

  const thumbAnimatedValue = useSharedValue(value ? 1 : 0);
  const toggle = useToggle({ thumbAnimatedValue, onValueChange, value });

  return (
    <Pressable onPress={toggle}>
      <View style={trackStyles.track}>
        <SwitchTrack thumbAnimatedValue={thumbAnimatedValue} />
        <SwitchThumb thumbAnimatedValue={thumbAnimatedValue} />
      </View>
    </Pressable>
  );
};

const getTrackStyles = createStylesheet((theme) => ({
  track: {
    width: switchHeight * 2,
    height: switchHeight,
    borderRadius: switchHeight / 2,
  },
}));
