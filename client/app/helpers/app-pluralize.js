import {helper} from "@ember/component/helper";

const temlatesPlural = {
	"участник": ["участник", "участника", "участников"],
	"человек": ["человек", "человека", "человек"],
};

export function appPluralize([count, key]) {
	let countString = count.toString();
	let countLength = countString.length;
	let temlateLength = temlatesPlural[key].length;
	let resultCount = count + " ";

	if (countString[countLength - 2] === "1" ) {
		return resultCount + temlatesPlural[key][temlateLength - 1];
	} else if (countString[countLength - 1] === "2" || countString[countLength - 1] === "3" || countString[countLength - 1] === "4" ) {
		return resultCount + temlatesPlural[key][temlateLength - 2];
	} else if (countString[countLength - 1] === "1") {
		return resultCount + temlatesPlural[key][0];
	} else {
		return resultCount + temlatesPlural[key][temlateLength - 1];
	}
}

export default helper(appPluralize);
