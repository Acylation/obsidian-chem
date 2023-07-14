import { DEFAULT_SD_OPTIONS, SMILES_DRAWER_OPTIONS } from 'src/settings/base';
import SmilesDrawer from 'smiles-drawer';

export let gDrawer = new SmilesDrawer.SvgDrawer(DEFAULT_SD_OPTIONS);

export const setDrawer = (options: Partial<SMILES_DRAWER_OPTIONS>) => {
	gDrawer = new SmilesDrawer.SvgDrawer({ ...DEFAULT_SD_OPTIONS, ...options });
};

export const clearDrawer = () => {
	gDrawer = {};
};
