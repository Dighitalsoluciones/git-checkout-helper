import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.generateGitCheckoutCommand', async () => {
		const panel = vscode.window.createWebviewPanel(
			'gitCheckoutHelper',
			'Git Checkout Helper',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [vscode.Uri.file(context.extensionPath)]
			}
		);

		panel.webview.html = getWebviewContent();
		panel.webview.onDidReceiveMessage(async message => {
			if (message.command === 'generate') {
				const { branch, gitOutput } = message.data;
				const paths = parseGitOutput(gitOutput);

				if (paths.length === 0) {
					vscode.window.showErrorMessage('No se encontraron archivos válidos');
					return;
				}


				const quotedPaths = paths.map(p => (p.includes(' ') ? `'${p}'` : p));
				const command = `git checkout ${branch} -- ${quotedPaths.join(' ')}`;

				panel.webview.postMessage({ command: 'result', data: command });
			} else if (message.command === 'showMessage') {
				vscode.window.showInformationMessage(message.data);
			}
		});
	});

	context.subscriptions.push(disposable);
}

function parseGitOutput(output: string): string[] {
	const lines = output.split('\n');
	const paths: string[] = [];

	const regex = /^\s*(?:modified|new file|deleted|renamed):\s*(.*)$/i;

	for (const line of lines) {
		const match = line.match(regex);
		if (match) {
			const cleanedPath = match[1].trim();
			if (cleanedPath) {
				paths.push(cleanedPath);
			}
		}
	}

	return paths;
}

function getWebviewContent() {
	return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { padding: 20px; font-family: Arial; }
            .container { max-width: 800px; margin: 0 auto; }
            textarea {
                width: 100%;
                height: 150px;
                margin: 10px 0;
                font-family: monospace;
            }
            #result {
                margin-top: 20px;
                padding: 10px;
                background:rgb(148, 226, 152);
				color: black;
                word-break: break-all;
                white-space: pre-wrap;
                overflow-x: auto;
                max-height: 200px;
            }
            button {
                padding: 8px 16px;
                background: #007acc;
                color: white;
                border: none;
                cursor: pointer;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Generador de Comando Git Checkout</h2>
            <label>Rama a copiar:</label>
            <input type="text" id="branch" placeholder="nombre-de-la-rama">
            
            <label>Salida de Git (modified/new file/etc):</label>
            <textarea id="gitOutput"></textarea>
            
            <button onclick="generateCommand()">Generar Comando</button>
            
            <div id="resultContainer" style="display: none;">
                <h3>Comando Resultante:</h3>
                <pre id="result"></pre>
                <button onclick="copyCommand()">Copiar al Portapapeles</button>
            </div>
        </div>
        
        <script>
            const vscode = acquireVsCodeApi();
            
            function generateCommand() {
                const branch = document.getElementById('branch').value;
                const gitOutput = document.getElementById('gitOutput').value;
                
                vscode.postMessage({
                    command: 'generate',
                    data: { branch, gitOutput }
                });
            }
            
            window.addEventListener('message', event => {
                const { command, data } = event.data;
                if (command === 'result') {
                    document.getElementById('result').textContent = data;
                    document.getElementById('resultContainer').style.display = 'block';
                }
            });
            
function copyCommand() {
    const command = document.getElementById('result').textContent;
    navigator.clipboard.writeText(command)
        .then(() => {
            // Usa la API de VS Code para mostrar notificaciones
            vscode.postMessage({ command: 'showMessage', data: '¡Comando copiado!' });
        })
        .catch(err => console.error('Error al copiar:', err));
}
        </script>
    </body>
    </html>
    `;
}