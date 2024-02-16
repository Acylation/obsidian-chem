import { RDKitModule } from '@rdkit/rdkit';

declare global {
	interface Window {
		RDKit: RDKitModule;
	}
}
