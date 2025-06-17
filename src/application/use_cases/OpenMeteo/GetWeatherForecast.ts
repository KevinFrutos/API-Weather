import {IGeolocationService} from "../../../domain/ports/GeolocationService";
import {IWeatherService} from "../../../domain/ports/WeatherService";
import {WeatherResponseDTO} from "../../../infrastructure/DTO/OpenMeteo/WeatherResponseDTO";
import {ICacheService} from "../../../domain/ports/CacheService";
import {WeatherForecastResponseFormattedDTO } from "../../../infrastructure/DTO/OpenMeteo/WeatherForecastResponseFormattedDTO";
import {twelveHoursTTL} from "../../../infrastructure/cache/RedisCacheService";

export class GetWeatherForecast {
    constructor(
        private geoService: IGeolocationService,
        private weatherService: IWeatherService,
        private cacheService: ICacheService
    ) {}

    async execute(address: string): Promise<WeatherForecastResponseFormattedDTO> {
        const { lat, lon } = await this.geoService.getCoordinatesFromAddress(address);

        const cacheKey = `${lat},${lon}`;

        const cached = await this.cacheService.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }

        const weather = await this.weatherService.getWeather({
            lat,
            lon,
            current: ["temperature_2m", "wind_speed_10m"],
            hourly: ["temperature_2m", "wind_speed_10m", "precipitation_probability"],
            daily: ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "windspeed_10m_max"],
            timezone: "auto"
        });

        const formatted = this.formatWeather(weather);

        await this.cacheService.set(cacheKey, JSON.stringify(formatted), twelveHoursTTL);

        return formatted;
    }

    private formatWeather(data: WeatherResponseDTO): WeatherForecastResponseFormattedDTO {
        const formatted = {
            current: {} as Record<string, any>,
            hourly: {} as Record<string, any>,
            daily: {} as Record<string, any>
        };

        formatted.current[data.current.time] = {
            temperature_2m: data.current.temperature_2m,
            wind_speed_10m: data.current.wind_speed_10m
        };

        data.hourly.time.forEach((time, index) => {
            formatted.hourly[time] = {
                temperature_2m: data.hourly.temperature_2m[index],
                wind_speed_10m: data.hourly.wind_speed_10m[index],
                precipitation_probability: data.hourly.precipitation_probability[index]
            };
        });

        data.daily.time.forEach((date, index) => {
            formatted.daily[date] = {
                temperature_2m_max: data.daily.temperature_2m_max[index],
                temperature_2m_min: data.daily.temperature_2m_min[index],
                precipitation_sum: data.daily.precipitation_sum[index],
                windspeed_10m_max: data.daily.windspeed_10m_max[index]
            };
        });

        return formatted;
    }
}
