import _ from 'lodash'

let count = 0

export default function component() {
	const element = document.createElement('div');

	// Lodash, currently included via a script, is required for this line to work
	element.innerHTML = _.join(['Hello', 'webpack', count++], ' ');

	return element;
}
