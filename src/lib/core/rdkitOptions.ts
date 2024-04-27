/**
 * RDKit.js options
 * RDKit-js doc: https://www.rdkitjs.com/#drawing-molecules-all-options
 *
 * RDKit drawing options (upstream)
 * https://rdkit.org/docs/cppapi/structRDKit_1_1MolDrawOptions.html
 * https://greglandrum.github.io/rdkit-blog/posts/2023-05-26-drawing-options-explained.html
 *
 * MinimalLib source file
 * https://github.com/rdkit/rdkit/blob/master/Code/MinimalLib/minilib.cpp
 */

import { convertToRDKitTheme } from '../themes/theme';
import { RGBDecimal } from 'src/lib/themes/helpers';

export interface RDKitOptions {
	explicitMethyl: boolean;
	fixedBondLength: number;
	fixedScale: number;
	atomColourPalette: Record<number, RGBDecimal>; // any atom index is a valid palette key
	includeRadicals: boolean;
	clearBackground: boolean;
	addStereoAnnotation: boolean;
	annotationColour: RGBDecimal;
	singleColourWedgeBonds: boolean; // the color of wedged would be controlled by `symbolColour`
	addChiralHs: boolean;
}

export const DEFAULT_RDKIT_OPTIONS: RDKitOptions = {
	explicitMethyl: false,
	fixedBondLength: -1,
	fixedScale: -1,
	atomColourPalette: convertToRDKitTheme('rdkit-default'),
	includeRadicals: true,
	clearBackground: false,
	addStereoAnnotation: false,
	annotationColour: [0.63, 0.12, 0.94], // chiral RS annotations
	singleColourWedgeBonds: true, // a company option with `symbolColour`
	addChiralHs: true, // test case: C1C[C@H]2CCCC[C@H]2CC1
	// wedgeBonds: true,
	// wavyBonds: true,
	// kekulize: false,
};
