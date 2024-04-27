import { expect, test } from '@jest/globals';
import { hex2RGB, RGB2hex } from './helpers';

test('Convert 6-digit hex color to RGB decimal.', () => {
	expect(hex2RGB('#5d6e6a')).toStrictEqual([93 / 255, 110 / 255, 106 / 255]);
	expect(hex2RGB('#329c5c')).toStrictEqual([50 / 255, 156 / 255, 92 / 255]);
	expect(hex2RGB('#e44f81')).toStrictEqual([228 / 255, 79 / 255, 129 / 255]);
	expect(hex2RGB('#761a82')).toStrictEqual([118 / 255, 26 / 255, 130 / 255]);
	expect(hex2RGB('#34f7d3')).toStrictEqual([52 / 255, 247 / 255, 211 / 255]);
	expect(hex2RGB('#ec5ea8')).toStrictEqual([236 / 255, 94 / 255, 168 / 255]);
	expect(hex2RGB('#bb965a')).toStrictEqual([187 / 255, 150 / 255, 90 / 255]);
	expect(hex2RGB('#686df3')).toStrictEqual([104 / 255, 109 / 255, 243 / 255]);
	expect(hex2RGB('#de35a7')).toStrictEqual([222 / 255, 53 / 255, 167 / 255]);
	expect(hex2RGB('#7a46e0')).toStrictEqual([122 / 255, 70 / 255, 224 / 255]);
});

test('Convert 3-digit hex color to RGB decimal.', () => {
	expect(hex2RGB('#000')).toStrictEqual([0, 0, 0]);
	expect(hex2RGB('#fff')).toStrictEqual([1, 1, 1]);
	expect(hex2RGB('#c6f')).toStrictEqual([204 / 255, 102 / 255, 1]);
});

test('Encode RGB decimal values back to hex string.', () => {
	expect('#5d6e6a').toStrictEqual(RGB2hex([93 / 255, 110 / 255, 106 / 255]));
	expect('#329c5c').toStrictEqual(RGB2hex([50 / 255, 156 / 255, 92 / 255]));
	expect('#e44f81').toStrictEqual(RGB2hex([228 / 255, 79 / 255, 129 / 255]));
	expect('#761a82').toStrictEqual(RGB2hex([118 / 255, 26 / 255, 130 / 255]));
	expect('#34f7d3').toStrictEqual(RGB2hex([52 / 255, 247 / 255, 211 / 255]));
	expect('#ec5ea8').toStrictEqual(RGB2hex([236 / 255, 94 / 255, 168 / 255]));
	expect('#bb965a').toStrictEqual(RGB2hex([187 / 255, 150 / 255, 90 / 255]));
	expect('#686df3').toStrictEqual(RGB2hex([104 / 255, 109 / 255, 243 / 255]));
	expect('#de35a7').toStrictEqual(RGB2hex([222 / 255, 53 / 255, 167 / 255]));
	expect('#7a46e0').toStrictEqual(RGB2hex([122 / 255, 70 / 255, 224 / 255]));
});

test('Encode will always return 6-digit hex string.', () => {
	expect('#000000').toStrictEqual(RGB2hex([0, 0, 0]));
	expect('#ffffff').toStrictEqual(RGB2hex([1, 1, 1]));
	expect('#cc66ff').toStrictEqual(RGB2hex([204 / 255, 102 / 255, 1]));
});
