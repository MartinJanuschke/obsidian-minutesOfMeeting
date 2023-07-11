import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	setIcon,
} from "obsidian";
import { transporter } from "src/mailer";

interface MinutesOfMeetingSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MinutesOfMeetingSettings = {
	mySetting: "default",
};

export default class MinutesOfMeetingPlugin extends Plugin {
	settings: MinutesOfMeetingSettings;

	async onload() {
		// left iconBar
		this.addRibbonIcon("keyboard", "Print to console", () => {
			console.log("Hello, you!");
		});
		transporter.verify((error, success) => {
			if (error) {
				console.log(error);
			} else {
				console.log("server is ready");
			}
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-minutes-of-meeting-modal",
			name: "New Minutes of Meeting",
			callback: () => {
				new MinutesModal(this.app).open();
			},
		});
		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: "open-person-modal",
			name: "New Person",
			callback: () => {
				new PersonModal(this.app).open();
			},
		});

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item.setTitle("Print file path 👋🏻")
						.setIcon("document")
						.onClick(async () => {
							new Notice(file.path);
							window.location.href = "mailto:martin.januschke@googlemail.com"
						});
				});
			})
		);

		this.registerEvent(
			this.app.workspace.on("editor-menu", (menu, editor, view) => {
				menu.addItem((item) => {
					item.setTitle("Print file path 👈")
						.setIcon("document")
						.onClick(async () => {
							if (view.file) new Notice(view.file.path);
						});
				});
			})
		);

		await this.loadSettings();

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// // This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new Notice('This is a notice!');
		// });
		// // Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// // This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'open-sample-modal-simple',
		// 	name: 'Open sample modal (simple)',
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	}
		// });
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// // Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class MinutesModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h1", { text: "Meeting details" });
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class newNote {
	constructor() {}
}

class PersonModal extends Modal {
	result: string;

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h1", { text: "Meeting details" });
		new Setting(contentEl).setName("Name").addText((text) =>
			text.onChange((value) => {
				this.result = value;
			})
		);

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Submit")
				.setCta()
				.onClick(() => {
					this.close();
					this.onSubmit(this.result);
				})
		);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	onSubmit(result: any) {
		this.app.vault.create('templates/test.md','a sample file',{})
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MinutesOfMeetingPlugin;

	constructor(app: App, plugin: MinutesOfMeetingPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Minutes of Meeting Settings" });

		new Setting(containerEl)
			.setName("SMPT Server")
			.setDesc("some text here...")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						console.log("Secret: " + value);
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
