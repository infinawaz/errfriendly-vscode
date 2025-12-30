import * as vscode from 'vscode';
import { ErrFriendly } from './errfriendly';
import { registerCommands } from './commands';
import { registerHoverProvider } from './hoverProvider';
import { registerDiagnosticsListener } from './diagnostics';

export function activate(context: vscode.ExtensionContext) {
    console.log('ErrFriendly is now active!');

    const errFriendly = new ErrFriendly();

    // Register all features
    registerCommands(context, errFriendly);
    registerHoverProvider(context, errFriendly);
    registerDiagnosticsListener(context, errFriendly);
}

export function deactivate() { }
