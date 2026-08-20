import { Platform } from 'react-native';

// Suppress noisy web-only deprecation warnings from react-native-web
if (Platform.OS === 'web') {
	const originalWarn = console.warn;
	console.warn = (...args: unknown[]) => {
		const message = String(args[0] ?? '');
		if (
			message.includes('"shadow*" style props are deprecated') ||
			message.includes('props.pointerEvents is deprecated')
		) {
			return;
		}
		// Forward all other warnings
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore - preserve console signature
		originalWarn(...args);
	};
}


