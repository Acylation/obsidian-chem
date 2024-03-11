import { ChemPluginSettings } from 'src/settings/base';

import type { ChemCore } from 'src/lib/core/ChemCore';
import SmilesDrawerCore from '../lib/core/smilesDrawerCore';
import RDKitCore from '../lib/core/rdkitCore';

export let gRenderCore: ChemCore;

export const setCore = async (settings: ChemPluginSettings) => {
	if (!gRenderCore || settings.core !== gRenderCore.id) {
		if (settings.core == 'smiles-drawer')
			gRenderCore = new SmilesDrawerCore(settings);
		if (settings.core == 'rdkit') {
			gRenderCore = await RDKitCore.init(settings);
		}
	}
	gRenderCore.settings = settings;
};

export const clearCore = () => {
	const rdkitBundler = document.getElementById('chem-rdkit-bundler');
	if (rdkitBundler) document.body.removeChild(rdkitBundler);

	//@ts-ignore
	delete window.RDKit;
	//@ts-ignore
	delete window.initRDKitModule;
	//@ts-ignore
	delete window.SmilesDrawer;
	//@ts-ignore
	delete window.SmiDrawer;
};
