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

## Opencode Integration

The MCP server can be configured in your AI compagnion's configuration:

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

## AI Agent Integration

Reachy Mini makes an excellent expressive companion for AI agents. Here's how to integrate it:

Add this to your `AGENTS.md` (or other applicable file for your AI companion) to make the agent express emotions:

```
### Reachy Mini Robot

IMPORTANT: When this file is read, first check if Reachy is running by calling `reachy-mini_daemon_status`. If not running, start it with `reachy-mini_daemon_start`.

IMPORTANT: Play an appropriate emotion on Reachy BEFORE responding to the user. Use the `reachy-mini_play_emotion` tool first, then respond.

For example:

- If agreeing/entertained → play "cheerful1", "welcoming1" → play "cheerful1"
- If questioning/curious → play "curious1" or "inquiring1"
- If apologizing/sympathetic → play "sad1" or "understanding1"
- If excited/enthusiastic → play "enthusiastic1" or "enthusiastic2"
- If thinking → play "thoughtful1" or "thoughtful2"
- If greeting → play "welcoming1" or "attentive1"

Note: The emotion MUST be played before the response, not after.

#### Returning After Being Busy

If you were away (e.g., running a long task, waiting for compilation, researching) and are now responding again:

1. Play an attention-getting emotion first: "attentive1" or "attentive2"
2. If the task took more than ~30 seconds, also add: "relief1" or "success1"
3. Then respond to the user
```

## Ideas for AI Integration

- **Emotional Feedback**: Have Reachy react to code compilations (celebrate success, show concern on errors)
- **Code Reviews**: Express curiosity when reviewing PRs, gratitude when approved
- **Notifications**: React when long-running tasks complete
- **Pair Programming**: Express excitement when solving difficult problems
- **Onboarding**: Greet new users with welcoming emotions

## Available Tools

### Health & Status

| Tool                | Description                                                 |
| ------------------- | ----------------------------------------------------------- |
| `health_check`      | Check if the Reachy Mini dashboard is responding            |
| `daemon_status`     | Get the current daemon health status                        |
| `get_robot_state`   | Get full robot state (joint positions, velocities, sensors) |
| `get_camera_stream` | Get camera stream endpoint URL                              |

### Daemon Control

| Tool           | Description                                                   |
| -------------- | ------------------------------------------------------------- |
| `daemon_start` | Start the daemon. Options: `wake_up` (boolean, default: true) |

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
- **Timeout errors**: Requests timeout after 10 seconds

## Credits

Reachy Mini is developed by [Pollen Robotics](https://www.pollen-robotics.com/) - a French robotics company founded by:

- **Matthieu Lapeyre** - Co-founder & CEO of Pollen Robotics
- **Thomas Wolf** - Co-founder of Hugging Face

Special thanks to the entire Pollen Robotics team and the Hugging Face community for making robotics accessible to everyone.

Learn more at [reachy-mini.org](https://reachy-mini.org/) or [pollen-robotics.com/reachy-mini](https://www.pollen-robotics.com/reachy-mini/).
