import { createReadStream, createWriteStream } from 'fs';
import { createBrotliDecompress } from 'node:zlib'; // use Brotli
import { pipeline } from 'node:stream';
import { dirname, basename } from 'path';
import { EOL } from "os";
import { checkFile, getPath } from "./utils.js";


// Function for unpacking files
const decompressFiles = async (zipFile, file) => {
  // create threads for reading, unpacking and writing
  const read = createReadStream(zipFile);
  const brotli = createBrotliDecompress(); // Brotli-decompressor
  const write = createWriteStream(file);

  // Using pipeline to handle threads and errors
  pipeline(read, brotli, write, (err) => {
    if (err) {
      process.exitCode = 1;
      throw new Error(`*** Decompress operation failed. Error: ${err.message}`);
    } else {
      process.stdout.write(EOL + `*** File: ${zipFile}`);
      process.stdout.write(EOL + `*** File ${zipFile} has been decompressed to ${file}` + EOL + ">");
    }
  });
};

export const decompress = async (nameZipFile, pathDestFile) => {
  const pathZipFile = getPath(nameZipFile);
  let isFileExists = await checkFile(pathZipFile);
  if (!isFileExists) {
    throw new Error(`*** FS operation failed. Not a such file : ${pathZipFile}`);
  }

  const pathUnzipFile = getPath(pathDestFile);
  isFileExists = await checkFile(dirname(pathUnzipFile));
  if (!isFileExists) {
    throw new Error(`*** FS operation failed. Not a such directory : ${dirname(pathUnzipFile)}`);
  }
  await decompressFiles(pathZipFile, pathUnzipFile).catch((err) => console.error(err.message));
};

