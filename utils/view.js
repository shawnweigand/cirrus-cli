import fs from 'fs';
import path from 'path';
import open from 'open';
import express from 'express';

const collectData = (argv) => {
    console.log(`Viewing cirrus project schema from: ${argv.from}`);
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
                jsonContents.push({ path: relativePath, content: parsed });
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
                    jsonContents.push({ path: relFilePath, content: parsed });
                } catch (err) {
                    console.error(`⚠️ Invalid JSON in file: ${relFilePath}\n${err.message}`);
                }
                }
            });
        } else {
            console.warn(`⚠️ Not a regular file or directory: ${relativePath}`);
        }
    })
    return jsonContents
}

const cirrusView = (argv) => {
    if (!argv.from) {
        console.error('❌ No schema file paths provided. Use --from to specify paths.');
        return;
    }
    let schemas = collectData(argv)
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
            <iframe src="${iframe}"></iframe>
        </body>
        </html>
        `;
        res.send(html);
    });

    app.listen(port, () => {
    console.log(`🌐 View your data at http://localhost:${port}`);
    open(`http://localhost:${port}/view`);
    });
};

export default cirrusView;