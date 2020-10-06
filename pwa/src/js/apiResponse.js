module.exports = {
	chatLifts: {
		1: {
			car: {
				brand: "VW",
				model: "Golf",
				color: "#FF00FF",
				occupiedSeats: 5,
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
				surname: "Mayinger"
			},
			passengers: [
				{
					id: 4,
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
					content: "Neuere Testnachricht",
					timestamp: "2020-09-19T06:17:08.000Z",
					sentBy: 1
				}
			],
			qr: 1 //'l501cd12fb282713d2f52ec56393f1309'
		},
		2: {
			car: {
				brand: "HEHEHE",
				model: "Golf",
				color: "#FF00FF",
				occupiedSeats: 5,
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
				surname: "Mayinger"
			},
			passengers: [
				{
					id: 4,
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
					content: "Neuere Testnachricht",
					timestamp: "2020-09-21T06:17:08.000Z",
					sentBy: 1
				}
			],
			qr: 2// 'lcc7fb9185dcf1535b4211d661b6a0572'
		}
	},
	marketplaceOffers:
		[
			{
				id: 1,
				driver: {
					fbid: "wG3cG4M7NFMJzJYhfzFjLrJC9Q23",
					name: "Ipsum",
					imageUrl: 'https://cdn.pixabay.com/photo/2017/02/15/20/22/animal-2069717_960_720.png',
					prefs: {
						talk: "GREEN",
						talkMorning: "GREEN",
						smoking: "GREEN",
						music: "GREEN",
					},
				},
				day_pattern: null,
				next_drive: [new Date(), new Date()],
				postcode: 70182,
				city: "Stuttgart",
				distance: 35,
				seatsOffered: 4,
				seatsOccupied: 2,
				requested: true,
				qr: 'lf6b9fde87097ad72c08d91fa9cc32754'
			},
			{
				id: 2,
				driver: {
					fbid: "QTs2vuk6O0RHjr8uDyLBwb9DZ5G3",
					name: "Finn",
					imageUrl: 'https://cdn.pixabay.com/photo/2017/02/25/23/50/animal-2099057_960_720.png',
					prefs: {
						talk: "RED",
						talkMorning: "RED",
						smoking: "RED",
						music: "RED",
					},
				},
				day_pattern: null,
				next_drive: [new Date("2-2-2020"), new Date()],
				postcode: 70182,
				city: "Stuttgart",
				distance: 30,
				seatsOffered: 3,
				seatsOccupied: 1,
				qr: 'l7aa0bb70783505b942fda3277be8b7cb'
			},
			{
				id: 3,
				driver: {
					fbid: "wG3cG4M7NFMJzJYcreFjLrJC9jf6",
					name: "Herr",
					imageUrl: 'https://cdn.pixabay.com/photo/2016/10/29/20/25/beard-1781443_960_720.png',
					prefs: {
						talk: "YELLOW",
						talkMorning: "YELLOW",
						smoking: "YELLOW",
						music: "YELLOW",
					},
				},
				day_pattern: {
					Montag: [true, true],
					Dienstag: [false, true],
					Mittwoch: [true, false],
					Donnerstag: [true, true],
					Freitag: [false, true],
					Samstag: [false, false],
					Sonntag: [false, false],
				},
				next_drive: null,
				postcode: 70182,
				city: "Stuttgart",
				distance: 20,
				seatsOffered: 2,
				seatsOccupied: 0,
				qr: 'l1cfcc168ce73625da23dadebd027030d'
			},
			{
				id: 4, // this offer always has preferences of visiting user, perfect for testing prefs filter
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
				day_pattern: null,
				next_drive: [new Date("2-2-2020"), new Date()],
				postcode: 86653,
				city: "Daiting",
				distance: 15,
				seatsOffered: 3,
				seatsOccupied: 1,
				qr: 'l9dc9ec941d0673fcc299db0dbcad4e21'
			},
		]
}