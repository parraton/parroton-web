import { HttpClient, Api } from 'tonapi-sdk-js';

// Configure the HTTP client with your host and token
const httpClient: HttpClient = new HttpClient({
  baseUrl: new URL(process.env.NEXT_PUBLIC_TONAPI_URL!).origin,
  baseApiParams: {
    headers: {
      'Content-type': 'application/json',
      // Authorization: `Bearer ${process.env.NEXT_PUBLIC_TON_API_KEY}`,
    },
  },
});

export const tonApiHttpClient = new Api(httpClient);
