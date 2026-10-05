import React, {useCallback, useMemo} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text, Menu} from 'react-native-paper';
import {observer} from 'mobx-react';

import {useTheme} from '../../hooks';
import type {Theme} from '../../utils/types';
import {
  applyKaggleFlags,
  parseKaggleFlags,
  type KaggleThinkLevel,
} from '../../utils/kaggleFlags';

export type KaggleCapabilityBarProps = {
  /** Current remote model id (may already include flags). */
  modelId: string;
  /** Called with the rewritten model id when the user toggles a flag. */
  onModelIdChange: (nextModelId: string) => void;
  /** Hide the whole bar when the active server is not Kaggle Bridge. */
  visible?: boolean;
  /** Disable interaction while streaming. */
  disabled?: boolean;
  testID?: string;
};

const THINK_OPTIONS: {value: KaggleThinkLevel | 'off'; label: string}[] = [
  {value: 'off', label: 'Off'},
  {value: 'low', label: 'Low'},
  {value: 'medium', label: 'Med'},
  {value: 'high', label: 'High'},
  {value: 'think', label: 'Think'},
];

/**
 * Compact capability chips for Kaggle Bridge model-id flags.
 * Visual language mirrors ChatInput's existing thinking toggle
 * (28px-tall pills, 16 radius, 1px border, 12px medium label).
 */
export const KaggleCapabilityBar = observer(
  ({
    modelId,
    onModelIdChange,
    visible = true,
    disabled = false,
    testID = 'kaggle-capability-bar',
  }: KaggleCapabilityBarProps) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const flags = useMemo(() => parseKaggleFlags(modelId), [modelId]);
    const [thinkMenuOpen, setThinkMenuOpen] = React.useState(false);

    const setFlag = useCallback(
      (partial: Parameters<typeof applyKaggleFlags>[1]) => {
        if (disabled) {
          return;
        }
        onModelIdChange(applyKaggleFlags(modelId, partial));
      },
      [disabled, modelId, onModelIdChange],
    );

    if (!visible) {
      return null;
    }

    const thinkLabel =
      THINK_OPTIONS.find(o => o.value === (flags.think ?? 'off'))?.label ??
      'Off';

    return (
      <View style={styles.row} testID={testID}>
        <Chip
          label="Web"
          active={flags.web}
          disabled={disabled}
          onPress={() => setFlag({web: !flags.web})}
          styles={styles}
          testID={`${testID}-web`}
        />

        <Menu
          visible={thinkMenuOpen}
          onDismiss={() => setThinkMenuOpen(false)}
          anchor={
            <Chip
              label={`Think · ${thinkLabel}`}
              active={!!flags.think && flags.think !== 'nothink'}
              disabled={disabled}
              onPress={() => setThinkMenuOpen(true)}
              styles={styles}
              testID={`${testID}-think`}
            />
          }>
          {THINK_OPTIONS.map(opt => (
            <Menu.Item
              key={opt.value}
              title={opt.label}
              onPress={() => {
                setThinkMenuOpen(false);
                if (opt.value === 'off') {
                  const cleared = applyKaggleFlags(modelId, {think: 'nothink'})
                    .replace(/:nothink\b/g, '')
                    .replace(/::+/g, ':')
                    .replace(/:$/, '');
                  onModelIdChange(cleared);
                  return;
                }
                setFlag({think: opt.value});
              }}
              testID={`${testID}-think-${opt.value}`}
            />
          ))}
        </Menu>

        <Chip
          label="Shell"
          active={flags.shell}
          disabled={disabled}
          onPress={() => setFlag({shell: !flags.shell})}
          styles={styles}
          testID={`${testID}-shell`}
        />
      </View>
    );
  },
);

type ChipProps = {
  label: string;
  active: boolean;
  disabled?: boolean;
  onPress: () => void;
  styles: ReturnType<typeof createStyles>;
  testID?: string;
};

function Chip({label, active, disabled, onPress, styles, testID}: ChipProps) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{selected: active, disabled: !!disabled}}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.chip,
        active ? styles.chipActive : styles.chipIdle,
        disabled && styles.chipDisabled,
      ]}
      testID={testID}>
      <Text
        style={[
          styles.chipText,
          active ? styles.chipTextActive : styles.chipTextIdle,
        ]}
        numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      borderWidth: 1,
      paddingHorizontal: 10,
      paddingVertical: 4,
      minHeight: 28,
    },
    chipIdle: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.outline,
    },
    chipActive: {
      backgroundColor: theme.colors.secondaryContainer,
      borderColor: theme.colors.secondary,
    },
    chipDisabled: {
      opacity: 0.45,
    },
    chipText: {
      fontSize: 12,
      fontWeight: '500',
    },
    chipTextIdle: {
      color: theme.colors.onSurfaceVariant,
    },
    chipTextActive: {
      color: theme.colors.onSecondaryContainer,
    },
  });

export default KaggleCapabilityBar;
