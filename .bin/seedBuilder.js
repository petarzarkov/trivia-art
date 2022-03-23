const fs = require('fs');
const path = require('path');


const gitIgnore = path.resolve(".gitignore");
const dockerIgnore = path.resolve(".dockerignore");
const shouldGitIgnore = fs.existsSync(gitIgnore);
const database = process.argv[2];
const generalSeedsDir = path.resolve(`migrations/${database}/seeders`);

const generalSeeders = [];
const envSeedersDir = [];

let ignoredFiles = [];
if (shouldGitIgnore) {
    ignoredFiles = fs.readFileSync(gitIgnore, "utf8")
        .split("\n")
        .filter((name) => !!name)
        .map((name) => name.trim());
}

const items = fs.readdirSync(generalSeedsDir);

items.forEach((item) => {
    const itemPath = path.join(generalSeedsDir, item);

    if (fs.lstatSync(itemPath).isDirectory()) {
        envSeedersDir.push(itemPath);
    } else {
        generalSeeders.push(item);
    }
});

envSeedersDir.forEach((dir) => {
    const dirName = path.basename(dir);
    generalSeeders.forEach((seederName) => {
        const seed = path.join(generalSeedsDir, seederName);
        const symLinkPath = path.join(dir, seederName);

        if (!fs.existsSync(symLinkPath)) {
            console.log(`Adding symlink ${seed}  --->  ${symLinkPath}`);
            fs.symlinkSync(seed, symLinkPath, 'file');

            // appending newly created symlink to gitignore if needed
            const ignorePath = `**/${dirName}/${seederName}`;
            if (shouldGitIgnore && ignoredFiles.indexOf(ignorePath) === -1) {
                fs.appendFileSync(gitIgnore, `${ignorePath}\n`, 'utf8');
                fs.appendFileSync(dockerIgnore, `${ignorePath}\n`, 'utf8');
            }
        }
    });

    const envSymLinksToRemove = fs.readdirSync(dir).filter(file => {
        const filePath = path.join(dir, file);
        return fs.lstatSync(filePath).isSymbolicLink() && generalSeeders.indexOf(file) < 0;
    });

    envSymLinksToRemove.forEach(file => {
        const filePath = path.join(dir, file);
        console.log(`Removing symlink ${filePath}`);

        return fs.unlinkSync(filePath);
    })
});
