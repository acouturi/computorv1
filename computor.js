'use strict';

main();

function	main() {
	if (process.argv.length < 3 ) {
		console.log("bad usage : node computor.js \"Equation\"\nThe equation must be in the form : \"5 + 4 * X - 9.3 * X^2 = 1 * X^2\"");
		return(0);
	}
	else {
		let baseString = process.argv[2];
		baseString = baseString.split(' ').join('');
		let modString = parseString(baseString);
		if (modString == 0)
			return(0);
		let baseDegres = creatDeg(modString, baseString);
		if (baseDegres == undefined)
			return(0);
		printReduceForm(baseDegres);
		let maxdeg = printDegres(baseDegres)
		if (maxdeg == 0)
			printNoDegres(baseDegres)
		else if (maxdeg > 2)
			console.log("The polynomial degree is stricly greater than 2, I can't solve.");
		else if (maxdeg == 1)
			printFirstDeg(baseDegres)
		else if (maxdeg == 2)
			printSecondDeg(baseDegres)
	}
}

function	printNoDegres(baseDegres) {
	if (baseDegres[0] == 0 || baseDegres[0] == undefined)
		console.log("The polynomial degree is stricly equal than 0, all real Number are the solution.");
	else
		console.log("The polynomial degree is stricly equal than 0 but we have an inequality, no real Number are the solution.");
}

function	sqrt(nb)
{
	let calc;
	let diff;

	if (nb == 0.0 || nb == 1.0)
		return(nb);
	calc = nb;
	diff = calc;
	calc = 0.5 * (calc + nb / calc);
	while (calc != diff)
	{
		diff = calc;
		calc = 0.5 * (calc + nb / calc);
	}
	return(calc);
}

function	pgcd(a, b)
{
	let r;
	while (b != 0)
    {
		r = a;
		while(r >= b)
			r -= b
		a = b;
		b = r;
	}
	return(a);
}

function	parseString(baseString) {
	for (let i = 0; i < baseString.length; i++) {
		if ("0123456789+-*=X.^".indexOf(baseString[i]) == -1) {
			console.log("bad Equation form (we have unknown character)\n"+baseString + '\n' + ' '.repeat(i) + "^\nThe equation must be in the form : \"5 + 4 * X - 9.3 * X^2 = 1 * X^2\"");
			return(0);
		}
	}
	let modString = baseString.split('=');
	if (modString.length != 2) {
		console.log("bad Equation form (we need to have exactly one '=')\nThe equation must be in the form : \"5 + 4 * X - 9.3 * X^2 = 1 * X^2\"");
		return(0);
	}
	modString[1] = modString[1].replace(/\-/g,'m').replace(/\+/g,'-').replace(/m/g,'+');
	if (modString[1][0] == '-') {
		modString[1] = modString[1].replace('-', '');
		modString = modString.join('-');
	}
	else if (modString[1][0] == '+') {
		modString[1] = modString[1].replace('+', '');
		modString = modString.join('+');
	}
	else
		modString = modString.join('-');
	if (modString[0] != '-' && modString[0] != '+')
		modString = '+' + modString;
	return(modString)
}

function	creatDeg(modString, baseString) {
	let baseDegres = [0,0,0];
	let tmp = modString[0];
	for (let i = 1; i < modString.length + 1; i++) {
		let element = modString[i];
		if (element == '-' || element == '+' || element == undefined) {
			let operation = tmp[0];
			let deg = undefined;
			let val = 1;

			tmp = tmp.slice(1).split('*');
			for (let j = 0; j < tmp.length; j++) {
				let tmpelement = tmp[j];
				if (tmpelement == '') {
					console.log("bad Equation (invalid operator usage)\n"+baseString + '\n'+' '.repeat(i - 1 - tmp.slice(j).join('*').toString().length) + "^\nThe equation must be in the form : \"5 + 4 * X - 9.3 * X^2 = 1 * X^2\"");
					return(undefined);
				}
				else if (tmpelement.indexOf('X^') == 0) {
					tmpelement = tmpelement.slice(2);
					
					if  (deg != undefined) {
						console.log("bad Equation form (multiple usage of 'X')\n" + baseString + '\n' + ' '.repeat(i - tmp.slice(j).join('*').toString().length) + "^\nThe equation must be in the form : \"5 + 4 * X - 9.3 * X^2 = 1 * X^2\"");
						return(undefined);
					}
					deg = Number(tmpelement)
					if  (tmpelement == '') {
						console.log("bad Equation form (wrong use of 'X^', unexpected character)\n" + baseString + '\n' + ' '.repeat(i + 1 - tmp.slice(j).join('*').toString().length) + "^\nThe equation must be in the form : \"5 + 4 * X - 9.3 * X^2 = 1 * X^2\"");
						return(undefined);
					}
					if (tmpelement.indexOf('.') != -1 || tmpelement.indexOf('X') != -1 || tmpelement.indexOf('^') != -1) {
						let tmp1 = tmpelement.indexOf('.');
						let tmp2 = tmpelement.indexOf('X');
						let tmp3 = tmpelement.indexOf('^');
						tmp1 = tmp1 == -1 ? tmpelement.length + 1 : tmp1;
						tmp2 = tmp2 == -1 ? tmpelement.length + 1 : tmp2;
						tmp3 = tmp3 == -1 ? tmpelement.length + 1 : tmp3;
						let place = tmp1 < tmp2 ? tmp1 < tmp3 ? tmp1 : tmp3 : tmp2 < tmp3 ? tmp2 : tmp3;
						console.log("bad Equation form (wrong use of 'X^', unexpected character)\n" + baseString + '\n' + ' '.repeat(i + 1 - tmp.slice(j).join('*').toString().length + place) + "^\nThe equation must be in the form : \"5 + 4 * X - 9.3 * X^2 = 1 * X^2\"");
						return(undefined);
					}
				}
				else if (tmpelement.indexOf('X') == 0) {
					if  (deg != undefined || tmpelement[1] != undefined) {
						console.log("bad Equation form (multiple usage of 'X')\n" + baseString + '\n' + ' '.repeat(i - 1- tmp.slice(j).join('*').toString().length) + "^\nThe equation must be in the form : \"5 + 4 * X - 9.3 * X^2 = 1 * X^2\"");
						return(undefined);
					}
					deg = 1
				}
				else if (tmpelement.indexOf('X') != -1 || tmpelement.indexOf('^') != -1) {
					let tmp1 = tmpelement.indexOf('X');
					let tmp2 = tmpelement.indexOf('^');
					let place = tmp1 < tmp2 ? tmp1 : tmp2;
					tmp1 = tmp1 == -1 ? tmpelement.length + 1 : tmp1;
					tmp2 = tmp2 == -1 ? tmpelement.length + 1 : tmp2;
					console.log("bad Equation form (unexpected character)\n" + baseString + '\n' + ' '.repeat(i - 1 + place- tmp.slice(j).join('*').toString().length) + "^\nThe equation must be in the form : \"5 + 4 * X - 9.3 * X^2 = 1 * X^2\"");
					return(undefined);
				}
				else
					val *= Number(tmpelement);
			}
			if (deg == undefined)
				deg = 0;
			if (baseDegres[deg] == undefined)
				baseDegres[deg] = 0;
			baseDegres[deg] += operation == '+' ? val : -val;
			tmp = element;
		}
		else
			tmp += element;
	}
	return(baseDegres)
}

function	printSecondDeg(baseDegres) {
	let delta = baseDegres[1]*baseDegres[1]-4*baseDegres[0]*baseDegres[2];
	if (delta < 0)
		printDeltaLow(baseDegres, delta)
	else if (delta == 0)
		printDeltaEqu(baseDegres);
	else 
		printDeltaSup(baseDegres, delta);
}

function	printDeltaLow(baseDegres, delta) {
	console.log("Discriminant is strictly negative, the two solutions are:");
	let sqrtdelta = sqrt(-delta);
	let x1 = (-baseDegres[1]-sqrtdelta)/(2*baseDegres[2]);
	let x2 = (-baseDegres[1]+sqrtdelta)/(2*baseDegres[2]);

	if (parseInt(sqrtdelta) == sqrtdelta) {
		let lineup = -baseDegres[1] + ' - i' + sqrtdelta;
		let linedown = 2*baseDegres[2];
		let lengtheq = lineup.toString().length > linedown.toString().length ? lineup.toString().length : linedown.toString().length;
		console.log("     " + lineup + '\nX1 = '+'_'.repeat(lengtheq) + "\n     " + linedown);
	}
	else {
		let lineup = -baseDegres[1] + ' - i√' + (- delta);
		let linedown = 2*baseDegres[2];
		let lengtheq = lineup.toString().length > linedown.toString().length ? lineup.toString().length : linedown.toString().length;
		console.log("     " + lineup + '\nX1 = '+'_'.repeat(lengtheq) + "\n     " + linedown);
	}

	if (parseInt(sqrtdelta) == sqrtdelta) {
		let lineup = -baseDegres[1] + ' + i' + sqrtdelta;
		let linedown = 2*baseDegres[2];
		let lengtheq = lineup.toString().length > linedown.toString().length ? lineup.toString().length : linedown.toString().length;
		console.log("     " + lineup + '\nX2 = '+'_'.repeat(lengtheq) + "\n     " + linedown);
	}
	else {
		let lineup = -baseDegres[1] + ' + i√' + (- delta);
		let linedown = 2*baseDegres[2];
		let lengtheq = lineup.toString().length > linedown.toString().length ? lineup.toString().length : linedown.toString().length;
		console.log("     " + lineup + '\nX2 = '+'_'.repeat(lengtheq) + "\n     " + linedown);
	}
}

function	printDeltaEqu(baseDegres) {
	console.log("Discriminant is strictly equal to 0, the solution is:");
	if (-baseDegres[1]/(2*baseDegres[2]))
		console.log(-baseDegres[1]/(2*baseDegres[2]));
	else
		console.log(0);
}

function	printDeltaSup(baseDegres, delta) {
	console.log("Discriminant is strictly positive, the two solutions are:")
	let sqrtdelta = sqrt(delta);
	let x1 = (-baseDegres[1]-sqrtdelta)/(2*baseDegres[2]);
	let x2 = (-baseDegres[1]+sqrtdelta)/(2*baseDegres[2]);
	if (parseInt(x1) == x1)
		console.log('X1 = ' + x1);
	else if (parseInt(sqrtdelta) == sqrtdelta) {
		let pgcdall = pgcd(-baseDegres[1]-sqrtdelta,2*baseDegres[2]);
		let lineup = (-baseDegres[1]-sqrtdelta)/pgcdall;
		let linedown = (2*baseDegres[2])/pgcdall;
		let lengtheq = lineup.toString().length > linedown.toString().length ? lineup.toString().length : linedown.toString().length;
		console.log("     " + lineup + '\nX1 = '+'_'.repeat(lengtheq) + " ≈ " + x1 + "\n     " + linedown);
	}
	else {
		let lineup = -baseDegres[1] + ' - √' + delta;
		let linedown = 2*baseDegres[2];
		let lengtheq = lineup.toString().length > linedown.toString().length ? lineup.toString().length : linedown.toString().length;
		console.log("     " + lineup + '\nX1 = '+'_'.repeat(lengtheq) + " ≈ " + x1 + "\n     " + linedown);
	}
	if (parseInt(x2) == x2)
		console.log('X2 = ' + x2);
	else if (parseInt(sqrtdelta) == sqrtdelta) {
		let pgcdall = pgcd(-baseDegres[1]+sqrtdelta,2*baseDegres[2]);
		let lineup = (-baseDegres[1]+sqrtdelta)/pgcdall;
		let linedown = (2*baseDegres[2])/pgcdall;
		let lengtheq = lineup.toString().length > linedown.toString().length ? lineup.toString().length : linedown.toString().length;
		console.log("     " + lineup + '\nX2 = '+'_'.repeat(lengtheq) + " ≈ " + x2 + "\n     " + linedown);
	}
	else {
		let lineup = -baseDegres[1] + ' + √' + delta;
		let linedown = 2*baseDegres[2];
		let lengtheq = lineup.toString().length > linedown.toString().length ? lineup.toString().length : linedown.toString().length;
		console.log("     " + lineup + '\nX2 = '+'_'.repeat(lengtheq) + " ≈ " + x2 + "\n     " + linedown);
	}
}

function	printFirstDeg(baseDegres) {
	console.log("The solve is :");
	if (-baseDegres[0]/baseDegres[1])
		console.log(-baseDegres[0]/baseDegres[1]);
	else 
		console.log(0);
}

function	printDegres(baseDegres) {
	let maxdeg = 0;
	maxdeg = baseDegres.length - 1;
	for (let i = baseDegres.length-1; i >= 0; i--) {
		if (baseDegres[i] != undefined && baseDegres[i] != 0) {
			maxdeg = i;
			i = -1;
		}
		if (i == 0)
			maxdeg = 0;
	}
	console.log("Polynomial degree: " + (maxdeg));
	return(maxdeg)
}

function	printReduceForm(baseDegres) {
	let reduceForm = '';

	for (let i = 0; i < baseDegres.length; i++) {
		if (i == 0 && baseDegres[i] && baseDegres[i] != 0) {
			reduceForm += baseDegres[i] > 0 ? '+' : '';
			reduceForm += baseDegres[i] + i + ' ';
		}
		else if (i == 1 && baseDegres[i] && baseDegres[i] != 0) {
			reduceForm += baseDegres[i] > 0 ? '+' : '';
			reduceForm += baseDegres[i] + ' * X ';
		}
		else if (baseDegres[i] && baseDegres[i] != 0) {
			reduceForm += baseDegres[i] > 0 ? '+' : '';
			reduceForm += baseDegres[i] + ' * X^' + i + ' ';
		}
	}
	reduceForm = reduceForm.replace(/\-/g,'- ');
	reduceForm = reduceForm.replace(/\+/g,'+ ');
	if (reduceForm.indexOf('+') == 0)
		reduceForm = reduceForm.replace('+ ', '');
	if (reduceForm == '')
		reduceForm = '0 ';
	reduceForm += '= 0';
	console.log(reduceForm);
}
