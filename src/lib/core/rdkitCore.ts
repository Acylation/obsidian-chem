import type { ChemCore } from './ChemCore';

import { JSMol, RDKitModule, JSReaction } from '@rdkit/rdkit';
import { ChemPluginSettings } from 'src/settings/base';
import { DEFAULT_RDKIT_OPTIONS } from 'src/lib/core/rdkitOptions';
import { convertToRDKitTheme } from 'src/lib/themes/theme';
import { getCurrentTheme } from 'src/lib/themes/getCurrentTheme';

import { normalizePath, requestUrl, Notice } from 'obsidian';
import { i18n } from '../i18n';
import { githubAsset } from 'typings/githubAsset';
import { getApp } from 'src/global/app';

export default class RDKitCore implements ChemCore {
	id: 'rdkit';
	settings: ChemPluginSettings;
	core: RDKitModule;

	/**
	 * @private
	 */
	constructor(settings: ChemPluginSettings, core: RDKitModule) {
		this.settings = settings;
		this.core = core;
	}

	static async init(settings: ChemPluginSettings) {
		if (!window.RDKit) {
			try {
				window.RDKit = await loadLocal();
			} catch (e) {
				//may add unpkg via script tag, but only works on desktop
			}
		}
		return new RDKitCore(settings, window.RDKit);
	}

	draw = async (
		source: string,
		theme: string = getCurrentTheme(this.settings)
	) => {
		let svgstr = '';

		if (source.includes('>')) {
			const rxn = this.core.get_rxn(source);
			if (!rxn) return this.logError(source);
			svgstr = await this.drawReaction(rxn);
		} else {
			const mol = this.core.get_mol(source, JSON.stringify({}));
			if (!mol) return this.logError(source);

			// https://greglandrum.github.io/rdkit-blog/posts/2024-01-11-using-abbreviations.html
			if (this.settings.commonOptions.compactDrawing)
				mol.condense_abbreviations();

			svgstr = await this.drawMolecule(mol, theme);
		}

		const container = createDiv();
		container.innerHTML = svgstr;
		const svg = container.find('svg') as SVGSVGElement & HTMLElement;

		svg.setAttribute('data-smiles', source);
		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

		const w = svg.width.baseVal.value;
		const h = svg.height.baseVal.value;
		const r = w / h;
		const scale = this.settings.commonOptions.scale ?? 1;
		if (this.settings.commonOptions.scale == 0) {
			svg.style.width = `${(
				this.settings?.commonOptions.unifiedWidth ?? 300
			).toString()}px`;
			svg.style.height = `${(
				(this.settings.commonOptions?.unifiedWidth ?? 300) / r
			).toString()}px`;
		} else if (w * scale > (this.settings.commonOptions?.width ?? 300)) {
			svg.style.width = `${(
				this.settings.commonOptions?.width ?? 300
			).toString()}px`;
			svg.style.height = `${(
				(this.settings.commonOptions?.width ?? 300) / r
			).toString()}px`;
		} else if (w * scale <= (this.settings.commonOptions?.width ?? 300)) {
			svg.style.width = `${(w * scale).toString()}px`;
			svg.style.height = `${(h * scale).toString()}px`;
		}

		return svg;
	};

	private drawReaction = async (rxn: JSReaction) => {
		const svgstr = rxn.get_svg_with_highlights(
			JSON.stringify({
				width: -1,
				height: -1,
			})
		);
		return svgstr;
	};

	private drawMolecule = async (mol: JSMol, theme: string) => {
		//TODO: AbbrColour -> palette[0]
		const palette = convertToRDKitTheme(theme);
		const svgstr = mol.get_svg_with_highlights(
			JSON.stringify({
				...DEFAULT_RDKIT_OPTIONS,
				...this.settings.rdkitOptions,
				legend: mol.has_prop('_Name') ? mol.get_prop('_Name') : '',
				atomColourPalette: palette,
				queryColour: palette['6'],
				highlightColour: palette['6'],
				drawMolsSameScale: true,
				width: -1,
				height: -1,
				addChiralHs: this.settings.commonOptions.explicitHydrogens,

				//https://rdkit.org/docs/cppapi/MolDraw2D_8h_source.html#l00547
				symbolColour: palette['-1'], // the color used for reaction arrows and single-color wedged bonds
				legendColour: palette['-1'],
				annotationColour: palette['-1'],
				variableAttachmentColour: palette['-1'],
			})
		);
		return svgstr;
	};

	private logError = (source: string) => {
		const div = createDiv();
		div
			.createDiv('error-source')
			.setText(i18n.t('errors.source.title', { source }));
		div.createEl('br');
		div.createDiv().setText(i18n.t('errors.rdkit.title'));
		div.style.wordBreak = `break-word`;
		div.style.userSelect = `text`;
		return div;
	};
}

// Credits to fenjalien/obsidian-typst for the idea of loading local wasm by building object url.
// Initialize reference: https://github.com/rdkit/rdkit-js/tree/master/typescript
const loadLocal = async () => {
	const app = getApp();

	const assetPath = normalizePath(
		[app.vault.configDir, 'plugins', 'chem', 'rdkit'].join('/')
	);
	if (!(await app.vault.adapter.exists(assetPath))) {
		await app.vault.adapter.mkdir(assetPath);
	}

	await Promise.all([
		checkOrDownload('RDKit_minimal.js'),
		checkOrDownload('RDKit_minimal.wasm'),
	]);

	const jsScript = await app.vault.adapter.read(
		[assetPath, 'RDKit_minimal.js'].join('/')
	);
	const wasmBinary = new Uint8Array(
		await app.vault.adapter.readBinary(
			[assetPath, 'RDKit_minimal.wasm'].join('/')
		)
	);

	return loadRDKit(jsScript, wasmBinary);
};

// Offline loading examples https://github.com/rdkit/rdkit-js/issues/160
const loadRDKit = async (jsScript: string, wasmBinary: Uint8Array) => {
	await new Promise<void>((resolve, reject) => {
		const rdkitScriptUrl = URL.createObjectURL(
			new Blob([jsScript], {
				type: 'application/javascript',
			})
		);

		const bundler = document.createElement('script');
		bundler.src = rdkitScriptUrl;
		bundler.onload = () => {
			URL.revokeObjectURL(rdkitScriptUrl);
			resolve();
		};
		bundler.onerror = reject;
		document.body.appendChild(bundler);
	});

	const RDKit = await window.initRDKitModule({
		locateFile: () =>
			`data:application/wasm;base64,${uint8ToBase64(wasmBinary)}`,
	});

	new Notice('RDKit.js successfully loaded.');

	return RDKit;
};

const checkOrDownload = async (target: string) => {
	const app = getApp();
	const assetPath = normalizePath(
		[app.vault.configDir, 'plugins', 'chem', 'rdkit', target].join('/')
	);

	if (!(await app.vault.adapter.exists(assetPath))) {
		new Notice(`Chem: Downloading ${target}!`, 5000);

		for (const fetcher of [fetchGHAsset, fetchUnpkg]) {
			try {
				await fetcher(target, assetPath);
				new Notice(
					`Chem: Resource ${target} successfully downloaded! ✔️`,
					5000
				);
				return;
			} catch (e) {
				throw Error(`Failed to fetch resource ${target}. Error: ${e}`);
			}
		}
	}
};

const fetchUnpkg = async (target: string, localPath: string) => {
	const app = getApp();
	const data = await requestUrl(`https://unpkg.com/@rdkit/rdkit/dist/${target}`)
		.arrayBuffer;
	await app.vault.adapter.writeBinary(localPath, data);
};

const fetchGHAsset = async (target: string, localPath: string) => {
	const app = getApp();

	const assetInfo = await requestUrl(
		`https://api.github.com/repos/acylation/obsidian-chem/releases/tags/${
			app.plugins.getPlugin('chem')?.manifest.version ?? '0.4.0'
		}`
	).json;
	const asset = assetInfo.assets.find((a: githubAsset) => a.name == target);
	if (asset === undefined) throw Error('Could not find the online asset!');

	const data = await requestUrl({
		url: asset.url,
		headers: { Accept: 'application/octet-stream' },
	}).arrayBuffer;

	await app.vault.adapter.writeBinary(localPath, data);
};

// 4x space overhead comparing to direct blob url
// shall migrate to wasmBinary.toBase64()
const uint8ToBase64 = (arr: Uint8Array): string =>
	btoa(arr.reduce((binary, byte) => binary + String.fromCharCode(byte), ''));
