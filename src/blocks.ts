import { SmilesBlock } from './SmilesBlock';

export let gBlocks: SmilesBlock[];

export const setBlocks = () => {
	gBlocks = new Array<SmilesBlock>();
};

export const addBlock = (block: SmilesBlock) => {
	gBlocks.push(block);
};

export const removeBlock = (block: SmilesBlock) => {
	if (gBlocks.indexOf(block) != -1) gBlocks.splice(gBlocks.indexOf(block), 1);
};

// TODO: late refresh
// this manager will get all the living instances
// however, we only want to see the instances refreshed when the file is activated
// file info is in the ctx of the block, and activate attribute is in the leaf metadata
export const refreshBlocks = () => {
	gBlocks.forEach((block) => {
		block.render();
	});
};
