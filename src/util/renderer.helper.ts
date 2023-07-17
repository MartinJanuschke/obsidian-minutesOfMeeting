import * as showdown from 'showdown'
export function convertToHTML(markdown: any,) {
	const converter = new showdown.Converter()
	return converter.makeHtml(markdown)
}
