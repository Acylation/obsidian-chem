import { DEFAULT_SD_OPTIONS, SMILES_DRAWER_OPTIONS } from './settings/base';
import SmilesDrawer from 'smiles-drawer';
import ChemPlugin from './main';

export let gDrawer = new SmilesDrawer.SmiDrawer(DEFAULT_SD_OPTIONS);

export const updateDrawer = (options: Partial<SMILES_DRAWER_OPTIONS>) => {
	gDrawer = new SmilesDrawer.SmiDrawer({ ...DEFAULT_SD_OPTIONS, ...options });
};

// rerender?

// const blocks = Array.from(
// 	document.getElementsByClassName('block-language-smiles')
// );
// this.root.unmount();

// export default class Drawer {
// 	options: Partial<SMILES_DRAWER_OPTIONS>;

// 	constructor(options: Partial<SMILES_DRAWER_OPTIONS>) {
// 		this.options = options;
// 	}

// 	// getDrawer()

// 	// updateDrawer()

// 	// destroyDrawer()
// }
