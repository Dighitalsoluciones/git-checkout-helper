/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
const vscode = __importStar(__webpack_require__(1));
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.generateGitCheckoutCommand', async () => {
        const panel = vscode.window.createWebviewPanel('gitCheckoutHelper', 'Git Checkout Helper', vscode.ViewColumn.One, {
            enableScripts: true,
            localResourceRoots: [vscode.Uri.file(context.extensionPath)]
        });
        panel.webview.html = getWebviewContent();
        panel.webview.onDidReceiveMessage(async (message) => {
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
            }
            else if (message.command === 'showMessage') {
                vscode.window.showInformationMessage(message.data);
            }
        });
    });
    context.subscriptions.push(disposable);
}
function parseGitOutput(output) {
    const lines = output.split('\n');
    const paths = [];
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
            .history-section { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 20px; }
            .history-input { margin: 10px 0; }
            .history-output { 
            height: 150px;
            background:rgb(83, 186, 204);
		    color: black;
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

        <div class="history-section">
            <h3>Generar Historial de Cambios</h3>
            <input type="text" id="commitMessage" class="history-input" placeholder="COMMIT: ">
            <select id="changeType" class="history-input">
                <option value="FRONTEND">FRONTEND</option>
                <option value="BACKEND">BACKEND</option>
                <option value="OTRO">OTRO</option>
            </select>
            <button onclick="generateHistory()">Generar Historial</button>
            
            <textarea id="historyOutput" class="history-output"></textarea>
            <button onclick="copyHistory()">Copiar Historial</button>
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
        function generateHistory() {
                const commit = document.getElementById('commitMessage').value;
                const type = document.getElementById('changeType').value;
                const files = document.getElementById('gitOutput').value.split('\\n').filter(l => l.trim());
                
                const date = new Date();
                const formattedDate = \`\${date.getDate().toString().padStart(2, '0')}/\${(date.getMonth()+1).toString().padStart(2, '0')}/\${date.getFullYear().toString().slice(-2)} \${date.getHours()}:\${date.getMinutes().toString().padStart(2, '0')} HS\`;
                
                let output = \`\${type}: \${formattedDate}\\nCOMMIT: \${commit}\\n\`;
                files.forEach(line => output += \`        \${line.trim()}\\n\`);
                output += '\\n-------------------------------------------------------------------------------------------------------------------------';
                
                document.getElementById('historyOutput').value = output;
            }

            function copyHistory() {
                const text = document.getElementById('historyOutput').value;
                navigator.clipboard.writeText(text)
                    .then(() => vscode.postMessage({ command: 'showMessage', data: '¡Historial copiado!' }))
                    .catch(err => console.error(err));
            }
        </script>
    </body>
    </html>
    `;
}


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map