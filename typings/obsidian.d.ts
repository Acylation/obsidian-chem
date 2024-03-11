import 'obsidian';
import { Plugin } from 'obsidian';

declare module 'obsidian' {
	interface App {
		plugins: {
			getPlugin(name: string): Plugin | null;
			plugins: {
				[id: string]: Plugin;
			};
		};
	}
}
