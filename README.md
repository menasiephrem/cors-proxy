# URL Shortener and Proxy Server

This project is a simple Node.js application built with Express that acts as both a URL shortener and a proxy server. It allows you to shorten URLs and proxy requests to those shortened URLs. Additionally, it can proxy requests to any URL passed as a query parameter.

## Features

- **URL Shortening**: Shortens URLs and stores them locally using a file-based storage system (`key-file-storage`).
- **Proxy Server**: Proxies GET requests to any given URL, preserving the headers.
- **CORS Support**: The server allows cross-origin resource sharing (CORS) by default.
- **Streamed Responses**: Supports streaming responses, such as serving PDFs directly from the proxy.

## Technologies Used

- **Express**: Web framework for Node.js.
- **Axios**: HTTP client for making requests to external URLs.
- **key-file-storage**: Simple file-based key-value storage for persisting shortened URLs.
- **Cors**: Middleware for enabling CORS support.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:

   ```bash
   git clone 
   cd cors-proxy
   ```

2. **Install the dependencies**:

   ```bash
   pnpm install
   ```

3. **Start the server**:

   ```bash
   pnpm start
   ```

   The server will start running on `http://localhost:1234`.

## Usage

### Proxy Requests

You can proxy requests by appending the target URL as a query parameter to the base URL. For example:

```bash
http://localhost:1234/?https://example.com
```

This will proxy the request to `https://example.com` and stream the response back.

### URL Shortening

You can shorten URLs by sending a GET request to `/shorten` with the URL you want to shorten as a query parameter:

```bash
http://localhost:1234/shorten?https://example.com
```

The server will respond with a shortened URL, such as:

```json
{
  "shortenUrl": "http://localhost:1234/abcd"
}
```

You can then use this shortened URL to proxy requests to the original URL.

### Accessing a Shortened URL

You can access the original URL by hitting the shortened URL:

```bash
http://localhost:1234/abcd
```

This will redirect the request to the original URL and proxy the response back.

## Example Requests

1. **Proxy Request**:

   ```bash
   curl "http://localhost:1234/?https://www.example.com"
   ```

2. **Shorten URL**:

   ```bash
   curl "http://localhost:1234/shorten?https://www.example.com"
   ```

3. **Access Shortened URL**:

   ```bash
   curl "http://localhost:1234/abcd"
   ```

## Configuration

- The server runs on port `1234` by default. You can change this in the `app.listen` call in the `index.js` file.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
