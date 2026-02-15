import { httpRequest } from "./http.js";
import { getBaseUrl } from "./config.js";

const ALLOWED_DATASETS = [
  "pollen-robotics/reachy-mini-emotions-library",
  "pollen-robotics/reachy-mini-dances-library",
];

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
    throw new Error(`${name} must be between ${limits.min} and ${limits.max}, got ${value}`);
  }
}

export const toolHandlers = {
  health_check: async () => {
    const result = await httpRequest("/health-check", "POST");
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },

  daemon_status: async () => {
    const result = await httpRequest("/api/daemon/status", "GET");
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },

  daemon_start: async ({ wake_up = true }) => {
    const result = await httpRequest("/api/daemon/start", "POST", { wake_up });
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },

  get_robot_state: async () => {
    const result = await httpRequest("/api/state/full", "GET");
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
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
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },

  play_emotion: async ({ emotion }) => {
    const result = await httpRequest(
      `/api/move/play/recorded-move-dataset/pollen-robotics/reachy-mini-emotions-library/${emotion}`,
      "POST"
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },

  play_dance: async ({ dance }) => {
    const result = await httpRequest(
      `/api/move/play/recorded-move-dataset/pollen-robotics/reachy-mini-dances-library/${dance}`,
      "POST"
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },

  play_move: async ({ dataset, move }) => {
    if (!ALLOWED_DATASETS.includes(dataset)) {
      throw new Error(`Invalid dataset. Allowed: ${ALLOWED_DATASETS.join(", ")}`);
    }
    const result = await httpRequest(
      `/api/move/play/recorded-move-dataset/${dataset}/${move}`,
      "POST"
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },

  list_emotions: async () => {
    const result = await httpRequest(
      "/api/move/recorded-move-datasets/list/pollen-robotics/reachy-mini-emotions-library",
      "GET"
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },

  list_dances: async () => {
    const result = await httpRequest(
      "/api/move/recorded-move-datasets/list/pollen-robotics/reachy-mini-dances-library",
      "GET"
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  },

  list_moves: async ({ dataset }) => {
    if (!ALLOWED_DATASETS.includes(dataset)) {
      throw new Error(`Invalid dataset. Allowed: ${ALLOWED_DATASETS.join(", ")}`);
    }
    const result = await httpRequest(
      `/api/move/recorded-move-datasets/list/${dataset}`,
      "GET"
    );
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
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
            2
          ),
        },
      ],
    };
  },
};
