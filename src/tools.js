export const tools = [
	{
		name: "health_check",
		description:
			"Check if the Reachy Mini dashboard is responding. Use this to verify the robot is reachable.",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "daemon_wakeup",
		description:
			"Trigger the daemon wake-up sequence (full robot wake). Use to fully wake the robot from sleep.\n\nThis replaces the previous `startup_reachy` tool which had a longer startup flow.",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "shutdown_reachy",
		description:
			"Shutdown Reachy Mini: stop running moves, request sleep and stop the daemon; returns status after each step.",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "daemon_status",
		description:
			"Get the current daemon health status. Returns daemon state and backend status.",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "daemon_start",
		description:
			"Start the Reachy Mini daemon. Optionally wake up the robot motors.",
		inputSchema: {
			type: "object",
			properties: {
				wake_up: {
					type: "boolean",
					description: "Whether to wake up the robot motors (default: true)",
					default: true,
				},
			},
		},
	},
	{
		name: "get_robot_state",
		description:
			"Get a snapshot of the full robot state including joint positions, velocities, and sensor data.",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "move_set_target",
		description:
			"Set the target position for the robot's head/body. Use this for direct joint control.",
		inputSchema: {
			type: "object",
			properties: {
				head_pitch: {
					type: "number",
					description: "Head pitch angle in degrees (-45 to 45)",
					minimum: -45,
					maximum: 45,
				},
				head_roll: {
					type: "number",
					description: "Head roll angle in degrees (-30 to 30)",
					minimum: -30,
					maximum: 30,
				},
				head_yaw: {
					type: "number",
					description: "Head yaw angle in degrees (-60 to 60)",
					minimum: -60,
					maximum: 60,
				},
				antenna_left: {
					type: "number",
					description: "Left antenna angle in degrees (-45 to 45)",
					minimum: -45,
					maximum: 45,
				},
				antenna_right: {
					type: "number",
					description: "Right antenna angle in degrees (-45 to 45)",
					minimum: -45,
					maximum: 45,
				},
				body_yaw: {
					type: "number",
					description: "Body yaw rotation in degrees (-90 to 90)",
					minimum: -90,
					maximum: 90,
				},
				duration: {
					type: "number",
					description: "Movement duration in seconds (0.1 to 10)",
					minimum: 0.1,
					maximum: 10,
					default: 1.0,
				},
			},
		},
	},
	{
		name: "play_emotion",
		description:
			"Play a recorded emotion animation on the robot. Over 70 emotions available.",
		inputSchema: {
			type: "object",
			properties: {
				emotion: {
					type: "string",
					description: "Name of the emotion to play",
					enum: [
						"amazed1",
						"anxiety1",
						"attentive1",
						"attentive2",
						"boredom1",
						"boredom2",
						"calming1",
						"cheerful1",
						"come1",
						"confused1",
						"contempt1",
						"curious1",
						"dance1",
						"dance2",
						"dance3",
						"disgusted1",
						"displeased1",
						"displeased2",
						"downcast1",
						"dying1",
						"electric1",
						"enthusiastic1",
						"enthusiastic2",
						"exhausted1",
						"fear1",
						"frustrated1",
						"furious1",
						"go_away1",
						"grateful1",
						"helpful1",
						"helpful2",
						"impatient1",
						"impatient2",
						"incomprehensible2",
						"indifferent1",
						"inquiring1",
						"inquiring2",
						"inquiring3",
						"irritated1",
						"irritated2",
						"laughing1",
						"laughing2",
						"lonely1",
						"lost1",
						"loving1",
						"no1",
						"no_excited1",
						"no_sad1",
						"oops1",
						"oops2",
						"proud1",
						"proud2",
						"proud3",
						"rage1",
						"relief1",
						"relief2",
						"reprimand1",
						"reprimand2",
						"reprimand3",
						"resigned1",
						"sad1",
						"sad2",
						"scared1",
						"serenity1",
						"shy1",
						"sleep1",
						"success1",
						"success2",
						"surprised1",
						"surprised2",
						"thoughtful1",
						"thoughtful2",
						"tired1",
						"uncertain1",
						"uncomfortable1",
						"understanding1",
						"understanding2",
						"welcoming1",
						"welcoming2",
						"yes1",
						"yes_sad1",
					],
				},
			},
			required: ["emotion"],
		},
	},
	{
		name: "play_dance",
		description:
			"Play a recorded dance animation on the robot. 19 dances available.",
		inputSchema: {
			type: "object",
			properties: {
				dance: {
					type: "string",
					description: "Name of the dance to play",
					enum: [
						"chicken_peck",
						"chin_lead",
						"dizzy_spin",
						"grid_snap",
						"groovy_sway_and_roll",
						"head_tilt_roll",
						"interwoven_spirals",
						"jackson_square",
						"neck_recoil",
						"pendulum_swing",
						"polyrhythm_combo",
						"sharp_side_tilt",
						"side_glance_flick",
						"side_peekaboo",
						"side_to_side_sway",
						"simple_nod",
						"stumble_and_recover",
						"uh_huh_tilt",
						"yeah_nod",
					],
				},
			},
			required: ["dance"],
		},
	},
	{
		name: "play_move",
		description: "Play any recorded movement from a dataset.",
		inputSchema: {
			type: "object",
			properties: {
				dataset: {
					type: "string",
					description:
						"Dataset name (allowed: 'pollen-robotics/reachy-mini-emotions-library', 'pollen-robotics/reachy-mini-dances-library')",
					enum: [
						"pollen-robotics/reachy-mini-emotions-library",
						"pollen-robotics/reachy-mini-dances-library",
					],
				},
				move: {
					type: "string",
					description: "Name of the move to play",
				},
			},
			required: ["dataset", "move"],
		},
	},
	{
		name: "list_emotions",
		description: "List all available emotions in the emotions library.",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "list_dances",
		description: "List all available dances in the dances library.",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "list_moves",
		description: "List all available moves in a recorded move dataset.",
		inputSchema: {
			type: "object",
			properties: {
				dataset: {
					type: "string",
					description:
						"Dataset name (allowed: 'pollen-robotics/reachy-mini-emotions-library', 'pollen-robotics/reachy-mini-dances-library')",
					enum: [
						"pollen-robotics/reachy-mini-emotions-library",
						"pollen-robotics/reachy-mini-dances-library",
					],
				},
			},
			required: ["dataset"],
		},
	},
	{
		name: "get_camera_stream",
		description:
			"Get information about the camera stream endpoint. Returns the MJPEG stream URL.",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
];
