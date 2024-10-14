import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress } from 'node:zlib'; // use Brotli
import { pipeline } from 'node:stream';
import { dirname, extname } from 'node:path';
import { EOL } from "os";

import { checkFile, getPath } from "./utils.js";


const compressFiles = async (file, zipFile) => {
  // create streams for reading, compression and writing
  const read = createReadStream(file);
  const brotli = createBrotliCompress(); // Brotli compressor
  const write = createWriteStream(zipFile);

  // Using pipeline to link threads
  pipeline(read, brotli, write, (err) => {
    if (err) {
      process.exitCode = 1;
      throw new Error(`*** Compress operation failed. Error: ${err.message}`);
    } else {
      process.stdout.write(EOL + `*** File: ${file}`);
      // process.stdout.write(EOL + `*** File ${file} has been compressed to ${zipFile}` + EOL + ">");
      process.stdout.write(EOL + `*** File ${file} has been compressed to ${zipFile}` + EOL);
    }
  });
};

export const compress = async (file, zipFile) => {
  const pathFile = getPath(file);
  let isFileExists = await checkFile(pathFile);
  if (!isFileExists) {
    throw new Error(`*** FS operation failed. Not a such file : ${pathFile}`);
  }

  const pathZipFile = getPath(zipFile);
  isFileExists = await checkFile(dirname(pathZipFile));
  if (!isFileExists) {
    throw new Error(`*** FS operation failed. Not a such directory : ${dirname(pathZipFile)}`);
  }

  const extnameZipFile = extname(pathZipFile);
  const nameZipFile = extnameZipFile ? pathZipFile : pathZipFile + '.br';

  await compressFiles(pathFile, nameZipFile).catch((err) => console.error(err.message));
};

