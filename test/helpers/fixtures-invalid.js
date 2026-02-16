export const toolInvalidExamples = {
  move_set_target: [
    { head_pitch: 100 }, // out of range
    { duration: 0 }, // too small
  ],
  play_move: [
    { dataset: 'invalid-dataset', move: 'x' },
  ],
  play_emotion: [
    {}, // missing required emotion
  ],
  startup_reachy: [
    { wake_up: 'yes' }, // wrong type
  ],
  play_dance: [
    {}, // missing required dance
  ],
  shutdown_reachy: [
    { goto_sleep: 'maybe' }, // wrong type
  ],
  list_moves: [
    { dataset: 'not-a-real-dataset' },
  ],
};
