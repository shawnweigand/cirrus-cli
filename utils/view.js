import fs from 'fs';
import path from 'path';
import open from 'open';
import express from 'express';
import { json } from 'stream/consumers';
import { title } from 'process';

const collectData = (argv) => {
    // Intake the schema json from the scecified comma-separated paths and display it, handle the schema is not found in the specified paths
    const paths = argv.from.split(',').map(path => path.trim());
    const uniquePaths = [];
    paths.forEach(inputPath => {
        const resolved = path.resolve(process.cwd(), inputPath);
        // Skip if already included as a parent directory
        if (
            !uniquePaths.some(
                up =>
                    resolved === up ||
                    resolved.startsWith(up + path.sep) ||
                    up.startsWith(resolved + path.sep)
            )
        ) {
            uniquePaths.push(resolved);
        }
    });
    const jsonContents = [];
    uniquePaths.forEach(resolvedPath => {
        const relativePath = path.resolve(process.cwd(), resolvedPath);
        if (!fs.existsSync(resolvedPath)) {
            console.error(`❌ Path does not exist: ${resolvedPath}`);
            return;
        }
        const stat = fs.statSync(resolvedPath);
        if (stat.isFile()) {
            try {
                const content = fs.readFileSync(resolvedPath, 'utf-8');
                const parsed = JSON.parse(content);
                jsonContents.push({
                    title: path.basename(resolvedPath).replace('.json', ''),
                    path: relativePath, 
                    content: parsed 
                });
            } catch (err) {
                console.error(`⚠️ Invalid JSON in file: ${relativePath}\n${err.message}`);
            }
        } else if (stat.isDirectory()) {
            const files = fs.readdirSync(resolvedPath);
            files.forEach(file => {
                const filePath = path.join(resolvedPath, file);
                const relFilePath = path.relative(process.cwd(), filePath);
                if (fs.statSync(filePath).isFile()) {
                    try {
                    const content = fs.readFileSync(filePath, 'utf-8');
                    const parsed = JSON.parse(content);
                    jsonContents.push({ 
                        title: path.basename(filePath).replace('.json', ''),
                        path: relFilePath, 
                        content: parsed 
                    });
                } catch (err) {
                    console.error(`⚠️ Invalid JSON in file: ${relFilePath}\n${err.message}`);
                }
                }
            });
        } else {
            console.warn(`⚠️ Not a regular file or directory: ${relativePath}`);
        }
    })
    // console.log(JSON.stringify(jsonContents, null, 2));
    return jsonContents
}

const cirrusView = (argv) => {
    if (!argv.from) {
        console.error('❌ No schema file paths provided. Use --from to specify paths.');
        return;
    }
    const app = express();
    const port = 4567;
    const iframe = "http://localhost:80/view"
    app.get('/view', (req, res) => {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Cirrus Viewer</title>
            <style>
                html, body { margin: 0; height: 100%; }
                iframe { width: 100%; height: 100%; border: none; }
            </style>
        </head>
        <body>
            <iframe id="cirrus-frame" src="${iframe}"></iframe>
            <script>
                const schemas = ${JSON.stringify(collectData(argv))};
                const iframe = document.getElementById('cirrus-frame');
                window.addEventListener('message', (event) => {
                    if (event.data?.type === 'REQUEST_SCHEMAS') {
                        iframe.contentWindow.postMessage({ type: 'LOAD_SCHEMAS', schemas }, '*');
                    }
                });
            </script>
        </body>
        </html>
        `;
        res.send(html);
    });

    app.listen(port, () => {
    console.log(`🌐 View your data at http://localhost:${port}/view`);
    console.log('Press Ctrl+C to stop the server.');
    open(`http://localhost:${port}/view`);
    });
};

export default cirrusView;