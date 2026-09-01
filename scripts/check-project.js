const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const failures = [];

function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(full) : [full];
    });
}

const files = walk(root).filter((file) => !file.includes(path.sep + ".git" + path.sep));
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const jsFiles = files.filter((file) => file.endsWith(".js"));

for (const file of jsFiles) {
    try {
        new vm.Script(fs.readFileSync(file, "utf8"), { filename: file });
    } catch (error) {
        failures.push("JavaScript syntax: " + path.relative(root, file) + " — " + error.message);
    }
}

for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    const ids = Array.from(html.matchAll(/\bid=[\"']([^\"']+)[\"']/g), (match) => match[1]);
    const duplicates = Array.from(new Set(ids.filter((id, index) => ids.indexOf(id) !== index)));
    if (duplicates.length) failures.push("Duplicate IDs in " + path.relative(root, file) + ": " + duplicates.join(", "));

    for (const match of html.matchAll(/(?:href|src)=[\"']([^\"'#?]+)(?:[?#][^\"']*)?[\"']/g)) {
        const reference = match[1];
        if (/^(?:https?:|mailto:|data:|javascript:)/.test(reference)) continue;
        const target = path.normalize(path.join(path.dirname(file), reference));
        if (!fs.existsSync(target)) failures.push("Broken reference in " + path.relative(root, file) + ": " + reference);
    }
}

const required = [
    "index.html",
    "README.md",
    "client/js/store.js",
    "client/js/ui.js",
    "client/js/pages.js",
    "client/js/app.js"
];
for (const file of required) {
    if (!fs.existsSync(path.join(root, file))) failures.push("Missing required file: " + file);
}

if (failures.length) {
    console.error(failures.join("\n"));
    process.exit(1);
}

console.log("Project check passed: " + htmlFiles.length + " HTML files, " + jsFiles.length + " JavaScript files, and no broken local references.");
