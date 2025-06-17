export interface WeatherRequestDTO {
    lat: string;
    lon: string;
    current?: string[];
    hourly?: string[];
    daily?: string[];
    timezone?: string;
}
