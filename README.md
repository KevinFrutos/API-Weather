# API - Weather Forecast

A RESTful API for retrieving weather forecasts based on user-provided locations, built with Node.js, TypeScript, and Redis, following a Hexagonal Architecture. It integrates external geolocation and weather services and provides structured, cache-optimized responses for daily, hourly, and current forecasts.

---

## SETUP

### Prerequisites

* Node.js >= 18
* MongoDB instance (local or cloud)
* Redis instance (local or cloud)
* Sentry instance (local or cloud)
* GeocodeMaps API Key

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and set the following:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
SENTRY_DSN=your_sentry_dns
NODE_ENV=your_environment
GEOCODE_MAPS_API_KEY=your_geocode_maps_api_key
```

### Run the App

```bash
npm run dev
```

Server will start at `http://localhost:PORT`

---

## Routes

### Auth

| Method | Endpoint                | Description         | Request Body                                               | Response Example                |
| ------ | ----------------------- | ------------------- |------------------------------------------------------------|---------------------------------|
| POST   | `/api/v1/auth/register` | Register new user   | `{ "email": "user@example.com", "password": "secret123" }` | `{ "token": "jwt_token_here" }` |
| POST   | `/api/v1/auth/login`    | Login existing user | `{ "email": "user@example.com", "password": "secret123" }` | `{ "token": "jwt_token_here" }` |

### Weather Forecast

The `/weather` route require a Bearer token in the `Authorization` header.

| Method | Endpoint                   | Description             | Request Body                               | Response Example                                                                                                                                                                                                                                                                                                                                       |
| ------ |----------------------------|-------------------------|--------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| POST   | `/api/v1/weather/forecast` | Get weather forecast    | `{ "address": "Via Laietana, Barcelona" }` | `{ "current": { "2025-06-18T18:30": { "temperature_2m": 27.6, "wind_speed_10m": 12.3 } }, "hourly": { "2025-06-18T00:00": { "temperature_2m": 22.5, "wind_speed_10m": 3.6, "precipitation_probability": 0 } }, "daily": { "2025-06-18": { "temperature_2m_max": 30, "temperature_2m_min": 19, "precipitation_sum": 0, "windspeed_10m_max": 16.3 } } }` |

---

## Testing

```bash
npm run test
```

---

## License

MIT
