export const toolExamples = {
  shutdown_reachy: [
    { goto_sleep: true },
    { goto_sleep: false },
  ],
  startup_reachy: [
    { wake_up: true },
    { wake_up: false },
  ],
  get_robot_state: [{}],
  move_set_target: [
    { head_pitch: 0, head_yaw: 0, duration: 1.0 },
    { head_pitch: -45, head_yaw: -60, duration: 0.1 }, // min edges
    { head_pitch: 45, head_yaw: 60, duration: 10.0 }, // max edges
  ],
  play_emotion: [
    { emotion: 'welcoming1' },
  ],
  play_dance: [
    { dance: 'simple_nod' },
  ],
  play_move: [
    { dataset: 'pollen-robotics/reachy-mini-dances-library', move: 'simple_nod' },
    { dataset: 'pollen-robotics/reachy-mini-emotions-library', move: 'welcoming1' },
  ],
  list_moves: [
    { dataset: 'pollen-robotics/reachy-mini-dances-library' },
  ],
};
