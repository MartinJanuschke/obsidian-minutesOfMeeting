export function mailBuilder(to: string[], subject: string, body: any) {
	const args = [];
	if (typeof subject !== "undefined") {
		args.push("subject=" + encodeURIComponent(subject));
	}
	if (typeof body !== "undefined") {
		args.push("body=" + encodeURIComponent(body));
	}

	let url = "mailto:" + encodeURIComponent(to.toString());
	if (args.length > 0) {
		url += "?" + args.join("&");
	}
	return url;
}
