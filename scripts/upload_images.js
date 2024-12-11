import fs from "fs";
import path from "path";
import { exec } from "child_process";
import util from "node:util";

const execPromise = util.promisify(exec);
// Supported image file extensions
const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"];

// Function to check if a file is an image
function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
}

// Function to get the MIME type based on file extension
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".gif":
      return "image/gif";
    case ".bmp":
      return "image/bmp";
    case ".webp":
      return "image/webp";
    default:
      return "";
  }
}

// Function to convert image to base64 with data URI format
function convertImageToBase64(filePath) {
  const mimeType = getMimeType(filePath);
  const image = fs.readFileSync(filePath);
  const base64String = image.toString("base64");
  return `data:${mimeType};base64,${base64String}`;
}

// Function to process all images in the current directory
function processImages() {
  const files = fs.readdirSync("./");
  const base64Images = [];

  files.forEach(file => {
    if (isImageFile(file)) {
      const dataUri = convertImageToBase64(file);
      base64Images.push({ file_name: file, asset: dataUri });
      // base64Images[file] = dataUri;
      console.log(`Converted ${file} to base64 with data URI format`);
    }
  });

  return base64Images;
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(stdout);
    });
  });
}

// Execute the process and log results
const base64Images = processImages();
for (let i = 0; i < base64Images.length; i++) {
  let asset = base64Images[i];
  const principal = "";
  const prefix = "default_img_";
  const command = `dfx canister call elna_images_backend add_asset '(
    record {
      asset = ${asset.asset};
      owner = principal ${principal};
      file_name = ${asset.file_name};
    },
    opt ${prefix},
  )'`;
  try {
    console.log("uploading:", asset.file_name);
    const d = await executeCommand(command);
    console.log(d);
  } catch (e) {
    console.error(e);
  }
}
