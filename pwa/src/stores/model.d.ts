export interface Car {
  carId: number | null;
  brand: string;
  model: string;
  type: string;
  licensePlate: string;
  year: number;
  seats: number;
  color: string;
}

export interface Prefs {
  smoking: string;
  music: string;
  talk: string;
  talkMorning: string;
}

export interface Driver {
  id: string;
  name: string;
  surname: string;
  prefs: Prefs;
}

export interface LiftEndpoint {
  name: string;
  id: number;
}

export interface Lift {
  id: number;
  liftId: string;
  driver: Driver;
  departAt: string;
  arriveBy: string;
  destination: LiftEndpoint;
  start: LiftEndpoint;
  seatsOffered: number;
  seatsOccupied: number;
  repeatsOn: string | null;
  date: string | null;
}

export interface BasicUser {
  id: string;
  name: string;
  surname: string;
}

export interface DatabaseAnswer {
  uid: string;
  name: string;
  gender: string;
  bio: string;
  stats: {
    createdAt: string;
    liftCount: number;
    driverCount: number;
  };
  prefs: Prefs;
  settings: {
    liftMaxDistance: number;
  };
  addresses: Array<{
    id: string;
    nickname: string;
    postcode: string;
    city: string;
    street: string;
    number: string;
    isDefault: boolean;
  }>;
  cars: Array<Car>;
  chatLifts: Array<{
    id: number;
    car: {
      brand: string;
      model: string;
      seatsWithoutDriver: number;
      licensePlate: string;
      built: number;
      type: string;
      color: string;
    };
    departAt: string;
    arriveBy: string;
    destination: LiftEndpoint;
    start: LiftEndpoint;
    driver: Driver;
    passengers: Array<BasicUser>;
    messages: Array<{
      type: number;
      content: string;
      timestamp: string;
      sentBy: string;
    }>;
    repeatsOn: string;
    data: string;
  }>;
  liftRequests: Array<{
    liftId: number;
    requestingUsers: Array<{
      id: string;
      name: string;
      surname: string;
      description: string;
      prefs: Prefs;
      stats: {
        liftCount: number;
        driverCount: number;
      };
    }>;
  }>;
  outgoingRequests: Array<Lift>;
  topFriends: Array<{
    id: number;
    fbId: string;
    name: string;
    surname: string;
    imageUrl: string;
    lifts: number;
  }>;
  friends: Array<{
    fbId: string;
    name: string;
    surname: string;
    friended: {
      in: boolean;
      me: boolean;
    };
  }>;
  marketplaceOffers: Array<Lift>;
}
