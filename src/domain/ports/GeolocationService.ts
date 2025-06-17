export interface IGeolocationService {
    getCoordinatesFromAddress(address: string): Promise<{lat: string, lon: string}>;
}
