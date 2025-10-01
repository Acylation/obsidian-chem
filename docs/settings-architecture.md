# Settings Architecture Analysis & Refactor Proposal

Date: 2025-09-30

## 1. Current landscape

### 1.1 Settings version `v3`

`ChemPluginSettingsV3` (see `src/settings/v3.ts`) organises rendering options as:

- **`commonOptions`**: partial bag of shared fields (`width`, `scale`, `unifiedWidth`, `compactDrawing`, `explicitHydrogens`, `explicitMethyl`, `bondThickness`).
- **`smilesDrawerOptions`**: full `SmilesDrawerOptions` object (partial molecule + reaction options).
- **`rdkitOptions`**: partial `RDKitOptions`.

### 1.2 Runtime consumers

| Location                                                | How options are consumed                                                                                                                                                                                                                                              |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SmilesDrawerCore` (`src/lib/core/smilesDrawerCore.ts`) | Spreads `DEFAULT_SD_OPTIONS` with `settings.smilesDrawerOptions`, ignoring `commonOptions` during construction. Scale / width adjustments are applied later through `settings.commonOptions` when updating the produced SVG element.                                  |
| `RDKitCore` (`src/lib/core/rdkitCore.ts`)               | Builds MolDraw options by spreading `DEFAULT_RDKIT_OPTIONS` and `settings.rdkitOptions`, then performs layout scaling with `settings.commonOptions`. Additional logic (`compactDrawing`, `explicitHydrogens`, `explicitMethyl`, `bondThickness`) is handled manually. |
| `ChemSettingTab`                                        | For every shared switch / slider the code currently patches multiple branches: `commonOptions`, `smilesDrawerOptions.moleculeOptions`, and sometimes `rdkitOptions`.                                                                                                  |
| `data.json`                                             | Persists the _union_ of all fields. Shared values live in at least two places (e.g. `commonOptions.scale` and `smilesDrawerOptions.moleculeOptions.scale`).                                                                                                           |

### 1.3 Pain points

1. **State duplication**: shared fields are stored in three locations.
2. **UI coupling**: the setting tab is forced to update per-core bags to keep values in sync.
3. **Extensibility bottleneck**: adding a third core would triple the duplicated logic.
4. **Runtime drift**: `SmilesDrawerCore` caches a drawer instance built with stale per-core options, so changing `commonOptions` does not affect the drawer until the core is recreated.

## 2. Target structure (proposed `v4`)

### 2.1 Data model

```ts
interface CommonRenderOptions {
	width: number;
	unifiedWidth: number;
	scale: number; // 0 means "use unified width"
	bondThickness: number; // canonical value, mapped to RDKit `bondLineWidth`
	compactDrawing: boolean;
	explicitHydrogens: boolean; // mapped to RDKit `addChiralHs`
	explicitMethyl: boolean; // mapped to SD `terminalCarbons` + RDKit `explicitMethyl`
}

interface ChemPluginSettingsV4
	extends Omit<
		ChemPluginSettingsV3,
		'version' | 'commonOptions' | 'smilesDrawerOptions' | 'rdkitOptions'
	> {
	version: 'v4';
	render: {
		common: CommonRenderOptions;
		overrides: {
			'smiles-drawer'?: {
				molecule?: Partial<MoleculeOptions>; // fields that diverge from common defaults
				reaction?: Partial<ReactionOptions>;
			};
			rdkit?: Partial<RDKitOptions>; // RDKit-only options (palette, annotations, etc.)
		};
	};
}
```

Key ideas:

- `render.common` becomes the **single source of truth** for shared knobs.
- Per-core overrides only store deltas from the derived defaults, so new cores can be added without duplicating shared state.
- `ChemPluginSettingsV4` remains backward-compatible with the rest of the settings tree (`copy`, `dataview`, `inlineSmiles`, etc.).

### 2.2 Runtime selectors

Introduce selector helpers, e.g. `src/lib/core/optionsSelector.ts`:

```ts
export const buildSmilesDrawerOptions = (settings: ChemPluginSettings) => {
	const { render } = settings as ChemPluginSettingsV4;
	const { common, overrides } = render;

	const shared: Partial<MoleculeOptions> = {
		scale: common.scale,
		width: common.width,
		bondThickness: common.bondThickness,
		compactDrawing: common.compactDrawing,
		explicitHydrogens: common.explicitHydrogens,
		terminalCarbons: common.explicitMethyl,
	};

	return {
		moleculeOptions: {
			...DEFAULT_SD_OPTIONS.moleculeOptions,
			...shared,
			...overrides['smiles-drawer']?.molecule,
		},
		reactionOptions: {
			...DEFAULT_SD_OPTIONS.reactionOptions,
			...overrides['smiles-drawer']?.reaction,
		},
	} satisfies SmilesDrawerOptions;
};

export const buildRDKitOptions = (settings: ChemPluginSettings) => {
	const { render } = settings as ChemPluginSettingsV4;
	const { common, overrides } = render;

	return {
		...DEFAULT_RDKIT_OPTIONS,
		explicitMethyl: common.explicitMethyl,
		bondLineWidth: common.bondThickness,
		addChiralHs: common.explicitHydrogens,
		...overrides.rdkit,
	} satisfies RDKitOptions;
};
```

Both cores rely on these selectors, so they never touch the persisted tree directly.

### 2.3 UI responsibilities

- `ChemSettingTab` reads / writes **only** `render.common` for shared controls.
- Core-specific panels (if needed) manipulate `render.overrides[coreId]` objects.
- Preview refresh simply calls the selectors; no manual cross-updates.

### 2.4 Core lifecycle

- `SmilesDrawerCore` builds a drawer on each `draw` call using `buildSmilesDrawerOptions`. (A small cache keyed by JSON string of `shared` options avoids unnecessary re-instantiation.)
- `RDKitCore` obtains its options via `buildRDKitOptions` right before drawing.

### 2.5 Migration (`v3` → `v4`)

1. **Extract shared values**
   - Merge fields from `commonOptions`, `smilesDrawerOptions.moleculeOptions`, and `rdkitOptions`.
   - Normalise into `render.common` using precedence `smilesDrawerOptions` > `rdkitOptions` > `commonOptions` > defaults.
2. **Populate overrides**
   - Strip level-up fields from per-core bags; store the remainder inside `render.overrides`.
   - Example: molecule `shortBondLength`, `padding`, etc. stay in the Smiles Drawer override bag.
   - RDKit-specific palette / annotations stay under `render.overrides.rdkit`.
3. **Write migration function `migrate_3_4`** in `settings/base.ts` and bump `SETTINGS_VERSION`.
4. **Clean persisted data**
   - On first `saveSettings()` post-migration, write the new structure (which removes duplicated keys from `data.json`).
5. **Hardening**
   - Add unit tests covering migration and selectors (e.g. `src/settings/__tests__/migration.test.ts`).

## 3. Suggested implementation phases

### Phase A – selector integration (no schema change)

1. Introduce `optionsSelector.ts` with helper functions using current `v3` shape.
2. Update cores to rely on helpers, treating `commonOptions` as canonical source.
3. Simplify `ChemSettingTab` so shared controls write only `commonOptions`.
4. Add regression smoke tests to ensure both cores honour the new flow.

_Outcome_: even before `v4`, UI no longer has to juggle duplicated fields.

### Phase B – schema upgrade to `v4`

1. Extend `settings/base.ts` with `ChemPluginSettingsV4`, migration pipeline, and bump version constants.
2. Update helpers and types to consume the `render` namespace.
3. Update `data.json` via `migrateSettings` (automatic on load).
4. Remove deprecated references (`commonOptions`, `smilesDrawerOptions`, `rdkitOptions`) once migration stabilises.

### Phase C – optional enhancements

- Expose per-core override panels in the UI (collapsible accordions).
- Provide “reset override” buttons that fall back to common defaults.
- Add telemetry or logging around migrations to aid debugging.

## 4. Risk & mitigation

| Risk                                                              | Mitigation                                                                                                                             |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Unexpected option drift** because `SmilesDrawer` caches options | Build drawer per draw call or implement memoised factory keyed by `render.common` & overrides.                                         |
| **User overrides lost during migration**                          | Migration precedence ensures per-core values win when moving to common layer. Provide backup snapshot (write `data.json.v3.bak` once). |
| **Large diff touching many files**                                | Split work across phases; keep `Phase A` backwards compatible.                                                                         |

## 5. Summary checklist

- [ ] Add option selectors (Phase A).
- [ ] Update cores to use selectors.
- [ ] Simplify settings UI to touch only canonical fields.
- [ ] Design and implement `v4` schema + migration.
- [ ] Add automated coverage for migration and selectors.
- [ ] (Optional) expose per-core overrides UI.

This plan keeps `commonOptions` as the authoritative layer, reduces duplication, and prepares the codebase for adding more rendering cores without multiplying configuration complexity.
