# Reachy Mini Wireless HTTP MCP Server

MCP server for controlling [Reachy Mini Wireless](https://www.pollen-robotics.com/reachy-mini/) robot via HTTP API.

## About

Reachy Mini Wireless is an open-source desktop humanoid robot developed by [Pollen Robotics](https://www.pollen-robotics.com/) in collaboration with [Hugging Face](https://huggingface.co/).

## Requirements

- Node.js 18+
- npm or yarn

## Installation

```bash
cd ~/Developer/ReachyMiniHTTPMCP
npm install
```

## Configuration

The server uses environment variables for configuration:

- `REACHY_HOST` - Robot hostname (default: `reachy-mini.home`)
- `REACHY_PORT` - Robot port (default: `8000`)

## MCP Server Integration

The MCP server can be configured in your AI companion's configuration:

```json
{
	"mcp": {
		"reachy-mini": {
			"type": "local",
			"command": [
				"node",
				"/Users/<username>/Developer/ReachyMiniHTTPMCP/src/server.js"
			],
			"enabled": true,
			"env": {
				"REACHY_HOST": "reachy-mini.home",
				"REACHY_PORT": "8000"
			}
		}
	}
}
```

## AI Agent Skill

This repo includes a skill for Reachy Mini that provides:
- Auto-initialization on conversation start
- Dynamic emotion selection based on conversation tone
- Celebration dances on task completion

### Installing the Skill

Copy or symlink the skill to your AI agent's skills directory:

```bash
# For Opencode
cp -r ~/Developer/ReachyMiniHTTPMCP/skill ~/.config/opencode/skills/reachy-mini

# For Claude CLI
cp -r ~/Developer/ReachyMiniHTTPMCP/skill ~/.claude/skills/reachy-mini

# For Claude Agents
cp -r ~/Developer/ReachyMiniHTTPMCP/skill ~/.agents/skills/reachy-mini
```

### Enabling the Skill

Add this to your agent's instructions (e.g., `AGENTS.md`, `CLAUDE.md`):

```markdown
## Reachy Mini Robot

**Load the `reachy-mini` skill at the START of every conversation.** This skill handles:
- Initialization (daemon status, starting if needed)
- Dynamic emotion selection based on conversation tone
- Celebration dances on task completion
- All robot interactions
```

Restart your AI agent to pick up the skill.

### Note about assistant behavior

- The included `reachy-mini` skill now requires the assistant to play a matching Reachy emotion before sending any textual reply to the user. The assistant must analyze recent user messages for tone, play the selected emotion, wait for it to complete, then send its reply.
- Replies must not include literal play annotations or emotion IDs such as "(plays attentive1)". If acknowledging the robot's action, use natural language (for example: "I nodded to acknowledge that — here's what I suggest.").

## Available Tools

### Health & Status

| Tool                | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `health_check`      | Check if the Reachy Mini dashboard is responding            |
| `reachy_status`     | Get the current Reachy status (daemon + backend)            |
| `get_robot_state`   | Get full robot state (joint positions, velocities, sensors) |
| `get_camera_stream` | Get camera stream endpoint URL                              |

### Daemon Control

| Tool             | Description                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `startup_reachy` | Start the daemon. Options: `wake_up` (boolean, default: true)                                                                |
| `shutdown_reachy`| Stop the daemon. By default will request robot sleep (`POST /api/daemon/stop?goto_sleep=true`).                                 |
| `verify_wake`    | Verify the robot is awake (checks `GET /api/state/full`, falls back to a safe `simple_nod` move). Returns `{ wake_verified, details }`.

### Movement Control

| Tool              | Description                                                                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `move_set_target` | Set target position for head/body. Parameters: `head_pitch`, `head_roll`, `head_yaw`, `antenna_left`, `antenna_right`, `body_yaw`, `duration` |

### Emotions (70+ available)

| Tool            | Description                                                                                                                               |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `play_emotion`  | Play a recorded emotion (e.g., 'curious1', 'amazed1', 'welcoming1', 'cheerful1', 'sad1', 'furious1', 'fear1', 'disgusted1', 'surprised1') |
| `list_emotions` | List all available emotions                                                                                                               |
| `play_dance`    | Play a recorded dance animation                                                                                                           |
| `list_dances`   | List all available dances                                                                                                                 |
| `play_move`     | Play any move from allowed datasets                                                                                                       |
| `list_moves`    | List moves in a specific dataset                                                                                                          |

## Datasets

- Emotions: `pollen-robotics/reachy-mini-emotions-library` (70+ emotions)
- Dances: `pollen-robotics/reachy-mini-dances-library` (19 dances)

## Troubleshooting

- **Backend not running**: Activate the red switch in the dashboard at http://reachy-mini.home:8000
- **Robot unreachable**: Check network connectivity and hostname resolution
 - **Timeouts**: The MCP now uses a longer HTTP timeout (60s) for slow daemon operations; if you still see timeouts, check network/daemon logs.
  - **Wake verification**: Start the daemon with `startup_reachy` (which can wake motors), then call `verify_wake`. If `verify_wake` fails the MCP will mark reachy-mini tools as disabled for the session until you run `startup_reachy` + `verify_wake` again. For basic motion you can also treat success of `get_robot_state` or `play_move` as sufficient proof of wake.

## Credits

Reachy Mini is developed by [Pollen Robotics](https://www.pollen-robotics.com/) - a French robotics company founded by:

- **Matthieu Lapeyre** - Co-founder & CEO of Pollen Robotics
- **Thomas Wolf** - Co-founder of Hugging Face

Special thanks to the entire Pollen Robotics team and the Hugging Face community for making robotics accessible to everyone.

Learn more at [reachy-mini.org](https://reachy-mini.org/) or [pollen-robotics.com/reachy-mini](https://www.pollen-robotics.com/reachy-mini/).
