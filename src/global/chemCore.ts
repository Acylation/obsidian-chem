import SmilesDrawerCore from 'src/global/smilesDrawer';
import RDKitCore from './rdkit';
import { ChemPluginSettings } from 'src/settings/base';

export let gDrawer: ChemCore;

export const setCore = (
	core: 'smiles-drawer' | 'rdkit',
	settings: ChemPluginSettings
) => {
	if (core == 'smiles-drawer') gDrawer = new SmilesDrawerCore(settings);
	if (core == 'rdkit') gDrawer = new RDKitCore(settings);
};

export interface ChemCore {
	id: string;
	settings: ChemPluginSettings;
	core: unknown;

	// setDrawer: () => void;
	draw: (
		source: string,
		container: HTMLElement,
		theme?: string
	) => HTMLDivElement | SVGSVGElement;
}
