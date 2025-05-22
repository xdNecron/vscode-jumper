// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const searchBuffer = vscode.commands.registerCommand('jumper.searchBuffer', () => {


		function getRangeOfActiveItem(value: string) {

			const index_regexp = /\.\d+$/;
			const found_range = value.match(index_regexp);

			if (found_range) {

				let jump_index: number = Number(found_range[0].replace(".", ""));

				if (jump_index > ranges.length) {

					jump_index = ranges.length;

				}

				last_available_range = ranges.slice(jump_index - 1, jump_index);

				return ranges.slice(jump_index - 1, jump_index);

			} else {

				return ranges.slice(0, 1);

			}

		}
		
		const editor = vscode.window.activeTextEditor;
		
		const originalCursorPos: vscode.Position | undefined = editor?.selection.active;

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

		let prompt: string;

		let decoration_normal: any;

		let decoration_selected: any;

		let ranges: vscode.Range[] = [];

		let selected_item: vscode.Range;

		let last_available_range: vscode.Range[] | undefined;


		input_box.onDidChangeValue(value => {

			ranges = [];

			prompt = value;

			if (!decoration_normal) {

				decoration_normal = vscode.window.createTextEditorDecorationType(
					{
						backgroundColor: "pink",
						fontWeight: "800",
						color: "#FF1493"
					}
				);

			}

			if (!decoration_selected) {

				decoration_selected = vscode.window.createTextEditorDecorationType(
					{
						backgroundColor: "#FF1493",
						fontWeight: "800",
						color: "pink"
					}
				);

			}
			
			try {
				if (prompt) {

					let prompt_text: string[] = prompt.split(".");
					let search_value = prompt_text[0];

					let allMatches: RegExpExecArray[];

					if (search_value !== "") {
						allMatches = [...editor_text.matchAll(new RegExp(search_value, "gmi"))];
					} else {
						allMatches = [];
					}
					
					allMatches.forEach((match, index) => {

						let startPos = editor.document.positionAt(match.index);
						let endPos = editor.document.positionAt(match.index + match[0].length);

						const result_range = new vscode.Range(startPos, endPos);

						if (editor.visibleRanges[0].contains(result_range)) {
							ranges.push(new vscode.Range(startPos, endPos));
						}

					});

					let selected_item_array: vscode.Range[] = getRangeOfActiveItem(prompt);
					let selected_item = selected_item_array[0];

					let temp_ranges = ranges.filter((range) => range !== selected_item);

					const normalDecorations: vscode.DecorationOptions[] = [];

					for (const range of temp_ranges) {
						console.log(search_value, range);
						const decorationInstance: vscode.DecorationOptions = {
							range: range,
							renderOptions: {
								before: {
									backgroundColor: "red",
									color: "white",
									contentText: `${ranges.indexOf(range) + 1}`
								}
							}
						};
						normalDecorations.push(decorationInstance);
					}

					editor.setDecorations(decoration_normal, normalDecorations);

					editor.setDecorations(decoration_selected, selected_item_array);

				} else {

					let position_zero = new vscode.Position(0, 0);
					editor.selection = new vscode.Selection(position_zero, position_zero);

					last_available_range = undefined;

					decoration_normal.dispose();
					decoration_normal = undefined;
					
					decoration_selected.dispose();
					decoration_selected = undefined;

				}

			} catch (error) {
				
				console.error("Error has occured", error);

			}
		});

		input_box.onDidAccept(event => {

			input_box.hide();

			if (!ranges && originalCursorPos) {
				editor.selection = new vscode.Selection(originalCursorPos, originalCursorPos);
				return;
			}

			let jump_item: vscode.Range = getRangeOfActiveItem(input_box.value)[0];

			editor.selection = new vscode.Selection(jump_item.start, jump_item.start);

			last_available_range = undefined;

			decoration_normal.dispose();
			decoration_normal = undefined;
			
			decoration_selected.dispose();
			decoration_selected = undefined;

		});

		input_box.onDidHide(event => {

			last_available_range = undefined;

			decoration_normal.dispose();
			decoration_normal = undefined;

			decoration_selected.dispose();
			decoration_selected = undefined;

		});

	});

	context.subscriptions.push(searchBuffer);

}

// This method is called when your extension is deactivated
export function deactivate() {}
