import { FuzzySuggestModal, Notice, TFile } from "obsidian";

export class PersonSuggest extends FuzzySuggestModal<TFile> {
	getItems(): TFile[] {
		const allFiles: TFile[] = this.app.vault.getMarkdownFiles();
		// Filter all Files with #Person Tag
		return allFiles.filter((files) => {
			const filesCache = this.app.metadataCache.getFileCache(files);
			return filesCache?.frontmatter?.tags?.find(
				(tagCache: string[]) => tagCache.includes("Person")
			);
		});
	}
	getItemText(item: TFile): string {
		return item.basename;
	}
	onChooseItem(item: TFile, evt: MouseEvent | KeyboardEvent): void {
		new Notice("Selected: " + item.basename);
	}
}
