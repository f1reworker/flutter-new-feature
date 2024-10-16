import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { widget } from './templates/widget';
import { theme } from './templates/theme';
import { screen } from './templates/screen';
import { packageFile } from './templates/package';
import { blocState } from './templates/bloc_state';
import { blocEvent } from './templates/bloc_event';
import { bloc } from './templates/bloc';
import { component } from './templates/component';
import { modelFromJson } from './templates/model_from_json';
import { model } from './templates/model';


// Преобразование snake_case в PascalCase
function snakeToPascalCase(snake: string): string {
	return snake.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function getFeatureName(targetUri: vscode.Uri): string {
	// Подняться на два уровня выше
	const featurePath = path.join(targetUri.fsPath, '../../');
	// Получить имя каталога
	const featureName = path.basename(featurePath);
	// Преобразовать в PascalCase
	return snakeToPascalCase(featureName);
}

// Создание файла с содержимым
function createFile(filePath: string, content: string) {
	fs.writeFileSync(filePath, content);
}

function updatePackageDart(targetUri: vscode.Uri, levelsUp: number, insertAfter: string, newPart: string) {
	// Подняться на указанное количество уровней
	let packageDartPath = targetUri.fsPath;

	for (let i = 0; i < levelsUp; i++) {
		packageDartPath = path.join(packageDartPath, '..');
	}

	packageDartPath = path.join(packageDartPath, 'package.dart');

	if (!fs.existsSync(packageDartPath)) {
		vscode.window.showErrorMessage('Файл package.dart не найден!');
		return;
	}

	// Прочитать содержимое файла package.dart
	let packageDartContent = fs.readFileSync(packageDartPath, 'utf8');


	if (packageDartContent.includes(newPart)) {
		vscode.window.showInformationMessage(`part для ${newPart} уже добавлен в package.dart.`);
	} else {
		packageDartContent = packageDartContent.replace(insertAfter, `${insertAfter}\n${newPart}`);
		fs.writeFileSync(packageDartPath, packageDartContent);
		vscode.window.showInformationMessage(`part '${newPart}' успешно добавлен в package.dart.`);
	}
}

function createFeature(name: string, targetUri: vscode.Uri) {
	const snakeCaseName = name;
	const pascalCaseName = snakeToPascalCase(snakeCaseName);

	const featurePath = path.join(targetUri.fsPath, snakeCaseName);
	fs.mkdirSync(featurePath);

	// Создание необходимых каталогов
	const directories = ['bloc', 'data/model', 'screen/widgets', 'theme'];
	directories.forEach(dir => fs.mkdirSync(path.join(featurePath, dir), { recursive: true }));

	// Создание файлов в папке bloc
	createFile(path.join(featurePath, `bloc/${snakeCaseName}_bloc.dart`), bloc(pascalCaseName));

	createFile(path.join(featurePath, `bloc/${snakeCaseName}_event.dart`), blocEvent(pascalCaseName));

	createFile(path.join(featurePath, `bloc/${snakeCaseName}_state.dart`), blocState(pascalCaseName));

	// Создание файла package.dart
	createFile(path.join(featurePath, 'package.dart'), packageFile(pascalCaseName, snakeCaseName));

	// Создание файла screen
	createFile(path.join(featurePath, `screen/${snakeCaseName}_screen.dart`), screen(pascalCaseName));

	// Создание файла theme.dart
	createFile(path.join(featurePath, `theme/theme.dart`), theme(pascalCaseName));
}

// Функция создания нового виджета
function createWidget(name: string, targetUri: vscode.Uri) {
	const snakeCaseName = name;
	const pascalCaseName = snakeToPascalCase(snakeCaseName);
	const widgetPath = path.join(targetUri.fsPath, snakeCaseName);

	fs.mkdirSync(widgetPath);

	const componentsPath = path.join(widgetPath, 'components');
	fs.mkdirSync(componentsPath);

	// Получение имени feature
	const featureName = getFeatureName(targetUri);

	// Создание файла с виджетом
	createFile(path.join(widgetPath, `${snakeCaseName}.dart`), widget(pascalCaseName, featureName));
	// Обновление package.dart
	updatePackageDart(targetUri, 2, "// part 'screen/widgets';", `part 'screen/widgets/${snakeCaseName}/${snakeCaseName}.dart';`);
}

function createComponent(name: string, targetUri: vscode.Uri) {
	const snakeCaseName = name;
	const pascalCaseName = snakeToPascalCase(snakeCaseName);
	const componentPath = path.join(targetUri.fsPath, `${snakeCaseName}.dart`);

	const widgetName = path.basename(path.join(targetUri.fsPath, '../'));

	// Создание файла с виджетом
	createFile(componentPath, component(pascalCaseName));
	// Обновление package.dart
	updatePackageDart(targetUri, 4, "// part 'screen/widgets/_/components';", `part 'screen/widgets/${widgetName}/components/${snakeCaseName}.dart';`);
}


function createModel(name: string, fromJson: boolean, targetUri: vscode.Uri) {
	const snakeCaseName = name;
	const pascalCaseName = snakeToPascalCase(snakeCaseName);
	const modelPath = path.join(targetUri.fsPath, `${snakeCaseName}.dart`);


	// Создание файла с виджетом
	createFile(modelPath, fromJson ? modelFromJson(pascalCaseName) : model(pascalCaseName));
	// Обновление package.dart
	updatePackageDart(targetUri, 2, "// part 'data/model';", `part 'data/model/${snakeCaseName}.dart';`);
}

export function activate(context: vscode.ExtensionContext) {
	let featureDisposable = vscode.commands.registerCommand('extension.createFeature', async (uri: vscode.Uri) => {
		const featureName = await vscode.window.showInputBox({ prompt: 'Введите название фичи в snake_case', placeHolder: 'new_feature' });
		if (featureName) {
			createFeature(featureName, uri);
			vscode.window.showInformationMessage(`Фича ${featureName} создана!`);
		}
	});

	let widgetDisposable = vscode.commands.registerCommand('extension.createWidget', async (uri: vscode.Uri) => {
		// Проверяем, что имя папки - "widgets"
		const folderName = path.basename(uri.fsPath);
		if (folderName !== 'widgets') {
			vscode.window.showErrorMessage('Эта команда должна вызываться из папки "widgets"!');
			return;
		}

		const widgetName = await vscode.window.showInputBox({ prompt: 'Введите название виджета в snake_case', placeHolder: 'new_widget' });
		if (widgetName) {
			createWidget(widgetName, uri);
			vscode.window.showInformationMessage(`Виджет ${widgetName} создан!`);
		}
	});

	let componentDisposable = vscode.commands.registerCommand('extension.createComponent', async (uri: vscode.Uri) => {
		// Проверяем, что имя папки - "components"
		const folderName = path.basename(uri.fsPath);
		if (folderName !== 'components') {
			vscode.window.showErrorMessage('Эта команда должна вызываться из папки "components"!');
			return;
		}

		const componentName = await vscode.window.showInputBox({ prompt: 'Введите название компонента в snake_case', placeHolder: 'new_component' });
		if (componentName) {
			createComponent(componentName, uri);
			vscode.window.showInformationMessage(`Компонент ${componentName} создан!`);
		}
	});

	let modelDisposable = vscode.commands.registerCommand('extension.createModel', async (uri: vscode.Uri) => {
		const folderName = path.basename(uri.fsPath);
		if (folderName !== 'model') {
			vscode.window.showErrorMessage('Эта команда должна вызываться из папки "model"!');
			return;
		}

		const modelName = await vscode.window.showInputBox({ prompt: 'Введите название модель в snake_case', placeHolder: 'new_model' });
		if (!modelName) { return; }

		const fromJson = await vscode.window.showQuickPick(
			[
				{ label: 'Да', value: true },
				{ label: 'Нет', value: false }
			],
			{
				placeHolder: 'Создать конструктор fromJson?',
				canPickMany: false
			}
		);
		if (fromJson) {
			createModel(modelName, fromJson.value, uri);
			vscode.window.showInformationMessage(`Модель ${modelName} создан!`);
		}

	});

	context.subscriptions.push(modelDisposable);
	context.subscriptions.push(componentDisposable);
	context.subscriptions.push(featureDisposable);
	context.subscriptions.push(widgetDisposable);
}

export function deactivate() { }

