import { App, Modal, Setting } from "obsidian";
import { PersonFactory } from "src/core/person";

export class PersonModal extends Modal {
	firstName: string;
	lastName: string;
	eMail: string;

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h1", { text: "Person Details" });
		new Setting(contentEl).setName("firstName").addText((firstName) =>
			firstName.onChange((value) => {
				this.firstName = value;
			})
		);

		new Setting(contentEl).setName("lastName").addText((lastName) =>
			lastName.onChange((value) => {
				this.lastName = value;
			})
		);

		new Setting(contentEl).setName("Email").addText((email) =>
			email.onChange((value) => {
				this.eMail = value;
			})
		);

		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Submit")
				.setCta()
				.onClick(() => {
					this.close();
					this.onSubmit(this.firstName, this.lastName, this.eMail);
				})
		);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}

	async onSubmit(firstName: string, lastName: string, eMail: string) {
		const person = PersonFactory.createPerson(firstName, lastName, eMail);
		await this.app.vault.create(
			`person/${person.firstName} ${person.lastName}.md`,
            // TODO refactor to frontMatterGenerator
			`---\ntags:\n - Person\nmail: ${person.eMail}\n---\n`
		);
	}
}
