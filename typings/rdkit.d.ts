import '@rdkit/rdkit';
import { RDKitLoader, RDKitModule } from '@rdkit/rdkit';

declare global {
	interface Window {
		RDKit: RDKitModule;
		initRDKitModule: RDKitLoader;
	}
}

declare module '@rdkit/rdkit' {
	interface RDKitModule {
		get_rxn(source: string): JSReaction;
	}
	interface JSMol {
		add_hs_in_place(): void;
	}
	interface JSReaction {
		draw_to_canvas(
			canvas: HTMLCanvasElement,
			width: number,
			height: number
		): void;
		draw_to_canvas_with_highlights(
			canvas: HTMLCanvasElement,
			details: string
		): void;
		draw_to_canvas_with_offset(
			canvas: HTMLCanvasElement,
			offsetx: number,
			offsety: number,
			width: number,
			height: number
		): void;
		get_svg(): string;
		get_svg_with_highlights(details: string): string;
	}
}
