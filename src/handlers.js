import { httpRequest } from "./http.js";
import { http } from "./http-wrapper.js";

const ALLOWED_DATASETS = [
    "pollen-robotics/reachy-mini-emotions-library",
    "pollen-robotics/reachy-mini-dances-library",
];

// NOTE: timedRequest was a temporary diagnostic helper. Use httpRequest directly.

// Tools are intentionally allowed without a session-level wake check.

const JOINT_LIMITS = {
	head_pitch: { min: -45, max: 45 },
	head_roll: { min: -30, max: 30 },
	head_yaw: { min: -60, max: 60 },
	antenna_left: { min: -45, max: 45 },
	antenna_right: { min: -45, max: 45 },
	body_yaw: { min: -90, max: 90 },
	duration: { min: 0.1, max: 10 },
};

function validateJointValue(name, value) {
	const limits = JOINT_LIMITS[name];
	if (limits && (value < limits.min || value > limits.max)) {
		throw new Error(
			`${name} must be between ${limits.min} and ${limits.max}, got ${value}`,
		);
	}
}

// Safely stringify results for MCP `text` content to avoid returning undefined
function safeStringify(obj) {
	try {
		const s = JSON.stringify(obj, null, 2);
		return typeof s === "string" ? s : String(obj);
	} catch (e) {
		try {
			return String(obj);
		} catch (e2) {
			return "<unserializable>";
		}
	}
}

export const toolHandlers = {
    // --- Health & status ---
    health_check: async () => {
        const result = await http.request("/health-check", "POST");
        return { content: [{ type: "text", text: safeStringify(result) }] };
    },

    reachy_status: async () => {
        const result = await http.request("/api/daemon/status", "GET");
        return { content: [{ type: "text", text: safeStringify(result) }] };
    },

    // --- Lifecycle (startup / shutdown) ---
    startup_reachy: async ({ wake_up = true } = {}) => {
        const result = await http.request("/api/daemon/start", "POST", null, {
            wake_up: wake_up.toString(),
        });
        return { content: [{ type: "text", text: safeStringify(result) }] };
    },

    shutdown_reachy: async ({ goto_sleep = true } = {}) => {
        const result = await http.request("/api/daemon/stop", "POST", null, {
            goto_sleep: goto_sleep ? "true" : "false",
        });
        return { content: [{ type: "text", text: safeStringify({ step: "daemon_stop", result }) }] };
    },

    // --- Robot state & motion ---
    get_robot_state: async () => {
        const result = await http.request("/api/state/full", "GET");
        return { content: [{ type: "text", text: safeStringify(result) }] };
    },

    move_set_target: async (args) => {
        const body = {};
        if (args.head_pitch !== undefined) {
            validateJointValue("head_pitch", args.head_pitch);
            body.head_pitch = args.head_pitch;
        }
        if (args.head_roll !== undefined) {
            validateJointValue("head_roll", args.head_roll);
            body.head_roll = args.head_roll;
        }
        if (args.head_yaw !== undefined) {
            validateJointValue("head_yaw", args.head_yaw);
            body.head_yaw = args.head_yaw;
        }
        if (args.antenna_left !== undefined) {
            validateJointValue("antenna_left", args.antenna_left);
            body.antenna_left = args.antenna_left;
        }
        if (args.antenna_right !== undefined) {
            validateJointValue("antenna_right", args.antenna_right);
            body.antenna_right = args.antenna_right;
        }
        if (args.body_yaw !== undefined) {
            validateJointValue("body_yaw", args.body_yaw);
            body.body_yaw = args.body_yaw;
        }
        if (args.duration !== undefined) {
            validateJointValue("duration", args.duration);
            body.duration = args.duration;
        }
        const result = await http.request("/api/move/set_target", "POST", body);
        return { content: [{ type: "text", text: safeStringify(result) }] };
    },

    // --- Recorded moves / emotions / dances ---
    play_move: async ({ dataset, move }) => {
        if (!ALLOWED_DATASETS.includes(dataset)) {
            throw new Error(`Invalid dataset. Allowed: ${ALLOWED_DATASETS.join(", ")}`);
        }
        const result = await http.request(`/api/move/play/recorded-move-dataset/${dataset}/${move}`, "POST");
        return { content: [{ type: "text", text: safeStringify(result) }] };
    },

    play_emotion: async ({ emotion }) => {
        const result = await http.request(
            `/api/move/play/recorded-move-dataset/pollen-robotics/reachy-mini-emotions-library/${emotion}`,
            "POST",
        );
        return { content: [{ type: "text", text: safeStringify(result) }] };
    },

    play_dance: async ({ dance }) => {
        const result = await http.request(
            `/api/move/play/recorded-move-dataset/pollen-robotics/reachy-mini-dances-library/${dance}`,
            "POST",
        );
        return { content: [{ type: "text", text: safeStringify(result) }] };
    },

    list_emotions: async () => {
        const result = await http.request(
            "/api/move/recorded-move-datasets/list/pollen-robotics/reachy-mini-emotions-library",
            "GET",
        );
        return { content: [{ type: "text", text: safeStringify(result) }] };
    },

    list_dances: async () => {
        const result = await http.request(
            "/api/move/recorded-move-datasets/list/pollen-robotics/reachy-mini-dances-library",
            "GET",
        );
        return { content: [{ type: "text", text: safeStringify(result) }] };
    },

    list_moves: async ({ dataset }) => {
        if (!ALLOWED_DATASETS.includes(dataset)) {
            throw new Error(`Invalid dataset. Allowed: ${ALLOWED_DATASETS.join(", ")}`);
        }
        const result = await http.request(`/api/move/recorded-move-datasets/list/${dataset}`, "GET");
        return { content: [{ type: "text", text: safeStringify(result) }] };
    },
};
