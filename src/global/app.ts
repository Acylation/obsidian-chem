import { App } from 'obsidian';

export class AppStore {
	private _app: App | null = null;

	init(app: App): void {
		this._app = app;
	}

	get app(): App {
		if (!this._app) {
			throw new Error('App store not initialized. Call AppStore.init() first.');
		}
		return this._app;
	}

	clear(): void {
		this._app = null;
	}
}

export const appStore = new AppStore();
export const setApp = (app: App) => appStore.init(app);
export const getApp = () => appStore.app;
export const clearApp = () => appStore.clear();
