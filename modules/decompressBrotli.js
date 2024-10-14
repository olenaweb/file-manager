import { createReadStream, createWriteStream } from 'fs';
import { createBrotliDecompress } from 'node:zlib'; // Brotli
import { pipeline } from 'node:stream';
import { dirname } from 'path';
import { EOL } from "os";
import { checkFile, getPath } from "./utils.js";

const decompressFiles = async (zipFile, file) => {
  const read = createReadStream(zipFile);
  const brotli = createBrotliDecompress();
  const write = createWriteStream(file);

  // checking the input file to see if it is an archive
  let decompressedSuccessfully = false;
  brotli.on('data', () => {
    decompressedSuccessfully = true;  // If compressed information is sent - an archive file
  });

  pipeline(read, brotli, write, (err) => {
    if (err || !decompressedSuccessfully) {
      console.error(`*** Decompress operation failed. The file ${zipFile} is not a valid Brotli archive.`);
      process.exitCode = 1;
      write.end();
      process.stdout.write(EOL + ">");

    } else {
      process.stdout.write(EOL + `*** File ${zipFile} has been decompressed to ${file}` + EOL + ">");
    }
  });
};

export const decompress = async (nameZipFile, pathDestFile) => {
  const pathZipFile = getPath(nameZipFile);
  let isFileExists = await checkFile(pathZipFile);
  if (!isFileExists) {
    throw new Error(`*** FS operation failed. No such file : ${pathZipFile}`);
  }

  const pathUnzipFile = getPath(pathDestFile);
  isFileExists = await checkFile(dirname(pathUnzipFile));
  if (!isFileExists) {
    throw new Error(`*** FS operation failed. No such directory: ${dirname(pathUnzipFile)}`);
  }

  await decompressFiles(pathZipFile, pathUnzipFile).catch((err) => console.error(err.message));
};
