// From https://dev.to/stephenwhitmore/take-your-wordpress-site-farther-with-angular-3o6p
console.log("Dir of build process:", process.cwd());
const { execSync } = require("child_process");
const fs = require("fs");
const pluginName = "zen-calendar";
const pluginFileName = `${pluginName}.php`;
const destination = `./plugin/${pluginName}`;
const pluginFilePath = `${destination}/${pluginName}.php`;

// Remove the dist folder in the plugin file if its present. Doesn't care if it's not.
fs.rmSync(`${destination}/dist`, { recursive: true, force: true });

// Run the build command
execSync("ng build --configuration production", {
  encoding: "utf-8",
  stdio: "inherit",
});

// Move the bundle from the `/dist` folder to the plugin's folder
execSync(`mv ./dist ${destination}`);

// copy the js and css file names to an array
distFilenames = fs.readdirSync(`${destination}/dist/${pluginName}`);
scriptsAndStyleFiles = distFilenames.filter(
  (file) => file.endsWith(".js") || file.endsWith(".css")
);
// replace the js and css file names in the php file contents
const pluginFileContents = fs.readFileSync(`${pluginFilePath}`, "utf8");

const updateLine = (line, name) => {
  const matchedLinePart = line.match(/(?<=dist\/).*?(?=\')/gs).toString();
  const matchedFileName = scriptsAndStyleFiles.find((file) =>
    file.includes(name),
  );
  return line.replace(matchedLinePart, matchedFileName);
};

const checkLineInludes = (line, strCheck) => {
  return (
    line.includes(strCheck) &&
    line.includes("plugin_dir_url(__FILE__)") &&
    line.includes("dist/")
  );
};

const updatedFileContentArray = pluginFileContents
  .split(/\r?\n/)
  .map((line) => {
    switch (true) {
      case checkLineInludes(line, "ng_styles"):
        return updateLine(line, "styles");
      case checkLineInludes(line, "ng_main"):
        return updateLine(line, "main");
      case checkLineInludes(line, "ng_polyfills"):
        return updateLine(line, "polyfills");
      case checkLineInludes(line, "ng_runtime"):
        return updateLine(line, "runtime");
      default:
        return line;
    }
  });
const updatedFileContents = updatedFileContentArray.join("\n");

// write the new names to the php file
fs.writeFileSync(`${pluginFilePath}`, updatedFileContents);
// Move the built bundle one dir level up
execSync(`mv ${destination}/dist/${pluginName}/* ${destination}/dist`);
// remove the obsolete dir bundle
execSync(`rmdir ${destination}/dist/${pluginName}`);
console.log(
  `*************** All files are now in folder: "${process.cwd()}/${destination}"`,
);
console.log(
  `*************** Copy the whole folder to the Wordpress plugin folder ***************`,
);
console.log(
  `*************** ${pluginFileName} updated! ******************************`,
);
