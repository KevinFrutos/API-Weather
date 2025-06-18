export interface WeatherForecastResponseFormattedDTO {
    current: Record<string, WeatherData>;
    hourly: Record<string, WeatherData>;
    daily: Record<string, WeatherData>;
}

export interface WeatherData {
    temperature?: number;
    apparent_temperature?: number;
    precipitation_sum?: number;
    precipitation_probability?: number;
    weather_code?: number;
    wind_speed?: number;
    wind_direction?: number;
    humidity?: number;
    is_day?: boolean;
    sunrise?: string;
    sunset?: string;
}
