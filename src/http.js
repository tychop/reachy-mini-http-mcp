import http from "http";
import { URL } from "url";
import { getBaseUrl } from "./config.js";

const DEFAULT_TIMEOUT = 10000;

export async function httpRequest(path, method = "GET", body = null, queryParams = {}) {
  const baseUrl = getBaseUrl();
  const url = new URL(path, baseUrl);

  for (const [key, value] of Object.entries(queryParams)) {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  }

  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname + url.search,
    method: method,
    headers: body ? { "Content-Type": "application/json" } : {},
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        if (!data) {
          resolve({ status: res.statusCode, data: { status: res.statusCode } });
          return;
        }
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          reject(new Error(`Invalid JSON response: ${data.slice(0, 100)}`));
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(DEFAULT_TIMEOUT, () => {
      req.destroy();
      reject(new Error(`Request timeout after ${DEFAULT_TIMEOUT}ms`));
    });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}
