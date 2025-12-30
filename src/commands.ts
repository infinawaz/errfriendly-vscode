import * as vscode from 'vscode';
import { ErrFriendly } from './errfriendly';
import { formatExplanation } from './formatter';

export function registerCommands(context: vscode.ExtensionContext, errFriendly: ErrFriendly) {
    context.subscriptions.push(
        vscode.commands.registerCommand('errfriendly.explainCurrent', async () => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) { return; }

            const selection = editor.selection;
            const text = editor.document.getText(selection);

            if (!text) {
                vscode.window.showInformationMessage("Please select an error message or traceback to explain.");
                return;
            }

            await explainAndShow(text, errFriendly);
        }),

        vscode.commands.registerCommand('errfriendly.explainLast', async () => {
            // This is tricky without a debug adapter hook.
            // For MVP, we might need to rely on what is in the terminal or output?
            // Or maybe just show a prompt saying this feature requires active debug session integration (which is complex).
            // Let's defer "Explain Last" real implementation or just ask user for input.
            vscode.window.showInputBox({
                prompt: "Paste the error message or traceback you want to explain"
            }).then(input => {
                if (input) {
                    explainAndShow(input, errFriendly);
                }
            });
        }),

        vscode.commands.registerCommand('errfriendly.toggleAutoExplain', () => {
            const config = vscode.workspace.getConfiguration('errfriendly');
            const currentValue = config.get<boolean>('autoExplain');
            config.update('autoExplain', !currentValue, vscode.ConfigurationTarget.Global);
            vscode.window.showInformationMessage(`ErrFriendly Auto-Explain is now ${!currentValue ? 'ON' : 'OFF'}`);
        })
    );
}

async function explainAndShow(text: string, errFriendly: ErrFriendly) {
    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "ErrFriendly: Analyzing error...",
        cancellable: false
    }, async () => {
        const response = await errFriendly.explain(text);
        if (response) {
            // Show in a markdown preview or notification?
            // Notification is too small for long text.
            // Use a webview panel or just a simple output channel?
            // Requirement says: "Provide explanations via: ... Problems panel enhancements, VS Code notifications"
            // But for explicit commands, a separate panel is nice. 
            // Let's use a simple untitled document or "Peek" style?
            // Actually, a simple method is to show it in a new editor with markdown content.

            const doc = await vscode.workspace.openTextDocument({
                content: formatExplanation(response),
                language: 'markdown'
            });
            await vscode.window.showTextDocument(doc, { preview: true, viewColumn: vscode.ViewColumn.Beside });
        }
    });
}
