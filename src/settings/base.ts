import { ChemPluginSettingsV1, DEFAULT_SETTINGS_V1 } from './v1';
import { ChemPluginSettingsV2, DEFAULT_SETTINGS_V2 } from './v2';
import { ChemPluginSettingsV3, DEFAULT_SETTINGS_V3 } from './v3';

export type ChemPluginSettings = ChemPluginSettingsV3;
export const DEFAULT_SETTINGS = DEFAULT_SETTINGS_V3;
export const SETTINGS_VERSION = 'v3';

// const migrate_1_2 = (v1: ChemPluginSettingsV1): ChemPluginSettingsV2 => {
// 	v1 = { ...DEFAULT_SETTINGS_V1, ...v1 };
// 	return {
// 		...DEFAULT_SETTINGS_V2,
// 		darkTheme: v1.darkTheme,
// 		lightTheme: v1.lightTheme,
// 		sample1: v1.sample,
// 		imgWidth: parseInt(v1.width),
// 	};
// };

const migrate_1_3 = (v1: ChemPluginSettingsV1): ChemPluginSettingsV3 => {
	v1 = { ...DEFAULT_SETTINGS_V1, ...v1 };
	return {
		...DEFAULT_SETTINGS_V3,
		darkTheme: v1.darkTheme,
		lightTheme: v1.lightTheme,
		sample1: v1.sample,
		imgWidth: parseInt(v1.width),
	};
};

const migrate_2_3 = (v2: ChemPluginSettingsV2): ChemPluginSettingsV3 => {
	v2 = { ...DEFAULT_SETTINGS_V2, ...v2 };
	return {
		...DEFAULT_SETTINGS_V3,
		darkTheme: v2.darkTheme,
		lightTheme: v2.lightTheme,
		sample1: v2.sample1,
		sample2: v2.sample2,
		imgWidth: v2.imgWidth,
		copy: {
			scale: v2.copy.scale,
			transparent: v2.copy.transparent,
			theme: v2.copy.theme,
		},
		dataview: v2.dataview,
		inlineSmiles: v2.inlineSmiles,
		inlineSmilesPrefix: v2.inlineSmilesPrefix,
		smilesDrawerOptions: {
			moleculeOptions: v2.options,
			reactionOptions: {},
		},
	};
};

const migrate_3_3 = (draft: ChemPluginSettingsV3): ChemPluginSettingsV3 => {
	return { ...DEFAULT_SETTINGS, ...draft };
};

export const migrateSettings = (draft: any): ChemPluginSettingsV3 => {
	if (Object.keys(draft).length === 0) return DEFAULT_SETTINGS;
	if (!('version' in draft)) return migrate_1_3(draft); // v1
	else if (draft.version === 'v2') return migrate_2_3(draft);
	else if (draft.version === 'v3') return migrate_3_3(draft); // current
	return DEFAULT_SETTINGS; // consider branch coverage rate
};
