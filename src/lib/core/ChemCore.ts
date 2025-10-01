import { ChemPluginSettings } from 'src/settings/base';

export interface ChemCore {
	id: string;
	settings: ChemPluginSettings;
	core: unknown;

	buildOptions: (
		settings: ChemPluginSettings,
		overrides?: Record<string, unknown>
	) => Record<string, unknown>;

	draw: (
		source: string,
		theme?: string
	) => Promise<HTMLDivElement | SVGSVGElement>;
}
