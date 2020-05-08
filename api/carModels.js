module.exports = {
	allColors () {
		return colors
	},
	all: () => {
		return models
	},
	countBrands: () => {
		return Object.keys(models).length
	},
	countModels: (brand) => {
		var all = 0
		if (brand) {
			for (let type in models[brand]) {
				all += type.length
			}
		}
		else {
			for (let brand in models) {
				for (let type in brand) {
					all += type.length
				}
			}
		}
		return all
	},
	getAllWithType: (type) => {
		var arr = {}
		for (let brand in models) {
			if (type in models[brand]) {
				arr[brand] = models[brand][type] // output will be sth like this: Audi: ['A1', A2'], Mercedes: ['A-Klasse']
			}
		}
		return arr
	},
	brand: (brand) => {
		return models[brand]
	}
}

var colors = {
	graustufen: {
		weiß: 'white',
		hellgrau: 'grey-5',
		dunkelgrau: 'blue-grey-10',
		ebenholz: 'dark',
		schwarz: 'black'
	},
	rot: {
		hellrot: 'red-3',
		rot: 'red',
		dunkelrot: 'red-14',
		rosa: 'pink-4',
		pink: 'pink',
		dunkelpink: 'pink-14'
	},
	blau: {
		hellblau: 'light-blue-6',
		blau: 'blue',
		tiefblau: 'blue-10',
		mitternachtsblau: 'indigo-10', violett: 'purple',
		türkis: 'cyan-12',
		blaugrau: 'blue-grey-8'
	},
	grün: {
		hellgrün: 'light-green-13',
		giftgrün: 'green-13',
		grün: 'green',
		dunkelgrün: 'green-10'
	},
	gelb: {
		hellgelb: 'yellow-3',
		limone: 'lime',
		gelb: 'yellow',
		knallgelb: 'yellow-12',
		dunkelgelb: 'yellow-14',
		ocker: 'lime-10'
	},
	orange: {
		hellorange: 'amber-7',
		orange: 'orange',
		blutorange: 'orange-10'
	},
	braun: {
		hellbraun: 'brown-13',
		braun: 'brown',
		dunkelbraun: 'brown-10'
	}
}

var models = {
	Alfa_Romeo: {

	},
	Audi: {
		Kompaktwagen: [
			'A1', 'A2'
		],
		Kombi: [
			'A4', 'A6'
		],
		Limousine: [
			'A5', 'A7', 'A4', 'A3'
		],
		Cabrio: [
			'A3', 'A5', 'TT Roadster', 'TTS Roadster', 'TTRS Roadster'
		],
		SUV: [
			'Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8', 'SQ3', 'SQ4', 'SQ5', 'SQ7', 'RSQ3', 'RSQ5'
		]
	},
	BMW: {

	},
	Chevrolet: {

	},
	Chrysler: {

	},
	Citroen: {

	},
	Corvette: {

	},
	Dacia: {

	},
	Dodge: {

	},
	Ferrari: {

	},
	Fiat: {

	},
	Ford: {

	},
	Honda: {

	},
	Hummer: {

	},
	Hyundai: {

	},
	Iveco: {

	},
	Jaguar: {

	},
	Jeep: {

	},
	Kia: {

	},
	Lada: {

	},
	Land_Rover: {

	},
	Lexus: {

	},
	Lotus: {

	},
	Maserati: {

	},
	Mazda: {

	},
	Mercedes: {
		Kompaktwagen: [
			'A-Klasse'
		],
		Kombi: [
			'B-Klasse'
		],
		Limousine: [
			'S-Klasse'
		],
		Cabrio: [
			'SL'
		],
		SUV: [
			'GLS'
		],
		Transporter: [
			'V-Klasse'
		]
	},
	MG: {

	},
	Mini: {

	},
	Mitsubishi: {

	},
	Nissan: {

	},
	Opel: {

	},
	Peugeot: {

	},
	Porsche: {

	},
	Renault: {

	},
	Ruf: {

	},
	Saab: {

	},
	Seat: {

	},
	Skoda: {

	},
	Smart: {

	},
	Suzuki: {

	},
	Tesla: {

	},
	Toyota: {

	},
	Trabant: {

	},
	VW: {
		Kompaktwagen: [
			'Lupo'
		]
	},
	Volvo: {

	}
}