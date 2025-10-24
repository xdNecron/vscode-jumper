// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { text } from 'stream/consumers';
import * as vscode from 'vscode';

type KeyMap = Map<number, string>;


const highlightColor: vscode.ThemeColor = new vscode.ThemeColor("jumper.highlightColor");
const defaultColor: vscode.ThemeColor = new vscode.ThemeColor("jumper.defaultColor");
const dimTextColor: vscode.ThemeColor = new vscode.ThemeColor("jumper.dimTextColor");


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

	let keyMap: KeyMap = new Map();

	keyMap.set(1, "a");
	keyMap.set(2, "s");
	keyMap.set(3, "d");
	keyMap.set(4, "f");
	keyMap.set(5, "g");
	keyMap.set(6, "h");
	keyMap.set(7, "j");
	keyMap.set(8, "k");
	keyMap.set(9, "l");

	return keyMap;
}


function mapToKeys(map: number): string {

	let keys: string = "";
	let keyMap: KeyMap = getKeyMap();
	let exp: number = 0;

	while (Math.floor(map / 10**exp)) {
		let val: number = Math.floor(map / 10**exp) % 10;
		let key = keyMap.get(val) as string;
		keys = `${keys}${key}`;
		exp += 1;
	}

	return keys;
}


function getRangeOfActiveItem(value: string, ranges: vscode.Range[]): vscode.Range[] {
	const indexRegexp = /\.\d+$/;
	const foundRange = value.match(indexRegexp);

	if (foundRange) {
		let jumpIndex: number = Number(foundRange[0].replace(".", ""));

		if (jumpIndex > ranges.length) {
			jumpIndex = ranges.length;
		}

		return ranges.slice(jumpIndex - 1, jumpIndex);

	} else {
		return ranges.slice(0, 1);
	}

}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated


	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const searchBuffer = vscode.commands.registerCommand('jumper.searchBuffer', () => {

		// // * TESTING
		// let test: number = getKeyMask(80);
		// console.log(test);

		// console.log(mapToKeys(test));

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

		const inputBox: vscode.InputBox = vscode.window.createInputBox();
		inputBox.show();

		let prompt: string;
		let ranges: vscode.Range[] = [];
		let lastAvailableRange: vscode.Range[] | undefined;

		const decorationNormal: any = vscode.window.createTextEditorDecorationType(
			{
				color: highlightColor,
			}
		);

		const decorationSelected: any = vscode.window.createTextEditorDecorationType(
			{
				color: defaultColor,
				fontWeight: "800",
				textDecoration: "underline"
			}
		);

		const textDimDec: vscode.TextEditorDecorationType = vscode.window.createTextEditorDecorationType({
			color: dimTextColor
		});

		editor.setDecorations(textDimDec, editor.visibleRanges);

		inputBox.onDidChangeValue(value => {
			ranges = [];
			prompt = value;
			
			if (prompt) {

				let promptText: string[] = prompt.split(".");
				let searchValue = promptText[0];

				let allMatches: RegExpExecArray[] = [];

				if (searchValue !== "") {
					allMatches = [...editor_text.matchAll(new RegExp(searchValue, "gmi"))];
				} 				

				allMatches.forEach((match, index) => {

					let startPos = editor.document.positionAt(match.index);
					let endPos = editor.document.positionAt(match.index + match[0].length);

					const resultRange = new vscode.Range(startPos, endPos);

					if (editor.visibleRanges[0].contains(resultRange)) {
						ranges.push(new vscode.Range(startPos, endPos));
					}

				});

				let selectedItemArray: vscode.Range[] = getRangeOfActiveItem(prompt, ranges);
				let selectedItem = selectedItemArray[0];

				let tempRanges = ranges.filter((range) => range !== selectedItem);

				const normalDecorations: vscode.DecorationOptions[] = [];

				for (const range of tempRanges) {
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

				editor.setDecorations(decorationNormal, normalDecorations);
				editor.setDecorations(decorationSelected, selectedItemArray);

				editor.setDecorations(textDimDec, editor.visibleRanges);
			} else {

				let positionZero = new vscode.Position(0, 0);
				editor.selection = new vscode.Selection(positionZero, positionZero);

				lastAvailableRange = undefined;

				editor.setDecorations(decorationNormal, []);
				editor.setDecorations(decorationSelected, []);
			}

		});

		inputBox.onDidAccept(event => {
			inputBox.hide();

			if (!ranges && originalCursorPos) {
				editor.selection = new vscode.Selection(originalCursorPos, originalCursorPos);
				return;
			}

			let jumpItem: vscode.Range = getRangeOfActiveItem(inputBox.value, ranges)[0];
			editor.selection = new vscode.Selection(jumpItem.start, jumpItem.start);
			lastAvailableRange = undefined;

			editor.setDecorations(textDimDec, []);
			editor.setDecorations(decorationNormal, []);
			editor.setDecorations(decorationSelected, []);

		});

		inputBox.onDidHide(event => {

			lastAvailableRange = undefined;

			editor.setDecorations(textDimDec, []);
			editor.setDecorations(decorationNormal, []);
			editor.setDecorations(decorationSelected, []);

		});

	});

	context.subscriptions.push(searchBuffer);

}

// This method is called when your extension is deactivated
export function deactivate() {}