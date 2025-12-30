import * as vscode from 'vscode';
import { ErrFriendly } from './errfriendly';

export function registerDiagnosticsListener(context: vscode.ExtensionContext, errFriendly: ErrFriendly) {
    // Listen for diagnostics changes
    // This handles "Auto Explain" mode.
    // Ideally we don't popup notifications for every error as user types.
    // We should debouce or only show on save?
    // Requirement: "When enabled: Automatically explains errors when they appear. Does NOT spam (rate-limited)"

    let timeout: NodeJS.Timeout | undefined = undefined;

    context.subscriptions.push(
        vscode.languages.onDidChangeDiagnostics(e => {
            const config = vscode.workspace.getConfiguration('errfriendly');
            if (!config.get<boolean>('autoExplain')) { return; }

            // Just check active editor to avoid background noise?
            const editor = vscode.window.activeTextEditor;
            if (!editor) { return; }

            const uri = editor.document.uri;
            if (!e.uris.some(u => u.toString() === uri.toString())) {
                return;
            }

            const diagnostics = vscode.languages.getDiagnostics(uri);
            const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error);

            if (errors.length === 0) { return; }

            // Debounce
            if (timeout) { clearTimeout(timeout); }
            timeout = setTimeout(async () => {
                // Just take the first error for now to avoid spam
                const error = errors[0];
                // We shouldn't interrupt the user with a modal or focus steal.
                // Just logging or maybe updating a status bar item?
                // Requirement said "Problems panel enhancements" - we can't easily modify problems panel.
                // "VS Code notifications (non-intrusive)"

                // Let's use a subtle notification with "Analyze" action?
                // Or if we are really bold, we fetch it and show it?

                // If we invoke `errfriendly` automatically, we might be running python process a lot.
                // Let's implement a rudimentary rate limiter by simply checking if we recently explained this same error?
                // For MVP, let's just Log it to output for now, or maybe show an info message with a button.

                // const response = await errFriendly.explain(error.message);
                // if (response) { ... }

                // Let's stick to on-demand mainly, but for auto-explain, maybe just a status bar message?
                const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
                item.text = "$(bug) Explain Error";
                item.command = "errfriendly.explainCurrent";
                item.tooltip = "Click to explain the current error with ErrFriendly";
                item.show();

                // Auto-hide after some time
                setTimeout(() => item.dispose(), 10000);

            }, 2000); // Wait 2 seconds of no diagnostic changes
        })
    );
}
