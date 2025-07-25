declare module 'smiles-drawer' {
	class SmiDrawer {
		constructor(moleculeOptions?: object, reactionOptions?: object);
		static apply(
			moleculeOptions?: object,
			reactionOptions?: object,
			attribute?: string | undefined,
			theme?: string,
			successCallback?: CallableFunction,
			errorCallback?: CallableFunction
		): void;
		apply(
			attribute?: string,
			theme?: string,
			successCallback?: CallableFunction,
			errorCallback?: CallableFunction
		): void;
		draw(
			smiles: string,
			target:
				| HTMLElement
				| SVGElement
				| HTMLImageElement
				| string
				| 'svg'
				| 'canvas'
				| 'img'
				| null,
			theme?: string,
			successCallback?: CallableFunction,
			errorCallback?: CallableFunction,
			weights?: number[] | object
		): void;
		drawMolecule(
			smiles: string,
			target:
				| HTMLElement
				| SVGElement
				| HTMLImageElement
				| string
				| 'svg'
				| 'canvas'
				| 'img'
				| null,
			theme: string,
			weights: number[] | object,
			callback: CallableFunction
		): void;
		drawReaction(
			smiles: string,
			target:
				| HTMLElement
				| SVGElement
				| HTMLImageElement
				| string
				| 'svg'
				| 'canvas'
				| 'img'
				| null,
			theme: string,
			settings: object, // reaction settings
			weights: number[] | object,
			callback: CallableFunction
		): void;
		svgToCanvas(svg: SVGElement, canvas?: HTMLCanvasElement): HTMLCanvasElement;
		svgToImg(svg: SVGElement, img?: HTMLImageElement): HTMLImageElement;
		getDimensions(
			element: HTMLImageElement | HTMLCanvasElement | SVGElement,
			svg: SVGElement
		): { w: number; h: number };
	}
}
