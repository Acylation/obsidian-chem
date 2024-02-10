export interface ChemPluginSettingsV1 {
	darkTheme: string;
	lightTheme: string;
	sample: string;
	width: string;
}
export const DEFAULT_SETTINGS_V1: ChemPluginSettingsV1 = {
	darkTheme: 'dark',
	lightTheme: 'light',
	sample: 'CC(=O)NC1=C-C=C-C=C1-C(=O)O',
	width: '300',
};
