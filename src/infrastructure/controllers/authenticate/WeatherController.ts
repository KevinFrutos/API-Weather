import {Response} from "express";
import {AuthenticatedRequest} from "../../http/middlewares/authenticate";
import {GetWeatherForecast} from "../../../application/use_cases/OpenMeteo/GetWeatherForecast";
import {RedisCacheService} from "../../cache/RedisCacheService";
import {GeocodeMapsGeolocationService} from "../../http/utils/GeocodeMapsGeolocationService";
import {OpenMeteoWeatherService} from "../../http/utils/OpenMeteoWeatherService";
import Sentry from "../../logging/sentry";

export const geoService = new GeocodeMapsGeolocationService();
export const weatherService = new OpenMeteoWeatherService();
export const cacheService = new RedisCacheService();

export const weather = async (req: AuthenticatedRequest, res: Response) => {
    const { address } = req.body;
    if (!address || typeof address !== 'string') {
        res.status(400).json({ error: "Address is required" });
        return;
    }

    try {
        const useCase = new GetWeatherForecast(geoService, weatherService, cacheService);
        const result = await useCase.execute(address);
        res.status(200).json(result);
    } catch (error) {
        Sentry.captureException(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Unexpected error occurred' });
        }
    }
}
