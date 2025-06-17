import { IWeatherService } from "../../../domain/ports/WeatherService";
import axios from "axios";
import Sentry from "../../logging/sentry";
import {WeatherRequestDTO} from "../../DTO/OpenMeteo/WeatherRequestDTO";
import {WeatherResponseDTO} from "../../DTO/OpenMeteo/WeatherResponseDTO";

export class OpenMeteoWeatherService implements IWeatherService {
    private readonly baseUrl = "https://api.open-meteo.com/v1/forecast";

    async getWeather(options: WeatherRequestDTO): Promise<WeatherResponseDTO> {
        try {
            const url = this.buildUrl(options);

            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.data as WeatherResponseDTO;
        } catch (error) {
            Sentry.captureException(error);
            if (axios.isAxiosError(error)) {
                throw new Error(`Axios error: ${error.response?.status} ${JSON.stringify(error.response?.data)}`);
            } else {
                throw new Error(`Unexpected error: ${error}`);
            }
        }
    }

    private buildUrl(options: WeatherRequestDTO): string {
        const url = new URL(this.baseUrl);
        url.searchParams.set("latitude", options.lat);
        url.searchParams.set("longitude", options.lon);

        this.buildBaseParams(url, options);

        return url.toString();
    }

    private buildBaseParams(url: URL, options: WeatherRequestDTO): void {
        const paramsMap: Record<string, string[] | undefined> = {
            daily: options.daily,
            hourly: options.hourly,
            current: options.current
        };

        for (const [key, values] of Object.entries(paramsMap)) {
            if (values?.length) {
                url.searchParams.set(key, values.join(','));
            }
        }

        if (options.timezone) {
            url.searchParams.set("timezone", options.timezone);
        }
    }
}
