// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { moveCursor } from 'readline';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "avy-vscode" is now active!');

	// TODO Figure out how to display a tooltip

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const searchBuffer = vscode.commands.registerCommand('jumper.searchBuffer', () => {
		
		const editor = vscode.window.activeTextEditor;

		// ? Why do the ranges shift when I try to search only the text in visible range?
		// const editor_text = editor?.document.getText(editor.visibleRanges[0]);
		const editor_text = editor?.document.getText();

		if (!editor) { 
			vscode.window.showErrorMessage("There is no active editor to search in!");
			return 1;
		} else if (!editor_text) {
			vscode.window.showErrorMessage("Document is empty.");
			return 1;
		}

		const input_box: vscode.InputBox = vscode.window.createInputBox();
		input_box.show();

		let search_value: string;

		let decoration: any;

		let ranges: vscode.Range[] = [];

		input_box.onDidChangeValue(value => {

			ranges = [];

			search_value = value;

			if (!decoration) {
				decoration = vscode.window.createTextEditorDecorationType(
					{
						backgroundColor: "pink",
						fontWeight: "800",
						color: "#FF1493"
					}
				);
			}
			
			try {
				if (search_value) {

					let temp = search_value.split(".");
					search_value = temp[0];
					// console.log("Searching for ", search_value);

					const allMatches = [...editor_text.matchAll(new RegExp(search_value, "gmi"))];
					
					allMatches.forEach((match, index) => {
						let startPos = editor.document.positionAt(match.index);
						let endPos = editor.document.positionAt(match.index + match[0].length);

						const result_range = new vscode.Range(startPos, endPos);

						if (editor.visibleRanges[0].contains(result_range)) {
							ranges.push(new vscode.Range(startPos, endPos));
						}

					});

					editor.setDecorations(decoration, ranges);	

				} else {
					let position_zero = new vscode.Position(0, 0);
					editor.selection = new vscode.Selection(position_zero, position_zero);
					decoration.dispose();
					decoration = undefined;
				}
			} catch (error) {
				console.error("Error has occured", error);
			}
		});

		input_box.onDidAccept(event => {
			let jump_item: vscode.Range = ranges[0];
			
			const index_regexp = /\.\d+$/;
			const found_range = input_box.value.match(index_regexp);

			if (found_range) {
				let jump_index: number = Number(found_range[0].replace(".", ""));
				if (jump_index > ranges.length) {
					jump_index = ranges.length;
				}
				jump_item = ranges[jump_index - 1];
			}
			
			editor.selection = new vscode.Selection(jump_item.start, jump_item.start);
			decoration.dispose();
			decoration = undefined;
			input_box.hide();
		});

		input_box.onDidHide(event => {
			decoration.dispose();
			decoration = undefined;
		});

	});

	context.subscriptions.push(searchBuffer);
}

// This method is called when your extension is deactivated
export function deactivate() {}
