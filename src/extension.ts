// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "avy-vscode" is now active!');


	// TODO Create text decoration
	const decoration = vscode.window.createTextEditorDecorationType(
		{
			borderColor: "red",
			borderWidth: "2px",
			fontWeight: "800",
			color: "pink"
		}
	);

	// TODO figure out how to reset decoration 
	// TODO deselect all on empty value

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
			
			try {
				if (search_value) {

					let foundSelections: vscode.Selection[] = [];

					const allMatches = [...editor_text.matchAll(new RegExp(search_value, "gm"))];
					console.log(allMatches);

					let ranges: vscode.Range[] = [];
					
					allMatches.forEach((match, index) => {
						let startPos = editor.document.positionAt(match.index);
						let endPos = editor.document.positionAt(match.index + match[0].length);
						foundSelections[index] = new vscode.Selection(startPos, endPos);
						ranges.push(new vscode.Range(startPos, endPos));
					});

					editor.selections = foundSelections;
					editor.setDecorations(decoration, ranges);	

				} else {
					let position_zero = new vscode.Position(0, 0);
					editor.selection = new vscode.Selection(position_zero, position_zero);
				}
			} catch (error) {
				console.error("Error has occured", error);
			}
		});

		input_box.onDidAccept(event => {
			console.log("jupi");
			input_box.hide();
		});

		vscode.window.showInformationMessage("Tvoje Mamka");


	});

	context.subscriptions.push(searchBuffer);
}

// This method is called when your extension is deactivated
export function deactivate() {}
