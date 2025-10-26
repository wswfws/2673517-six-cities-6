export type City = {
  name: string;
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
};

export type Point = {
  id: string;
  latitude: number;
  longitude: number;
};

export type Points = Point[];
