import {
	DEFAULT_SD_OPTIONS,
	SD_MoleculeOptions,
	SD_ReactionOptions,
} from 'src/settings/smilesDrawerOptions';
import SmilesDrawer from 'smiles-drawer';

export let gDrawer = new SmilesDrawer.SmiDrawer(DEFAULT_SD_OPTIONS);

export const setDrawer = (
	moleculeOptions: Partial<SD_MoleculeOptions>,
	reactionOptions: Partial<SD_ReactionOptions>
) => {
	gDrawer = new SmilesDrawer.SmiDrawer(
		{ ...DEFAULT_SD_OPTIONS.moleculeOptions, ...moleculeOptions },
		{ ...DEFAULT_SD_OPTIONS.reactionOptions, ...reactionOptions }
	);
};

export const clearDrawer = () => {
	gDrawer = {};
};
