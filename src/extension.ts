// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "avy-vscode" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const searchBuffer = vscode.commands.registerCommand('avy-vscode.searchBuffer', () => {

		const input_box: vscode.InputBox = vscode.window.createInputBox();
		input_box.show();

		let search_value;
		const editor = vscode.window.activeTextEditor;
		const editor_text = editor?.document.getText();

		console.log(editor_text);

		input_box.onDidChangeValue(value => {
			search_value = value;
			console.log(value);
			
			try {
				if (search_value) {
					const allMatches = [...editor_text.matchAll(new RegExp(search_value, "gm"))];
					console.log(allMatches);
				}
			} catch (error) {
				console.error("Error has occured", error);
			}
		});


		vscode.window.showInformationMessage('Hello World from Avy for VS Code!');
	});

	context.subscriptions.push(searchBuffer);
}

// This method is called when your extension is deactivated
export function deactivate() {}
