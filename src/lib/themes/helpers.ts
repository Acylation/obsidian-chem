export type RGBDecimal = [number, number, number];

/**
 * @param {string} hex Hex color leading by char '#'
 **/
export function hex2RGB(hex: string): RGBDecimal {
	hex = hex.slice(1);

	// Expand shorthand hex color
	if (hex.length === 3) {
		hex = hex
			.split('')
			.map((l) => l.repeat(2))
			.join('');
	}

	const hexInt = parseInt(hex, 16);
	const r = (hexInt >> 16) & 255;
	const g = (hexInt >> 8) & 255;
	const b = hexInt & 255;

	return [r / 255, g / 255, b / 255];
}

/**
 * @param {RGBDecimal} rgb a number array with each part betweeen 0-1
 **/
export function RGB2hex(rgb: RGBDecimal): string {
	return (
		'#' +
		rgb
			.map((v) =>
				Math.round(v * 255)
					.toString(16)
					.padStart(2, '0')
			)
			.join('')
	);
}
