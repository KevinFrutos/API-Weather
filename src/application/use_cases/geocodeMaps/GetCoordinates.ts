import {IGeolocationService} from "../../../domain/ports/GeolocationService";

export class GetCoordinates {
    constructor(private geolocationService: IGeolocationService) {}

    async execute(address: string) {
        return this.geolocationService.getCoordinatesFromAddress(address);
    }
}
