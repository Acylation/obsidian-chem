import { convertToSDTheme } from 'src/lib/themes/theme';
import { RDKitThemes } from 'src/lib/themes/rdkitThemes';
import { SDTheme, SDThemes } from 'src/lib/themes/smilesDrawerThemes';

// Smiles-drawer options
// Reference: https://smilesdrawer.surge.sh/playground.html
export interface MoleculeOptions {
	width: number; // levelup
	height: number; // levelup
	scale: number; // levelup
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
	themes: Record<string, SDTheme>;
}

export interface ReactionOptions {
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

export interface SmilesDrawerOptions {
	moleculeOptions: Partial<MoleculeOptions>;
	reactionOptions: Partial<ReactionOptions>;
}

const collectThemes = () => {
	const newThemes: Record<string, SDTheme> = {};
	Object.keys(RDKitThemes).forEach(
		(name) =>
			(newThemes[name] = {
				...SDThemes['light'], // TODO: 0.4.2 check this override
				...convertToSDTheme(name),
			})
	);

	return {
		...SDThemes,
		...newThemes,
	};
};

export const DEFAULT_SD_OPTIONS: SmilesDrawerOptions = {
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
		themes: collectThemes(),
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
