import axios, { AxiosResponse } from "axios";
import { google } from "../config";
import moment from "moment-timezone";
import qs from "qs";

type GeoAddress = {
  address: string;
  location: string;
};

type GeoLocation = {
  lat: number;
  lng: number;
};

type GeocodeResponse = {
  results: {
    formatted_address: string;
    geometry: {
      location: GeoLocation;
    };
  }[];
};

type TimezoneResponse = {
  status: string;
  timeZoneId: string;
};

export class GoogleMapsService {
  private baseUrl = "https://maps.googleapis.com/maps/api";
  private key: string;

  constructor() {
    this.key = google.mapsApiKey;
  }

  async getLocation(input: string): Promise<GeoAddress | null> {
    let data: GeocodeResponse;
    try {
      const endpoint = `${this.baseUrl}/geocode/json`;
      const params = {
        sensor: false,
        address: input,
        key: this.key,
      };
      const res = await axios.get(`${endpoint}?${qs.stringify(params)}`, {
        headers: {
          Accept: "application/json",
        },
      });
      if (res.status !== 200) throw new Error(res.statusText);

      data = res.data;
    } catch (error) {
      throw error;
    }
    if (data.results.length) {
      const address = data.results[0];
      return {
        address: address.formatted_address,
        location: `${address.geometry.location.lat},${address.geometry.location.lng}`,
      };
    }

    return null;
  }

  async getTimezone(input: string): Promise<string | null> {
    let data: TimezoneResponse;
    try {
      const endpoint = `${this.baseUrl}/timezone/json`;
      const params = {
        timestamp: moment().unix(),
        location: input,
        key: this.key,
      };
      const res = await axios.get(`${endpoint}?${qs.stringify(params)}`, {
        headers: {
          Accept: "application/json",
        },
      });
      if (res.status !== 200) throw new Error(res.statusText);

      data = res.data;
    } catch (error) {
      throw error;
    }
    if (data.status === "OK") return data.timeZoneId;

    return null;
  }
}
