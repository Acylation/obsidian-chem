// Global consts
export const SAMPLE_SMILES_1 = 'OC(=O)C(C)=CC1=CC=CC=C1';
export const SAMPLE_SMILES_2 =
	'OC(C(=O)O[C@H]1C[N+]2(CCCOC3=CC=CC=C3)CCC1CC2)(C1=CC=CS1)C1=CC=CS1';
export const SETTINGS_VERSION = 'v2';

// Plugin settings
export interface ChemPluginSettings {
	version: string;
	darkTheme: string;
	lightTheme: string;
	sample1: string;
	sample2: string;
	imgWidth: number;
	copy: {
		scale: number;
		transparent: boolean;
		theme: string;
	};
	dataview: boolean;
	options: Partial<SMILES_DRAWER_OPTIONS>;
}

export const DEFAULT_SETTINGS: ChemPluginSettings = {
	version: SETTINGS_VERSION,
	darkTheme: 'dark',
	lightTheme: 'light',
	sample1: SAMPLE_SMILES_1,
	sample2: SAMPLE_SMILES_2,
	imgWidth: 300,
	copy: {
		scale: 2,
		transparent: true,
		theme: 'default',
	},
	dataview: false,
	options: {},
};

// Smiles-drawer options
// Reference: https://smilesdrawer.surge.sh/playground.html
export interface SMILES_DRAWER_OPTIONS {
	width: number;
	height: number;
	scale: number;
	bondThickness: number;
	shortBondLength: number;
	bondSpacing: number;
	atomVisualization: 'default' | 'balls' | 'allballs';
	isomeric: boolean;
	debug: boolean;
	terminalCarbons: boolean;
	explicitHydrogens: boolean;
	overlapSensitivity: number;
	overlapResolutionIterations: number;
	compactDrawing: boolean;
	fontFamily: string;
	fontSizeLarge: number;
	fontSizeSmall: number;
	padding: number;
	experimentalSSSR: boolean;
	kkThreshold: number;
	kkInnerThreshold: number;
	kkMaxIteration: number;
	kkMaxInnerIteration: number;
	kkMaxEnergy: number;
	themes: {
		[key: string]: {
			C: string;
			O: string;
			N: string;
			F: string;
			CL: string;
			BR: string;
			I: string;
			P: string;
			S: string;
			B: string;
			SI: string;
			H: string;
			BACKGROUND: string;
		};
	};
}

export const DEFAULT_SD_OPTIONS: SMILES_DRAWER_OPTIONS = {
	width: 300,
	height: 300,
	scale: 1.0,
	bondThickness: 1,
	shortBondLength: 0.8,
	bondSpacing: 5.1,
	atomVisualization: 'default',
	isomeric: true,
	debug: false,
	terminalCarbons: false,
	explicitHydrogens: true,
	overlapSensitivity: 0.42,
	overlapResolutionIterations: 1,
	compactDrawing: false,
	fontFamily: 'Arial, Helvetica, sans-serif',
	fontSizeLarge: 11,
	fontSizeSmall: 3,
	padding: 2,
	experimentalSSSR: true,
	kkThreshold: 0.1,
	kkInnerThreshold: 0.1,
	kkMaxIteration: 20000,
	kkMaxInnerIteration: 50,
	kkMaxEnergy: 1000000000,
	themes: {
		dark: {
			C: '#fff',
			O: '#e74c3c',
			N: '#3498db',
			F: '#27ae60',
			CL: '#16a085',
			BR: '#d35400',
			I: '#8e44ad',
			P: '#d35400',
			S: '#f1c40f',
			B: '#e67e22',
			SI: '#e67e22',
			H: '#aaa',
			BACKGROUND: '#141414',
		},
		light: {
			C: '#222',
			O: '#e74c3c',
			N: '#3498db',
			F: '#27ae60',
			CL: '#16a085',
			BR: '#d35400',
			I: '#8e44ad',
			P: '#d35400',
			S: '#f1c40f',
			B: '#e67e22',
			SI: '#e67e22',
			H: '#666',
			BACKGROUND: '#fff',
		},
		oldschool: {
			C: '#000',
			O: '#000',
			N: '#000',
			F: '#000',
			CL: '#000',
			BR: '#000',
			I: '#000',
			P: '#000',
			S: '#000',
			B: '#000',
			SI: '#000',
			H: '#000',
			BACKGROUND: '#fff',
		},
		'oldschool-dark': {
			C: '#fff',
			O: '#fff',
			N: '#fff',
			F: '#fff',
			CL: '#fff',
			BR: '#fff',
			I: '#fff',
			P: '#fff',
			S: '#fff',
			B: '#fff',
			SI: '#fff',
			H: '#fff',
			BACKGROUND: '#000',
		},
		solarized: {
			C: '#586e75',
			O: '#dc322f',
			N: '#268bd2',
			F: '#859900',
			CL: '#16a085',
			BR: '#cb4b16',
			I: '#6c71c4',
			P: '#d33682',
			S: '#b58900',
			B: '#2aa198',
			SI: '#2aa198',
			H: '#657b83',
			BACKGROUND: '#fff',
		},
		'solarized-dark': {
			C: '#93a1a1',
			O: '#dc322f',
			N: '#268bd2',
			F: '#859900',
			CL: '#16a085',
			BR: '#cb4b16',
			I: '#6c71c4',
			P: '#d33682',
			S: '#b58900',
			B: '#2aa198',
			SI: '#2aa198',
			H: '#839496',
			BACKGROUND: '#fff',
		},
		matrix: {
			C: '#678c61',
			O: '#2fc079',
			N: '#4f7e7e',
			F: '#90d762',
			CL: '#82d967',
			BR: '#23755a',
			I: '#409931',
			P: '#c1ff8a',
			S: '#faff00',
			B: '#50b45a',
			SI: '#409931',
			H: '#426644',
			BACKGROUND: '#fff',
		},
		github: {
			C: '#24292f',
			O: '#cf222e',
			N: '#0969da',
			F: '#2da44e',
			CL: '#6fdd8b',
			BR: '#bc4c00',
			I: '#8250df',
			P: '#bf3989',
			S: '#d4a72c',
			B: '#fb8f44',
			SI: '#bc4c00',
			H: '#57606a',
			BACKGROUND: '#fff',
		},
		carbon: {
			C: '#161616',
			O: '#da1e28',
			N: '#0f62fe',
			F: '#198038',
			CL: '#007d79',
			BR: '#fa4d56',
			I: '#8a3ffc',
			P: '#ff832b',
			S: '#f1c21b',
			B: '#8a3800',
			SI: '#e67e22',
			H: '#525252',
			BACKGROUND: '#fff',
		},
		cyberpunk: {
			C: '#ea00d9',
			O: '#ff3131',
			N: '#0abdc6',
			F: '#00ff9f',
			CL: '#00fe00',
			BR: '#fe9f20',
			I: '#ff00ff',
			P: '#fe7f00',
			S: '#fcee0c',
			B: '#ff00ff',
			SI: '#ffffff',
			H: '#913cb1',
			BACKGROUND: '#fff',
		},
		gruvbox: {
			C: '#665c54',
			O: '#cc241d',
			N: '#458588',
			F: '#98971a',
			CL: '#79740e',
			BR: '#d65d0e',
			I: '#b16286',
			P: '#af3a03',
			S: '#d79921',
			B: '#689d6a',
			SI: '#427b58',
			H: '#7c6f64',
			BACKGROUND: '#fbf1c7',
		},
		'gruvbox-dark': {
			C: '#ebdbb2',
			O: '#cc241d',
			N: '#458588',
			F: '#98971a',
			CL: '#b8bb26',
			BR: '#d65d0e',
			I: '#b16286',
			P: '#fe8019',
			S: '#d79921',
			B: '#8ec07c',
			SI: '#83a598',
			H: '#bdae93',
			BACKGROUND: '#282828',
		},
		custom: {
			C: '#222',
			O: '#e74c3c',
			N: '#3498db',
			F: '#27ae60',
			CL: '#16a085',
			BR: '#d35400',
			I: '#8e44ad',
			P: '#d35400',
			S: '#f1c40f',
			B: '#e67e22',
			SI: '#e67e22',
			H: '#666',
			BACKGROUND: '#fff',
		},
	},
};

export const themeList = {
	light: 'Light',
	dark: 'Dark',
	oldschool: 'Oldschool',
	'oldschool-dark': 'Oldschool Dark',
	solarized: 'Solarized',
	'solarized-dark': 'Solarized Dark',
	matrix: 'Matrix',
	github: 'GitHub',
	carbon: 'Carbon',
	cyberpunk: 'Cyberpunk',
	gruvbox: 'Gruvbox',
	'gruvbox-dark': 'Gruvbox Dark',
};
