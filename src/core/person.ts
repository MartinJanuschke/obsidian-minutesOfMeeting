export interface Person {
	firstName: string;
	lastName: string;
	eMail: string;
}

class Attendee implements Person {
	constructor(
		public firstName: string,
		public lastName: string,
		public eMail: string
	) {}
}

export class PersonFactory {
	public static createPerson(
		firstName: string,
		lastName: string,
		eMail: string
	) {
		return new Attendee(firstName, lastName, eMail);
	}
}

// abstract class PersonCreator {
// 	public abstract factoryMethod(): Person;
// 	public createPerson(): Person {
// 		const person = this.factoryMethod();
// 		return person;
// 	}
// }

// export class AttendeeCreator extends PersonCreator {
// 	constructor(
// 		public firstName: string,
// 		public lastName: string,
// 		public eMail: string
// 	) {
// 		super();
// 	}

// 	public factoryMethod(): Person {
// 		return new Attendee(this.firstName, this.lastName, this.eMail);
// 	}
// }
