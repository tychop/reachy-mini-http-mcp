import { httpRequest } from "./http.js";
import { getBaseUrl } from "./config.js";

const ALLOWED_DATASETS = [
	"pollen-robotics/reachy-mini-emotions-library",
	"pollen-robotics/reachy-mini-dances-library",
];

// Helper to run httpRequest and record timing + errors for diagnostics
async function timedRequest(stepName, path, method = "GET", body = null, queryParams = {}) {
    const start = Date.now();
    try {
        const res = await httpRequest(path, method, body, queryParams);
        const duration_ms = Date.now() - start;
        return { step: stepName, success: true, status: res && res.status, data: res && res.data, duration_ms };
    } catch (err) {
        const duration_ms = Date.now() - start;
        return { step: stepName, success: false, error: err && err.message ? err.message : String(err), duration_ms };
    }
}

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

export const toolHandlers = {
	health_check: async () => {
		const result = await httpRequest("/health-check", "POST");
		return {
			content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
		};
	},

	daemon_status: async () => {
		const result = await httpRequest("/api/daemon/status", "GET");
		return {
			content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
		};
	},

	daemon_start: async ({ wake_up = true }) => {
		const result = await httpRequest("/api/daemon/start", "POST", null, {
			wake_up: wake_up.toString(),
		});
		return {
			content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
		};
	},

	get_robot_state: async () => {
		const result = await httpRequest("/api/state/full", "GET");
		return {
			content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
		};
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
		const result = await httpRequest("/api/move/set_target", "POST", body);
		return {
			content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
		};
	},

	play_emotion: async ({ emotion }) => {
		const result = await httpRequest(
			`/api/move/play/recorded-move-dataset/pollen-robotics/reachy-mini-emotions-library/${emotion}`,
			"POST",
		);
		return {
			content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
		};
	},

	play_dance: async ({ dance }) => {
		const result = await httpRequest(
			`/api/move/play/recorded-move-dataset/pollen-robotics/reachy-mini-dances-library/${dance}`,
			"POST",
		);
		return {
			content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
		};
	},

	play_move: async ({ dataset, move }) => {
		if (!ALLOWED_DATASETS.includes(dataset)) {
			throw new Error(
				`Invalid dataset. Allowed: ${ALLOWED_DATASETS.join(", ")}`,
			);
		}
		const result = await httpRequest(
			`/api/move/play/recorded-move-dataset/${dataset}/${move}`,
			"POST",
		);
		return {
			content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
		};
	},

	list_emotions: async () => {
		const result = await httpRequest(
			"/api/move/recorded-move-datasets/list/pollen-robotics/reachy-mini-emotions-library",
			"GET",
		);
		return {
			content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
		};
	},

	list_dances: async () => {
		const result = await httpRequest(
			"/api/move/recorded-move-datasets/list/pollen-robotics/reachy-mini-dances-library",
			"GET",
		);
		return {
			content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
		};
	},

	list_moves: async ({ dataset }) => {
		if (!ALLOWED_DATASETS.includes(dataset)) {
			throw new Error(
				`Invalid dataset. Allowed: ${ALLOWED_DATASETS.join(", ")}`,
			);
		}
		const result = await httpRequest(
			`/api/move/recorded-move-datasets/list/${dataset}`,
			"GET",
		);
		return {
			content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
		};
	},

	daemon_wakeup: async () => {
        // Direct wake endpoint: POST /api/daemon/wakeup
        const steps = [];
        const start = await timedRequest("daemon_status_before", "/api/daemon/status", "GET");
        steps.push(start);

        // Call the dedicated wake endpoint
        const wake = await timedRequest("daemon_wakeup", "/api/daemon/wakeup", "POST");
        steps.push(wake);

        // After wake, enable motors (best-effort)
        const motors = await timedRequest("motors_enabled", "/api/motors/set_mode/enabled", "POST");
        steps.push(motors);

        // Final status snapshot
        const final = await timedRequest("daemon_status_final", "/api/daemon/status", "GET");
        steps.push(final);

        const summary = {
            overall_backend_ready: Boolean(final.success && final.data && final.data.backend_status && final.data.backend_status.ready),
            steps_count: steps.length,
            slow_steps: steps.filter((s) => s.duration_ms && s.duration_ms > 2000),
            failures: steps.filter((s) => s.success === false),
        };

        return { content: [{ type: "json", json: { summary, steps } }] };
    },

	get_camera_stream: async () => {
		const baseUrl = getBaseUrl();
		return {
			content: [
				{
					type: "text",
					text: JSON.stringify(
						{
							message: "Camera stream endpoint",
							url: `${baseUrl}/api/camera/stream`,
							content_type: "multipart/x-mixed-replace; boundary=frame",
						},
						null,
						2,
					),
				},
			],
		};
	},

    // Removed startup_reachy: replaced by a focused daemon_wakeup tool

	shutdown_reachy: async () => {
		// Improved shutdown flow with backend readiness handling:
		// 0. GET /api/daemon/status
		// 0b. If backend not ready, POST /api/daemon/start?wake_up=false and poll until ready (timeout)
		// 1. GET /api/move/running (list running moves)
		// 2. POST /api/move/stop for each running move
		// 3. POST /api/move/play/goto_sleep
		// 4. POST /api/motors/set_mode/disabled
		// 5. POST /api/daemon/stop?goto_sleep=false (stop daemon)
		// 6. GET /api/daemon/status

		const steps = [];

		// Step 0: initial daemon status
		const initial = await httpRequest("/api/daemon/status", "GET");
		steps.push({ step: "daemon_status_initial", result: initial });

		let backendReady = Boolean(
			initial &&
			initial.data &&
			initial.data.backend_status &&
			initial.data.backend_status.ready,
		);

		// If backend not ready, try to start it (without waking the robot) and poll
		if (!backendReady) {
			const startResp = await httpRequest("/api/daemon/start", "POST", null, {
				wake_up: "false",
			});
			steps.push({ step: "daemon_start_for_shutdown", result: startResp });

			// Poll up to 30s for backend.ready
			const POLL_LIMIT = 30;
			let elapsed = 0;
			while (elapsed < POLL_LIMIT) {
				const st = await httpRequest("/api/daemon/status", "GET");
				steps.push({ step: `daemon_status_poll_${elapsed}s`, result: st });
				if (
					st &&
					st.data &&
					st.data.backend_status &&
					st.data.backend_status.ready
				) {
					backendReady = true;
					break;
				}
				// wait 1s
				await new Promise((r) => setTimeout(r, 1000));
				elapsed += 1;
			}
			if (!backendReady) {
				steps.push({
					step: "backend_ready_timeout",
					result: {
						status: 503,
						data: { detail: "backend not ready after start attempt" },
					},
				});
				// Proceed best-effort; subsequent control calls may return 503.
			}
		}

		// Step 1: list running moves
		const s1 = await httpRequest("/api/move/running", "GET");
		steps.push({ step: "list_running_moves", result: s1 });

		// Step 2: stop each running move (if any)
		const running = Array.isArray(s1.data) ? s1.data : [];
		for (const uuid of running) {
			const stopResp = await httpRequest("/api/move/stop", "POST", uuid);
			steps.push({ step: `stop_move_${uuid}`, result: stopResp });
		}

		// Step 3: play goto_sleep
		const s3 = await httpRequest("/api/move/play/goto_sleep", "POST");
		steps.push({ step: "play_goto_sleep", result: s3 });

		// Step 4: explicitly disable motors to ensure servos are released
		const s4 = await httpRequest("/api/motors/set_mode/disabled", "POST");
		steps.push({ step: "motors_disabled", result: s4 });

		// Step 5: stop daemon (don't request extra sleep)
		const s5 = await httpRequest("/api/daemon/stop", "POST", null, {
			goto_sleep: "false",
		});
		steps.push({ step: "daemon_stop", result: s5 });

		// Final status
		const s6 = await httpRequest("/api/daemon/status", "GET");
		steps.push({ step: "daemon_status_final", result: s6 });

		return { content: [{ type: "json", json: steps }] };
	},
};
