import { Modal, App, ButtonComponent } from 'obsidian';
import { i18n } from 'src/lib/i18n';

export class CoreFallbackModal extends Modal {
	msg: string;
	onConfirm: () => void;

	constructor(app: App, text: string, onConfrim: () => void) {
		super(app);
		this.msg = text;
		this.onConfirm = onConfrim;
	}

	onOpen() {
		const { contentEl } = this;

		contentEl.createEl('h3', {
			text: i18n.t('modals.core-fallback.title'),
		});

		contentEl.createEl('div', {
			text: i18n.t('modals.core-fallback.message'),
		});

		contentEl.createEl('br');

		contentEl.createEl('div', {
			text: this.msg,
		});

		const div = contentEl.createDiv();
		div.style.display = 'flex';
		div.style.flex = '1 1 auto';
		div.style.justifyContent = 'flex-end';
		div.style.padding = '3px';

		new ButtonComponent(div)
			.setCta()
			.setButtonText(i18n.t('modals.core-fallback.confirm'))
			.onClick(() => {
				this.close();
			});
	}

	onClose() {
		this.onConfirm();
		const { contentEl } = this;
		contentEl.empty();
	}
}
