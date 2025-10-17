// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { text } from 'stream/consumers';
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	type KeyMap = Map<number, string>;

	function getKeyMask(index: number): number {
		// converts zero-based index to key mask, works for (index < 81)

		if (index >= 81) {
			return -1;
		}

		let exp: number = 0;
		let res: number = 0;
		let init: number = index;

		while (index !== 0) {
			res += (index % 9) * 10**exp;
			index = Math.floor(index / 9);
			exp += 1;
		}

		return res + 1;

	}

	function getKeyMap(): KeyMap {

		let key_map: KeyMap = new Map();

		key_map.set(1, "a");
		key_map.set(2, "s");
		key_map.set(3, "d");
		key_map.set(4, "f");
		key_map.set(5, "g");
		key_map.set(6, "h");
		key_map.set(7, "j");
		key_map.set(8, "k");
		key_map.set(9, "l");

		return key_map;
	}

	function mapToKeys(map: number): string {

		let keys: string = "";
		let key_map: KeyMap = getKeyMap();
		let exp: number = 0;

		while (Math.floor(map / 10**exp)) {
			let val: number = Math.floor(map / 10**exp) % 10;
			let key = key_map.get(val) as string;
			keys = `${keys}${key}`;
			exp += 1;
		}

		return keys;
	}

	function getRangeOfActiveItem(value: string, ranges: vscode.Range[]): vscode.Range[] {
		const index_regexp = /\.\d+$/;
		const found_range = value.match(index_regexp);

		if (found_range) {
			let jump_index: number = Number(found_range[0].replace(".", ""));

			if (jump_index > ranges.length) {
				jump_index = ranges.length;
			}

			return ranges.slice(jump_index - 1, jump_index);

		} else {
			return ranges.slice(0, 1);
		}

	}

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const searchBuffer = vscode.commands.registerCommand('jumper.searchBuffer', () => {

		// * TESTING
		let test: number = getKeyMask(80);
		console.log(test);

		console.log(mapToKeys(test));

		const editor = vscode.window.activeTextEditor;
		const originalCursorPos: vscode.Position | undefined = editor?.selection.active;
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
		let ranges: vscode.Range[] = [];
		let last_available_range: vscode.Range[] | undefined;
		const decoration_normal: any = vscode.window.createTextEditorDecorationType(
			{
				color: "#FF1493",
				backgroundColor: "pink",
				fontWeight: "800"
			}
		);
		const decoration_selected: any = vscode.window.createTextEditorDecorationType(
			{
				color: "pink",
				backgroundColor: "#FF1493",
				fontWeight: "800",
			}
		);
		const textDimDec: vscode.TextEditorDecorationType = vscode.window.createTextEditorDecorationType({
			color: "gray"
		});

		editor.setDecorations(textDimDec, editor.visibleRanges);

		input_box.onDidChangeValue(value => {
			ranges = [];
			prompt = value;
			
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

					let selected_item_array: vscode.Range[] = getRangeOfActiveItem(prompt, ranges);
					let selected_item = selected_item_array[0];

					let temp_ranges = ranges.filter((range) => range !== selected_item);

					const normalDecorations: vscode.DecorationOptions[] = [];

					for (const range of temp_ranges) {
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

					editor.setDecorations(textDimDec, []);

					editor.setDecorations(decoration_normal, normalDecorations);
					editor.setDecorations(decoration_selected, selected_item_array);

					editor.setDecorations(textDimDec, editor.visibleRanges);

				} else {

					let position_zero = new vscode.Position(0, 0);
					editor.selection = new vscode.Selection(position_zero, position_zero);

					last_available_range = undefined;

					editor.setDecorations(decoration_normal, []);
					editor.setDecorations(decoration_selected, []);

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

			let jump_item: vscode.Range = getRangeOfActiveItem(input_box.value, ranges)[0];
			editor.selection = new vscode.Selection(jump_item.start, jump_item.start);
			last_available_range = undefined;
			editor.setDecorations(textDimDec, []);

			editor.setDecorations(decoration_normal, []);
			editor.setDecorations(decoration_selected, []);

		});

		input_box.onDidHide(event => {

			last_available_range = undefined;

			editor.setDecorations(textDimDec, []);

			editor.setDecorations(decoration_normal, []);
			editor.setDecorations(decoration_selected, []);

		});

	});

	context.subscriptions.push(searchBuffer);

}

// This method is called when your extension is deactivated
export function deactivate() {}
