module.exports = {
    lifts: {
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
            ]
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
            ]
        }
    }
}