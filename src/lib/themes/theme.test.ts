import { expect, test } from '@jest/globals';
import { convertToRDKitTheme, convertToSDTheme } from './theme';

test('Convert to RDKit theme.', () => {
	expect(convertToRDKitTheme('light')).toStrictEqual({
		'-1': [102 / 255, 102 / 255, 102 / 255],
		'0': [34 / 255, 34 / 255, 34 / 255],
		'6': [34 / 255, 34 / 255, 34 / 255],
		'7': [52 / 255, 152 / 255, 219 / 255],
		'8': [231 / 255, 76 / 255, 60 / 255],
		'9': [39 / 255, 174 / 255, 96 / 255],
		'14': [230 / 255, 126 / 255, 34 / 255],
		'15': [211 / 255, 84 / 255, 0],
		'16': [241 / 255, 196 / 255, 15 / 255],
		'17': [22 / 255, 160 / 255, 133 / 255],
		'35': [211 / 255, 84 / 255, 0],
		'53': [142 / 255, 68 / 255, 173 / 255],
		'5': [230 / 255, 126 / 255, 34 / 255],
		'201': [102 / 255, 102 / 255, 102 / 255],
	});
});

test('Convert to Smiles Drawer format theme.', () => {
	expect(convertToSDTheme('rdkit-cdk')).toStrictEqual({
		C: '#000000',
		O: '#ff0d0d',
		N: '#3050f8',
		F: '#90e050',
		CL: '#1f7f1f',
		BR: '#a62929',
		I: '#940094',
		P: '#ff8000',
		S: '#c6c62c',
		B: '#ffb5b5',
		BACKGROUND: '#ffffff',
	});
});
