import {WeatherRequestDTO} from "../../infrastructure/DTO/OpenMeteo/WeatherRequestDTO";
import {WeatherResponseDTO} from "../../infrastructure/DTO/OpenMeteo/WeatherResponseDTO";

export interface IWeatherService {
    getWeather(options: WeatherRequestDTO): Promise<WeatherResponseDTO>;
}
