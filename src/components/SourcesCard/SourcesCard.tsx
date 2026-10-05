import React from 'react';
import {Linking, Pressable, View, Text, StyleSheet} from 'react-native';

import {useTheme} from '../../hooks';
import type {BridgeSource} from '../../utils/bridgeContent';

type Props = {
  sources: BridgeSource[];
};

/**
 * Compact citation cards — matches PocketPal's clean chat chrome
 * instead of dumping raw "Sources [1] Title - url" markdown.
 */
export const SourcesCard: React.FC<Props> = ({sources}) => {
  const theme = useTheme();
  if (!sources.length) return null;

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: theme.colors.surfaceVariant,
          borderColor: theme.colors.outlineVariant,
        },
      ]}
      accessibilityRole="summary"
      accessibilityLabel={`Sources, ${sources.length}`}>
      <Text
        style={[
          styles.heading,
          {color: theme.colors.onSurfaceVariant},
        ]}>
        Sources
      </Text>
      {sources.map(s => (
        <Pressable
          key={`${s.index}-${s.url}`}
          onPress={() => Linking.openURL(s.url).catch(() => {})}
          style={({pressed}) => [
            styles.row,
            {
              backgroundColor: pressed
                ? theme.colors.surface
                : theme.colors.background,
              borderColor: theme.colors.outline,
            },
          ]}>
          <View
            style={[
              styles.badge,
              {backgroundColor: theme.colors.secondaryContainer},
            ]}>
            <Text
              style={[
                styles.badgeText,
                {color: theme.colors.onSecondaryContainer},
              ]}>
              {s.index}
            </Text>
          </View>
          <View style={styles.meta}>
            <Text
              numberOfLines={2}
              style={[styles.title, {color: theme.colors.onSurface}]}>
              {s.title}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.url, {color: theme.colors.secondary}]}>
              {s.url.replace(/^https?:\/\//, '')}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    gap: 8,
  },
  heading: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 2,
    marginLeft: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  url: {
    fontSize: 12,
    lineHeight: 16,
  },
});
