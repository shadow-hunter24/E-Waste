// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], NonNullable<ComponentProps<typeof MaterialIcons>['name']>>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
	'house.fill': 'home',
	'paperplane.fill': 'send',
	'chevron.left.forwardslash.chevron.right': 'code',
	'chevron.right': 'chevron-right',
	// App-specific icons
	'list.bullet': 'format-list-bulleted',
	'plus.circle.fill': 'add-circle',
	'creditcard.fill': 'credit-card',
	'creditcard': 'credit-card',
	'person.fill': 'person',
	'laptopcomputer': 'laptop',
	'iphone': 'smartphone',
	'tv': 'tv',
	'battery.100': 'battery-full',
	'bell.fill': 'notifications',
	'questionmark.circle.fill': 'help',
	'doc.text.fill': 'description',
	'rectangle.portrait.and.arrow.right': 'logout',
	'car.fill': 'directions-car',
	'checkmark.seal.fill': 'verified',
	'xmark.circle.fill': 'cancel',
	'clock.fill': 'schedule',
} as const;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
	name,
	size = 24,
	color,
	style,
}: {
	name: IconSymbolName;
	size?: number;
	color: string | OpaqueColorValue;
	style?: StyleProp<TextStyle>;
}) {
	const iconName = (MAPPING as Record<string, string>)[name] ?? 'help';
	return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
