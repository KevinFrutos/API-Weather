export interface WeatherResponseDTO {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current_units: CurrentUnits;
    current: CurrentWeather;
    hourly_units: HourlyUnits;
    hourly: HourlyWeather;
    daily_units: DailyUnits;
    daily: DailyWeather;
}

export interface CurrentUnits {
    time: string;
    interval: string;
    temperature_2m: string;
    wind_speed_10m: string;
}

export interface CurrentWeather {
    time: string;
    interval: number;
    temperature_2m: number;
    wind_speed_10m: number;
}

export interface HourlyUnits {
    time: string;
    temperature_2m: string;
    wind_speed_10m: string;
    precipitation_probability: string;
}

export interface HourlyWeather {
    time: string[];
    temperature_2m: number[];
    wind_speed_10m: number[];
    precipitation_probability: number[];
}

export interface DailyUnits {
    time: string;
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_sum: string;
    windspeed_10m_max: string;
}

export interface DailyWeather {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
}
