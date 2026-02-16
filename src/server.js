import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { config } from "./config.js";
import { tools } from "./tools.js";
import { toolHandlers } from "./handlers.js";

class ReachyMiniServer {
	constructor() {
		this.server = new Server(
			{ name: config.name, version: config.version },
			{ capabilities: { tools: {} } },
		);

		this.server.setRequestHandler(ListToolsRequestSchema, async () => {
			return { tools };
		});

		this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
			const { name, arguments: args } = request.params;
			const handler = toolHandlers[name];
			if (!handler) {
				return {
					content: [{ type: "text", text: `Unknown tool: ${name}` }],
					isError: true,
				};
			}
			try {
				return await handler(args);
			} catch (error) {
				return {
					content: [{ type: "text", text: `Error: ${error.message}` }],
					isError: true,
				};
			}
		});
	}

	async run() {
		const transport = new StdioServerTransport();
		await this.server.connect(transport);
	}
}

const server = new ReachyMiniServer();
server.run().catch(console.error);
