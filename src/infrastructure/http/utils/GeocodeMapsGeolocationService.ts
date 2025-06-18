import { IGeolocationService } from "../../../domain/ports/GeolocationService";
import Sentry from "../../logging/sentry";
import axios from "axios";
import {GeocodeResponseDto} from "../../DTO/GeocodeMaps/GeocodeResponseDto";

export class GeocodeMapsGeolocationService implements IGeolocationService {
    private readonly apiKey: string;
    private readonly baseUrl: string = "https://geocode.maps.co/search";

    constructor(apiKey: string = process.env.GEOCODE_MAPS_API_KEY || "") {
        this.apiKey = apiKey;
        if (!this.apiKey) {
            throw new Error("GEOCODE_MAPS_API_KEY is not defined");
        }
    }

    async getCoordinatesFromAddress(address: string): Promise<{lat: string, lon: string}> {
        try {
            const query = this.formatAddress(address);
            const url = this.buildUrl(query);
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });

            const geocodeResponse: GeocodeResponseDto[] = response.data;

            return {
                lat: geocodeResponse[0].lat,
                lon: geocodeResponse[0].lon
            };
        } catch (error) {
            Sentry.captureException(error);
            if (axios.isAxiosError(error)) {
                throw new Error(`Axios error: ${error.response?.status} ${JSON.stringify(error.response?.data)}`);
            } else {
                throw new Error(`Unexpected error: ${error}`);
            }
        }
    }

    private formatAddress(address: string): string {
        return address.trim();
    }

    private buildUrl(query: string): string {
        const url = new URL(this.baseUrl);
        url.searchParams.set("q", query);
        url.searchParams.set("api_key", this.apiKey);
        return url.toString();
    }
}
