import * as cp from 'child_process';
import * as vscode from 'vscode';
import { ErrFriendlyResponse } from './types';

export class ErrFriendly {
    private outputChannel: vscode.OutputChannel;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel("ErrFriendly");
    }

    private getPythonPath(): string {
        const config = vscode.workspace.getConfiguration('errfriendly');
        const configPath = config.get<string>('pythonPath');
        if (configPath) {
            return configPath;
        }

        // Try to get from Python extension
        const pythonExtension = vscode.extensions.getExtension('ms-python.python');
        if (pythonExtension) {
            // This is a naive way, usually you'd iterate APIs, but for MVP we use 'python' or config.
            // Accessing python extension API is complex and async.
            // Fallback to simply 'python'
        }

        return 'python';
    }

    public async explain(errorMessage: string): Promise<ErrFriendlyResponse | null> {
        const pythonPath = this.getPythonPath();

        return new Promise((resolve) => {
            const child = cp.spawn(pythonPath, ['-m', 'errfriendly', '--json', errorMessage]);

            let stdout = '';
            let stderr = '';

            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('error', (err) => {
                this.outputChannel.appendLine(`Failed to spawn python: ${err.message}`);
                vscode.window.showErrorMessage(`ErrFriendly: Could not run python. Is it installed?`);
                resolve(null);
            });

            child.on('close', (code) => {
                if (code !== 0) {
                    // Check if module not found
                    if (stderr.includes("No module named errfriendly")) {
                        vscode.window.showWarningMessage(
                            "ErrFriendly module not found. Please run `pip install errfriendly`.",
                            "Copy Install Command"
                        ).then(selection => {
                            if (selection === "Copy Install Command") {
                                vscode.env.clipboard.writeText("pip install errfriendly");
                            }
                        });
                        resolve(null);
                        return;
                    }

                    this.outputChannel.appendLine(`Process exited with code ${code}`);
                    this.outputChannel.appendLine(`Stderr: ${stderr}`);
                    resolve(null);
                    return;
                }

                try {
                    const response = JSON.parse(stdout) as ErrFriendlyResponse;
                    resolve(response);
                } catch (e) {
                    this.outputChannel.appendLine(`Failed to parse JSON: ${e}`);
                    this.outputChannel.appendLine(`Stdout was: ${stdout}`);
                    resolve(null);
                }
            });
        });
    }
}
