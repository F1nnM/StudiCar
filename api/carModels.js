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
		Kompaktwagen: [
			'Giulietta'
		],
		Kombi: [
			'Quadrifoglio', 'Limousine'
		],
		SUV: [
			'Quadrifoglio', 'Stelvio', 'Tonale Concept'
		],
		Sportwagen: [
			'Giulia GTA'
		]
	},
	Audi: {
		Kompaktwagen: [
			'A1', 'A2'
		],
		Kombi: [
			'A3', 'A4', 'A6', 'e-tron'
		],
		Limousine: [
			'A3', 'A4', 'A5', 'A6', 'A7', 'A8'
		],
		Cabrio: [
			'A3', 'S3', 'A5', 'TT Roadster', 'TTS Roadster', 'TTRS Roadster'
		],
		SUV: [
			'Q2', 'SQ2', 'Q3', 'RSQ3', 'Q4', 'Q5', 'SQ5', 'Q6', 'Q7', 'SQ7', 'Q8', 'SQ8', 'RSQ8', 'SQ3', 'SQ4', 'SQ5', 'SQ7', 'RSQ3', 'RSQ5'
		],
		Sportwagen: [
			'TT', 'TTS', 'TTRS', 'RS3', 'RS4', 'RS5', 'RS6', 'RS7', 'R8'
		]
	},
	Arlows: {

	},
	BMW: {
		Kompaktwagen: [
			'1er'
		],
		Kombi: [
			'2er Active', '5er'
		],
		Limousine: [
			'2er', '3er', '4er', '5er', '6er', '7er', '8er'
		],
		SUV: [
			'X1', 'X2', 'X2 M', 'X3', 'X3 M', 'X4', 'X4 M', 'X5', 'X5 M', 'X6', 'X6 M', 'X7', 'X7 M'
		],
		Sportwagen: [
			'1er M', '2er M', '3er M', '4er M', '5er M', '7er M', '8er M', 'Z4', 'Z4 M'
		]
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
		Kompaktwagen: [
			'500'
		],
		Kombi: [
			'500L'
		],
		Limousine: [
			'Tipo'
		],
		Cabrio: [
			'500'
		],
		SUV: [
			'Panda'
		]
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
		Kompaktwagen: [
			'Picanto'
		],
		Kombi: [
			'Seat'
		],
		Limousine: [
			'Stinger'
		],
		Cabrio: [
			'Stinger'
		],
		SUV: [
			'Stonic'
		]
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
		Kompaktwagen: [
			'Mazda 2'
		],
		Kombi: [
			'Mazda 3'
		],
		Limousine: [
			'Mazda 6'
		],
		Cabrio: [
			'MX5'
		],
		SUV: [
			'CX5'
		],
		Transporter: [
			'E-Serie'
		]
	},
	Mercedes: {
		Kompaktwagen: [
			'A-Klasse', 'B-Klasse', 'GLA', 'CLA'
		],
		Kombi: [
			'B-Klasse', 'CLA', 'C-Klasse T', 'E-Klasse T'
		],
		Limousine: [
			'A-Klasse', 'C-Klasse', 'E-Klasse', 'S-Klasse', 'Maybach'
		],
		Cabrio: [
			'SL', 'SLC', 'C-Klasse', 'E-Klasse', 'GT'
		],
		SUV: [
			'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Klasse Geländewagen'
		],
		Transporter: [
			'V-Klasse'
		],
		Sportwagen: [
			'A-Klasse', 'C-Klasse', 'E-Klasse', 'S-Klasse', 'G-Klasse', 'GT'
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
		Kompaktwagen: [
			'Corsa', 'Adam', 'Karl'
		],
		Kombi: [
			'Astra', 'Insignia'
		],
		SUV: [
			'Crossland', 'Grandland', 'Mokka'
		],
		Sportwagen: [
			'Astra', 'Insignia'
		],
		Transporter: [
			'Movano'
		]
	},
	Peugeot: {
		Kompaktwagen: [
			'108', '208'
		],
		Kombi: [
			'308', '508',
		],
		SUV: [
			'2008'
		],
		Sportwagen: [
			'308 GTI', ''
		]
	},
	Porsche: {

	},
	Renault: {
		Kompaktwagen: [
			'Twingo'
		],
		Kombi: [
			'Clio'
		],
		Limousine: [
			'Talisman'
		],
		Cabrio: [
			'Captur'
		],
		SUV: [
			'Koleos'
		],
		Sportwagen: [

		],
		Transporter: [
			'Trafik'
		]
	},
	Ruf: {

	},
	Saab: {

	},
	Seat: {

	},
	Skoda: {
		Kompaktwagen: [
			'City Go', 'Fabia'
		],
		Kombi: [
			'Octavia'
		],
		Limousine: [
			'Superb'
		],
		SUV: [
			'Karoq'
		]
	},
	Smart: {
		Kompaktwagen: [
			'ForTwo'
		],
		Kombi: [
			'ForFour'
		]
	},
	Suzuki: {

	},
	Tesla: {

	},
	Toyota: {
		Kompaktwagen: [
			'Aygo', 'Yaris'
		],
		Kombi: [
			'Prius'
		],
		Limousine: [
			'Corolla', 'Camry'
		],
		Cabrio: [
			'Corolla', 'Aygo'
		],
		SUV: [
			'Rav4', 'Land Cruiser', 'Hilux'
		],
		Transporter: [
			'Proace'
		]
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