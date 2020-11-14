module.exports = {
	chatLifts: {
		1: {
			car: {
				brand: "VW",
				model: "Golf",
				color: "#FF00FF",
				allSeats: 7,
				licensePlate: "HH-BJ-88",
				built: 2003,
				type: 'Cabrio'
			},
			departAt: "2020-10-20T06:15:08.000Z",
			arriveBy: "2020-10-20T07:15:08.000Z",
			destination: {
				id: 1,
				name: "Würfel"
			},
			start: {
				id: 6,
				name: "Stuttgart"
			},
			driver: {
				id: 1,
				name: "Bernd",
				surname: "Mayinger",
				prefs: {
					talk: "RED",
					talkMorning: "YELLOW",
					smoking: "GREEN",
					music: "RED"
				},
			},
			passengers: [
				{
					id: 4,
					fbId: 'wG3cG4M7NFMJzJYhfzFjLrJC9Q23',
					name: "Alicia",
					surname: "Müller"
				}
			],
			messages: [
				{
					id: 15,
					type: 1,
					content: "Testnachricht",
					timestamp: "2020-07-02T06:15:08.000Z",
					sentBy: 4
				},
				{
					id: 19,
					type: 1,
					content: "Neuere Testnachricht, extra lang to span multiple lines",
					timestamp: "2020-09-19T06:17:08.000Z",
					sentBy: 1
				},
				{
					id: 20,
					type: 2,
					content: "data:application/octet-stream;base64,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",
					timestamp: "2020-09-19T06:17:09.000Z",
					sentBy: 1
				}
			],
			qr: 'l501cd12fb282713d2f52ec56393f1309'
		},
		2: {
			car: {
				brand: "Audi",
				model: "A8",
				color: "#FF00FF",
				allSeats: 7,
				licensePlate: "HH-BJ-88",
				built: 2003,
				type: 'Cabrio'
			},
			departAt: "2020-10-20T06:15:08.000Z",
			arriveBy: "2020-10-20T07:15:08.000Z",
			destination: {
				id: 1,
				name: "Zweiter Würfel"
			},
			start: {
				id: 6,
				name: "Stuttgart"
			},
			driver: {
				id: 1,
				name: "Bernd",
				surname: "Mayinger",
				prefs: {
					talk: "RED",
					talkMorning: "YELLOW",
					smoking: "GREEN",
					music: "RED"
				},
			},
			passengers: [
				{
					id: 4,
					fbId: 'wG3cG4M7NFMJzJYhfzFjLrJC9Q23',
					name: "Alicia",
					surname: "Müller"
				}
			],
			messages: [
				{
					id: 15,
					type: 1,
					content: "Testnachricht",
					timestamp: "2020-07-02T06:15:08.000Z",
					sentBy: 4
				},
				{
					id: 19,
					type: 1,
					content: "Neuere Testnachricht Neuere Testnachricht, extra lang to span multiple lines Neuere Testnachricht, extra lang to span multiple lines",
					timestamp: "2020-09-21T06:17:08.000Z",
					sentBy: 1
				},
				{
					id: 59,
					type: 1,
					content: "Neuere Testnachricht Neuere Testnachricht, extra lang to span multiple lines Neuere Testnachricht, extra lang to span multiple lines",
					timestamp: "2020-09-21T06:17:09.000Z",
					sentBy: 1
				},
				{
					id: 79,
					type: 1,
					content: "Neuere Testnachricht Neuere Testnachricht, extra lang to span multiple lines Neuere Testnachricht, extra lang to span multiple lines",
					timestamp: "2020-09-21T06:17:18.000Z",
					sentBy: 4
				},
				{
					id: 100,
					type: 1,
					content: 'a newer message',
					timestamp: "2020-10-21T06:18:08.000Z",
					sentBy: 1
				}
			],
			qr: 'lcc7fb9185dcf1535b4211d661b6a0572'
		},
		3: {
			car: {
				brand: "Mazda",
				model: "Touran",
				color: "#FF00FF",
				allSeats: 7,
				licensePlate: "HH-BJ-88",
				built: 2003,
				type: 'Cabrio'
			},
			departAt: "2020-10-20T06:15:08.000Z",
			arriveBy: "2020-10-20T07:15:08.000Z",
			destination: {
				id: 1,
				name: "Dritter Würfel"
			},
			start: {
				id: 6,
				name: "Stuttgart"
			},
			stations: [{
				id: 6,
				name: "Stuttgart",
				passenger: 'Tobias'
			}],
			driver: {
				id: 1,
				name: "Bernd",
				surname: "Mayinger",
				prefs: {
					talk: "RED",
					talkMorning: "YELLOW",
					smoking: "GREEN",
					music: "RED"
				},
			},
			passengers: [
				{
					id: 4,
					fbId: 'wG3cG4M7NFMJzJYhfzFjLrJC9Q23',
					name: "Alicia",
					surname: "Müller"
				},
				{
					id: 60,
					fbId: 'wG3cG4M7NFMJzJYhfzFjLrJC9Q23',
					name: "Robert",
					surname: "Paulauer"
				},
				{
					id: 61,
					fbId: 'wG3cG4M7NFMJzJYhfzFjLrJC9Q23',
					name: "Günther",
					surname: "Vielschneider"
				},
				{
					id: 63,
					fbId: 'wG3cG4M7NFMJzJYhfzFjLrJC9Q23',
					name: "Jacob",
					surname: "Nießen"
				}
			],
			messages: [
				{
					id: 15,
					type: 1,
					content: "Testnachricht",
					timestamp: "2020-07-02T06:15:08.000Z",
					sentBy: 4
				},
				{
					id: 19,
					type: 1,
					content: "Neuere Testnachricht Neuere Testnachricht, extra lang to span multiple lines Neuere Testnachricht, extra lang to span multiple lines",
					timestamp: "2020-09-21T06:17:08.000Z",
					sentBy: 1
				},
				{
					id: 59,
					type: 1,
					content: "Neuere Testnachricht Neuere Testnachricht, extra lang to span multiple lines Neuere Testnachricht, extra lang to span multiple lines",
					timestamp: "2020-09-21T06:17:09.000Z",
					sentBy: 1
				},
				{
					id: 79,
					type: 1,
					content: "Neuere Testnachricht Neuere Testnachricht, extra lang to span multiple lines Neuere Testnachricht, extra lang to span multiple lines",
					timestamp: "2020-09-21T06:17:18.000Z",
					sentBy: 4
				},
				{
					id: 100,
					type: 1,
					content: 'a newer message',
					timestamp: "2020-10-22T14:18:08.000Z",
					sentBy: 1
				}
			],
			qr: 'lcc7fb9185dcf1535b4211d661b6a0572'
		}
	},
	marketplaceOffers:
		[
			{
				id: 1, // this offer always has preferences of visiting user, perfect for testing prefs filter
				driver: {
					fbid: "wG3cG4M7NFMJzJYcreFjLrJC9Q23",
					name: "Bernd",
					imageUrl: 'https://cdn.pixabay.com/photo/2016/10/18/18/49/witch-1751025_960_720.png',
					prefs: {
						talk: "YELLOW", // this.$store.getters["auth/user"].prefs.talk,
						talkMorning: "YELLOW",
						smoking: "YELLOW",
						music: "YELLOW"
					},
				},
				departAt: '2020-11-15T06:15:08.000Z',

				destination: {
					id: 1,
					name: "Würfel"
				},
				start: {
					id: 6,
					name: "Stuttgart"
				},
				distance: 15,
				seatsOffered: 3,
				seatsOccupied: 1,
				qr: 'l9dc9ec941d0673fcc299db0dbcad4e21'
			},
			{
				id: 4, // this offer always has preferences of visiting user, perfect for testing prefs filter
				driver: {
					fbid: "lhlhugljhljlublib",
					name: "Lorem",
					imageUrl: 'https://cdn.pixabay.com/photo/2016/10/18/18/49/witch-1751025_960_720.png',
					prefs: {
						talk: "GREEN", // this.$store.getters["auth/user"].prefs.talk,
						talkMorning: "YELLOW",
						smoking: "RED",
						music: "RED"
					},
				},
				arriveBy: '2020-07-02T06:15:08.000Z',

				destination: {
					id: 1,
					name: "Zweiter Würfel"
				},
				start: {
					id: 6,
					name: "Stuttgart"
				},
				distance: 30,
				requested: true,
				seatsOffered: 3,
				seatsOccupied: 1,
				qr: 'l9dc9ec941d067cc299db0dbcad4e21'
			},
			{
				id: 12, // this offer always has preferences of visiting user, perfect for testing prefs filter
				driver: {
					fbid: "QTs2vuk6O0RHjr8uDyLBwb9DZ5G3",
					name: "Finn",
					imageUrl: 'https://cdn.pixabay.com/photo/2016/10/18/18/49/witch-1751025_960_720.png',
					prefs: {
						talk: "RED", // this.$store.getters["auth/user"].prefs.talk,
						talkMorning: "RED",
						smoking: "RED",
						music: "RED"
					},
				},
				departAt: '2020-07-02T06:15:08.000Z',

				destination: {
					id: 1,
					name: "Dritter Würfel"
				},
				start: {
					id: 6,
					name: "Stuttgart"
				},
				distance: 50,
				seatsOffered: 3,
				seatsOccupied: 1,
				qr: 'l9dc9ec941d0673fcc9db0dbcad4e21'
			},
			{
				id: 90, // this offer always has preferences of visiting user, perfect for testing prefs filter
				driver: {
					fbid: "wG3cG4M7NFMhIgYcreFjLrJC9Q23",
					name: "Alicia",
					imageUrl: 'https://cdn.pixabay.com/photo/2016/10/18/18/49/witch-1751025_960_720.png',
					prefs: {
						talk: "YELLOW", // this.$store.getters["auth/user"].prefs.talk,
						talkMorning: "YELLOW",
						smoking: "YELLOW",
						music: "YELLOW"
					},
				},
				arriveBy: '2020-07-02T06:15:08.000Z',

				destination: {
					id: 1,
					name: "Alicias Würfel"
				},
				start: {
					id: 6,
					name: "Stuttgart"
				},
				distance: 5,
				seatsOffered: 3,
				seatsOccupied: 1,
				qr: 'l9dc9ec941d0673f299db0dbcad4e21'
			}
		],
	info: {
		imageUrl: 'https://cdn.quasar.dev/img/parallax1.jpg'
	},
	team: [
		{
			id: 10,
			name: 'Finn',
			surname: 'Floruß',
			function: 'Projektleitung',
			funcShort: 'Leitung',
			team: true,
			bio: `Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner
		 test Lorem ipsum dolor sit ein kleiner test`
		},
		{
			id: 9,
			name: 'Jonas',
			surname: 'Hochstatter',
			function: 'Projektleitung (stv)',
			funcShort: 'Leitung (stv)',
			bio: `Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner
		 test Lorem ipsum dolor sit ein kleiner test`
		},
		{
			id: 11,
			name: 'Timo',
			surname: 'Preißing',
			function: 'Qualitätssicherung',
			funcShort: 'Qualität',
			bio: `Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner
		 test Lorem ipsum dolor sit ein kleiner test`
		},
		{
			id: 4,
			name: 'Adam',
			surname: 'Peller',
			function: 'Marketing',
			bio: `Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner
		 test Lorem ipsum dolor sit ein kleiner test`
		},
		{
			id: 8,
			name: 'Merdan',
			surname: 'Dursun',
			function: 'Finanzen',
			bio: `Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner
		 test Lorem ipsum dolor sit ein kleiner test`
		},
		{
			id: 6,
			name: 'Julian',
			surname: 'Essl',
			function: 'Recht',
			bio: `Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner
		 test Lorem ipsum dolor sit ein kleiner test`
		},
		{
			id: 13,
			name: 'Jannis',
			surname: 'Rigl',
			function: 'Dokumentation',
			bio: `Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner
		 test Lorem ipsum dolor sit ein kleiner test`
		},
		{
			id: 17,
			name: 'Jochen',
			surname: 'King',
			function: 'Prozessmanagement',
			funcShort: 'Prozesse',
			bio: `Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner
		 test Lorem ipsum dolor sit ein kleiner test`
		},
		{
			id: 1,
			name: 'Bernd',
			surname: 'Mayinger',
			function: 'Layout & UX Developer',
			funcShort: 'UX & Design',
			bio: `Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner
		 test Lorem ipsum dolor sit ein kleiner test`
		},
		{
			id: 7,
			name: 'Finn',
			surname: 'Melzer',
			function: 'API Basis & Backend',
			funcShort: 'Backend',
			bio: `Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner test Lorem ipsum dolor sit ein kleiner
		 test Lorem ipsum dolor sit ein kleiner test`
		}],
	liftRequests: {
		'21/10': {
			1: [{ // is id of lift, can be used to refer to data of lift
				requestingUser: {
					id: 4,
					fbId: 'wG3cG4M7NFMhIgYcreFjLrJC9Q23',
					name: 'Alicia',
					surname: 'Müller',
					imageUrl: 'http://photos.modelmayhem.com/photos/080925/19/48dc225344d65_m.jpg',
					prefs: {
						talk: 'GREEN',
						talkMorning: 'YELLOW',
						smoking: 'RED',
						music: 'GREEN'
					},
					stats: {
						liftCount: 14,
						driverCount: 5
					},
					bio: 'Kurzbeschreibung'
				}
			}],
			2: [{
				requestingUser: {
					id: 10,
					fbId: 'kebngkg',
					name: 'Robert',
					surname: 'Dommer',
					imageUrl: 'http://photos.modelmayhem.com/photos/080925/19/48dc225344d65_m.jpg',
					prefs: {
						talk: 'GREEN',
						talkMorning: 'YELLOW',
						smoking: 'RED',
						music: 'GREEN'
					},
					stats: {
						liftCount: 1,
						driverCount: 0
					},
					bio: 'Kurzbeschreibung'
				}
			},
			{
				requestingUser: {
					id: 20,
					fbId: 'hajdkkfk0k0f',
					name: 'Albert',
					surname: 'Kazmaier',
					imageUrl: 'http://photos.modelmayhem.com/photos/080925/19/48dc225344d65_m.jpg',
					prefs: {
						talk: 'GREEN',
						talkMorning: 'YELLOW',
						smoking: 'RED',
						music: 'GREEN'
					},
					stats: {
						liftCount: 1,
						driverCount: 0
					},
					bio: 'Alberts Story'
				}
			}]
		},
		'23/10': {
			3: [{
				requestingUser: {
					id: 4,
					fbId: 'wG3cG4M7NFMhIgYcreFjLrJC9Q23',
					name: 'Alicia',
					surname: 'Müller',
					imageUrl: 'http://photos.modelmayhem.com/photos/080925/19/48dc225344d65_m.jpg',
					prefs: {
						talk: 'GREEN',
						talkMorning: 'YELLOW',
						smoking: 'RED',
						music: 'GREEN'
					},
					stats: {
						liftCount: 14,
						driverCount: 5
					},
					bio: 'Kurzbeschreibung'
				}
			}]
		}
	}
}