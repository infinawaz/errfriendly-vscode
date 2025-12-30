# ErrFriendly VS Code Extension

**ErrFriendly** connects your editor to the [errfriendly](https://pypi.org/project/errfriendly/) Python library, turning cryptic traceback errors into clear, friendly, and actionable explanations.

## Features

![ErrFriendly Usage Demo](https://raw.githubusercontent.com/yourusername/errfriendly-vscode/main/images/demo.gif)

- **Friendly Explanations**: Hover over Python errors to see a human-readable explanation and suggested fixes.
- **Commands**: 
    - `ErrFriendly: Explain Current Error` (from selection)
    - `ErrFriendly: Explain Last Exception`
- **Auto-Explain Mode**: (Optional) Automatically suggests explanations for errors.
- **Confidence Scores**: Shows how confident the model is in the explanation.

## Requirements

You must have Python installed and the `errfriendly` package installed:

```bash
pip install errfriendly
```

## Configuration

| Setting | Description | Default |
| :--- | :--- | :--- |
| `errfriendly.pythonPath` | Path to the Python interpreter (e.g. `python`, `python3`, or absolute path). | `python` |
| `errfriendly.autoExplain` | Enable/Disable automatic error analysis suggestions. | `true` |

## Troubleshooting

- **"ErrFriendly module not found"**: Run `pip install errfriendly` in your terminal.
- **"Could not run python"**: Make sure Python is in your PATH or configure `errfriendly.pythonPath`.

## License

MIT
