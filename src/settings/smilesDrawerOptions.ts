import { theme, themes } from './theme';

// Smiles-drawer options
// Reference: https://smilesdrawer.surge.sh/playground.html
export interface SD_MoleculeOptions {
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
	themes: Record<string, theme>;
}

export interface SD_ReactionOptions {
	fontSize: number;
	fontFamily: string; // comma separated font descriptions.
	spacing: number;
	plus: {
		size: number;
		thickness: number;
	};
	arrow: {
		length: number;
		headSize: number;
		thickness: number;
		margin: number;
	};
}

export interface SMILES_DRAWER_OPTIONS {
	moleculeOptions: SD_MoleculeOptions;
	reactionOptions: SD_ReactionOptions;
}

export const DEFAULT_SD_OPTIONS: SMILES_DRAWER_OPTIONS = {
	moleculeOptions: {
		width: 300,
		height: 300,
		scale: 1,
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
		themes: themes,
	},
	reactionOptions: {
		fontSize: 9,
		fontFamily: 'Arial, Helvetica, sans-serif',
		spacing: 10,
		plus: {
			size: 9,
			thickness: 1,
		},
		arrow: {
			length: 120,
			headSize: 6,
			thickness: 1,
			margin: 3,
		},
	},
};
