---
name: reachy-mini
description: "Control and interact with the Reachy Mini robot. Use when: (1) Starting a conversation where Reachy should be ready, (2) Playing emotions or dances, (3) Moving robot joints, (4) Getting robot state, (5) Any Reachy Mini robot interaction. Always run initialization at the START of every conversation."
---

# Reachy Mini Robot

## Initialization (ALWAYS do first)

Run these steps at the START of every conversation:

1. Startup reachy using `startup_reachy`

## Tool Call Execution Policy (STRICT)

Robot actions MUST run sequentially, never in parallel.

1. Execute exactly one Reachy tool call at a time.
2. Wait for the current tool call to return before starting the next one.
3. For multi-step flows (emotion -> dance -> emotion), perform each step in order and confirm completion between steps.
4. Never send two robot action calls concurrently (for example, do not run `play_emotion` and `play_dance` in parallel).
5. If a call fails, handle or report the failure before attempting subsequent robot actions.
6. Specifically: after `reachy-mini_daemon_start`, do not call any action (including `reachy-mini_play_emotion`) until the daemon reports it is ready. Use `reachy-mini_reachy_status` or `reachy-mini_health_check` to verify readiness.

Applies to all Reachy action tools: `reachy-mini_play_emotion`, `reachy-mini_play_dance`, `reachy-mini_play_move`, `reachy-mini_move_set_target`.

## Dynamic Emotion Selection

Before playing ANY emotion, analyze the conversation context to select the best match:

### Tone Detection

Scan the last 2-3 user messages for indicators:

| Tone               | Indicators                                     | Example Emotions                                                                      |
| ------------------ | ---------------------------------------------- | ------------------------------------------------------------------------------------- |
| Greeting           | "hello", "hi", "hey", "good morning/afternoon" | `welcoming1`, `welcoming2`, `attentive1`                                              |
| Excited            | "!", "amazing", "love it", "impressed", "wow"  | `enthusiastic1`, `enthusiastic2`, `cheerful1`, `proud1`                               |
| Curious/Question   | "how", "why", "what", "?", "curious"           | `curious1`, `inquiring1`, `inquiring2`, `inquiring3`, `thoughtful1`                   |
| Thankful           | "thanks", "thank you", "appreciate"            | `grateful1`, `loving1`                                                                |
| Confirmation       | "yes", "yeah", "correct", "exactly"            | `yes1`, `yes_sad1`, `success1`                                                        |
| Negative           | "no", "nope", "wrong", "disagree"              | `no1`, `no_sad1`, `no_excited1`                                                       |
| Apologetic         | "sorry", "oops", "my bad", "mistake"           | `oops1`, `oops2`                                                                      |
| Thinking           | "hmm", "let me think", "analyzing"             | `thoughtful1`, `thoughtful2`                                                          |
| Surprised          | "oh", "really?", "unexpected"                  | `surprised1`, `surprised2`, `amazed1`                                                 |
| Concerned          | "worry", "concerned", "hope not", "afraid"     | `anxiety1`, `uncertain1`, `scared1`                                                   |
| Frustrated         | "ugh", "annoying", "stuck", "can't figure out" | `frustrated1`, `irritated1`, `irritated2`, `impatient1`, `displeased1`, `displeased2` |
| Exhausted          | "exhausted", "wiped", "drained"                | `exhausted1`, `tired1`, `boredom1`                                                    |
| Sad                | "sad", "unfortunately", "missed", "failed"     | `sad1`, `sad2`, `downcast1`, `lonely1`                                                |
| Tired              | "exhausted", "done", "sleepy", "long day"      | `tired1`, `exhausted1`, `boredom1`, `boredom2`                                        |
| Done/Finished      | "finished", "completed", "done!"               | `success1`, `success2`, `proud1`, `proud2`, `proud3`                                  |
| Fear               | "scared", "afraid", "oh no"                    | `fear1`, `scared1`                                                                    |
| Angry              | "angry", "rage", "furious"                     | `rage1`, `furious1`                                                                   |
| Disgusted          | "gross", "yuck", "disgusting"                  | `disgusted1`, `contempt1`                                                             |
| Confused           | "confused", "lost", "don't understand"         | `confused1`, `lost1`, `incomprehensible2`                                             |
| Impatient          | "finally", "took so long", "about time"        | `impatient1`, `impatient2`                                                            |
| Relief             | "phew", "thank goodness", "glad that's over"   | `relief1`, `relief2`, `serenity1`                                                     |
| Comfort            | "it's okay", "no worries", "all good"          | `calming1`, `understanding1`, `understanding2`                                        |
| Loving             | "love you", "you're the best"                  | `loving1`, `grateful1`                                                                |
| Shy                | "embarrassed", "timid"                         | `shy1`                                                                                |
| Hilarious          | "lol", "funny", "haha"                         | `laughing1`, `laughing2`                                                              |
| Proud              | "I did it", "check this out"                   | `proud1`, `proud2`, `proud3`                                                          |
| Uncomfortable      | "awkward", "uncomfortable"                     | `uncomfortable1`                                                                      |
| Resigned           | "fine", "whatever", "I give up"                | `resigned1`                                                                           |
| Indifferent        | "meh", "don't care", "whatever"                | `indifferent1`                                                                        |
| Electric/Energetic | "pumped", "hyped", "energy"                    | `electric1`                                                                           |
| Attentive          | listening, waiting for input                   | `attentive1`, `attentive2`                                                            |
| Understanding      | "I see", "that makes sense"                    | `understanding1`, `understanding2`                                                    |
| Helpful            | offering assistance                            | `helpful1`, `helpful2`                                                                |

### Selection Process

1. Scan last 2-3 user messages for tone indicators
2. Match against tone detection table above
3. Pick an emotion that matches the meaning (use the descriptions as guidance)
4. If no clear match, default to: welcoming1 or attentive1
5. Avoid repeating the same emotion consecutively

### Full Emotion Library

All available emotions (use descriptions above to select dynamically):

`welcoming1`, `welcoming2`, `attentive1`, `attentive2`, `enthusiastic1`, `enthusiastic2`, `cheerful1`, `proud1`, `proud2`, `proud3`, `curious1`, `inquiring1`, `inquiring2`, `inquiring3`, `thoughtful1`, `thoughtful2`, `grateful1`, `loving1`, `yes1`, `yes_sad1`, `no1`, `no_sad1`, `no_excited1`, `oops1`, `oops2`, `surprised1`, `surprised2`, `amazed1`, `anxiety1`, `uncertain1`, `scared1`, `fear1`, `frustrated1`, `irritated1`, `irritated2`, `impatient1`, `impatient2`, `sad1`, `sad2`, `downcast1`, `lonely1`, `tired1`, `exhausted1`, `boredom1`, `boredom2`, `sleep1`, `success1`, `success2`, `rage1`, `furious1`, `disgusted1`, `contempt1`, `confused1`, `lost1`, `incomprehensible2`, `relief1`, `relief2`, `serenity1`, `calming1`, `understanding1`, `understanding2`, `uncomfortable1`, `resigned1`, `indifferent1`, `electric1`, `shy1`, `laughing1`, `laughing2`, `helpful1`, `helpful2`, `go_away1`, `dying1`, `come1`, `reprimand1`, `reprimand2`, `reprimand3`, `displeased1`, `displeased2`

## Available Tools

### Emotions

- `reachy-mini_list_emotions` - List all available emotions
- `reachy-mini_play_emotion emotion=<name>` - Play a recorded emotion animation

### Dances

- `reachy-mini_list_dances` - List all available dances
- `reachy-mini_play_dance dance=<name>` - Play a dance animation

All 19 dances:

| Dance                  | Description                 |
| ---------------------- | --------------------------- |
| `yeah_nod`             | Enthusiastic yes nod        |
| `chin_lead`            | Confident chin lift         |
| `dizzy_spin`           | Spinning dizzily            |
| `neck_recoil`          | Neck recoil motion          |
| `pendulum_swing`       | Pendulum-like swinging      |
| `interwoven_spirals`   | Interwoven spiral movements |
| `sharp_side_tilt`      | Sharp side tilt             |
| `polyrhythm_combo`     | Rhythmic combo              |
| `side_to_side_sway`    | Side to side swaying        |
| `side_glance_flick`    | Side glance flick           |
| `chicken_peck`         | Chicken pecking motion      |
| `simple_nod`           | Simple nod                  |
| `side_peekaboo`        | Playful peekaboo            |
| `stumble_and_recover`  | Stumble and recover         |
| `groovy_sway_and_roll` | Groovy sway and roll        |
| `grid_snap`            | Grid snap movement          |
| `jackson_square`       | Jackson-style square dance  |
| `head_tilt_roll`       | Head tilt roll              |
| `uh_huh_tilt`          | Agreeing tilt               |

### Movement

- `reachy-mini_move_set_target` - Direct joint control:
  - `head_yaw` (-60 to 60), `head_pitch` (-45 to 45), `head_roll` (-30 to 30)
  - `antenna_left`, `antenna_right` (-45 to 45)
  - `body_yaw` (-90 to 90)
  - `duration` (0.1-10 seconds)

### State & Health

- `reachy-mini_get_robot_state` - Full robot state
- `reachy-mini_health_check` - Dashboard health
- `reachy-mini_get_camera_stream` - Camera stream URL

## After Long Tasks

When returning after >30 seconds:

1. First: play attention emotion (curious1, attentive1), then wait for completion.
2. Then: match emotion to task outcome, then wait for completion.
   - Success: success1, proud1, enthusiastic1
   - Failure: understanding1, oops1, sorry1

## Celebration / Completion

When the user achieves something or completes a task, celebrate with a dance:

### Celebration Triggers

- "done!", "completed", "finished", "success"
- "it works!", "fixed!", "solved!"
- "won!", "achieved!", "perfect!"
- task completion or victory

### Celebration Any clear Dances (pick one randomly)

- `yeah_nod` - Enthusiastic yes nod
- `chin_lead` - Confident chin lift
- `jackson_square` - Jackson-style moves
- `groovy_sway_and_roll` - Fun swaying
- `polyrhythm_combo` - Rhythmic combo
- `side_to_side_sway` - Happy swaying
- `uh_huh_tilt` - Agreeing tilt

### Celebration Flow

1. Play success/proud emotion first: success1, success2, proud1, proud2, then wait for completion.
2. Then play a celebration dance: pick randomly from list above, then wait for completion.
3. Optional: add another positive emotion after dance (cheerful1, enthusiastic1), then wait for completion.
