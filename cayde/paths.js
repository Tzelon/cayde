const path = require('path');
const fs = require('fs');
const url = require('url');

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());

/**
 * Resolve folders from the project root directory.
 * NOTE: actually it's from the directory we run the command from.
 * @param {String} relativePath 
 */

const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);


/**
 * Resolve folders from the project root folder
 * @param {String} relativePath
 */
const resolveOwn = (relativePath) =>
    path.resolve(__dirname, '../', relativePath);


const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(path, needsSlash) {
    const hasSlash = path.endsWith('/');
    if (hasSlash && !needsSlash) {
        return path.substr(path, path.length - 1);
    } else if (!hasSlash && needsSlash) {
        return `${path}/`;
    } else {
        return path;
    }
}

const getPublicUrl = (appPackageJson) =>
    envPublicUrl || require(appPackageJson).homepage;

function getServedPath(appPackageJson) {
    const publicUrl = getPublicUrl(appPackageJson);
    const servedUrl =
        envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
    return ensureSlash(servedUrl, true);
}


const nodePaths = (process.env.NODE_PATH || '')
    .split(process.platform === 'win32' ? ';' : ':')
    .filter(Boolean)
    .filter((folder) => !path.isAbsolute(folder))
    .map(resolveApp);

module.exports = {
    appServerIndexJs: resolveApp('server.ts'),
    appClientIndexJs: resolveOwn('cayde-client/client.ts'),
    appRootDir: resolveApp('.'),
    // dotenv: resolveApp('.env'),
    // appBuild: resolveApp('build'),
    // appBuildPublic: resolveApp('build/public'),
    // appManifest: resolveApp('build/assets.json'),
    // appPublic: resolveApp('public'),
    // appNodeModules: resolveApp('node_modules'),
    // appSrc: resolveApp('src'),
    // realAppServerIndexJs: resolveApp('src/server.js'), //TODO: change name to appServerIndexJS
    // appPackageJson: resolveApp('package.json'),
    // serverSrc: resolveOwn('cayde-server'),
    // testsSetup: resolveApp('src/setupTests.js'),
    // tailwindCss: resolveApp('tailwind.js'),
    // appBabelRc: resolveApp('.babelrc'),
    // appEslintRc: resolveApp('.eslintrc'),
    // appCaydeConfig: resolveApp('cayde.config.js'),
    // nodePaths: nodePaths,
    // ownPath: resolveOwn('.'),
    // ownNodeModules: resolveOwn('node_modules')
    // publicUrl: getPublicUrl(resolveApp("package.json")),
    // servedPath: getServedPath(resolveApp("package.json"))
};
