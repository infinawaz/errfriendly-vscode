import * as vscode from 'vscode';
import { ErrFriendly } from './errfriendly';
import { formatExplanation } from './formatter';

export function registerHoverProvider(context: vscode.ExtensionContext, errFriendly: ErrFriendly) {
    context.subscriptions.push(
        vscode.languages.registerHoverProvider('python', {
            provideHover: async (document, position, token) => {
                // Check for diagnostics at this range
                const diagnostics = vscode.languages.getDiagnostics(document.uri);
                const rangeDiagnostics = diagnostics.filter(d => d.range.contains(position) && d.severity === vscode.DiagnosticSeverity.Error);

                if (rangeDiagnostics.length === 0) { return null; }

                const errorMsg = rangeDiagnostics[0].message;

                // We should probably cache this or it will be slow on every hover?
                // For MVP, let's try to just fetch it.
                // NOTE: Hover provider should be fast. Invoking python process might be too slow for "instant" hover.
                // Ideally, we should trigger explanation async and update hover?
                // VS Code allows returning a promise.

                const response = await errFriendly.explain(errorMsg);
                if (!response) { return null; }

                const markdown = new vscode.MarkdownString(formatExplanation(response));
                return new vscode.Hover(markdown);
            }
        })
    );
}
