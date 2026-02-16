export const config = {
	name: "reachy-mini-http-mcp",
	version: "1.0.0",
	defaultHost: process.env.REACHY_HOST || "reachy-mini.home",
	defaultPort: process.env.REACHY_PORT || "8000",
};

export function getBaseUrl() {
	const host = process.env.REACHY_HOST || config.defaultHost;
	const port = process.env.REACHY_PORT || config.defaultPort;
	return `http://${host}:${port}`;
}
