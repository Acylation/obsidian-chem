import { ChemPluginSettings } from 'src/settings/base';

export interface ChemCore {
	id: string;
	settings: ChemPluginSettings;
	core: unknown;

	draw: (
		source: string,
		theme?: string
	) => Promise<HTMLDivElement | SVGSVGElement>;
}
