import { refreshBlocks } from './blocks';

export const themeObserver = new MutationObserver(function (mutations) {
	mutations.forEach(function (mutation) {
		const target = mutation.target as HTMLElement;
		if (
			// dark -> dark & light -> light
			mutation.oldValue?.contains('theme-dark') &&
			!mutation.oldValue?.contains('theme-light') && // key line, avoid calling twice
			target.classList.value.contains('theme-light')
		) {
			refreshBlocks();
		} else if (
			// light -> empty -> dark
			mutation.oldValue?.contains('theme-light') && // key line, avoid calling twice
			!mutation.oldValue?.contains('theme-dark') &&
			target.classList.value.contains('theme-dark')
		) {
			refreshBlocks();
		}
	});
});

export const setObserver = () => {
	themeObserver.observe(document.body, {
		attributes: true,
		attributeOldValue: true,
		attributeFilter: ['class'],
	});
};

export const detachObserver = () => {
	themeObserver.disconnect();
};
