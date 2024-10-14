import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import { checkFile, getPath } from "./utils.js";
import { EOL } from "os";

const calculateHashFile = async (file) => {
  const hash = createHash('sha256');
  const stream = createReadStream(file);

  stream.on('data', (chunk) => {
    hash.update(chunk); // Update the hash with each piece of data
  });

  stream.on('end', () => {
    const hexHash = hash.digest('hex'); // hash in hex format
    process.stdout.write(EOL + `File: ${file}`);
    // process.stdout.write(EOL + `> SHA256 Hash: ${hexHash}` + EOL + ">");
    process.stdout.write(EOL + `SHA256 Hash: ${hexHash}` + EOL);
  });

  stream.on('error', (error) => {
    console.error('Error:', error.message);
    throw new Error("*** Hash operation failed. " + error.message);
  });
};

export const calculateHash = async (file) => {
  const pathFile = getPath(file);
  let isFileExists = await checkFile(pathFile);
  if (!isFileExists) {
    throw new Error(`*** FS operation failed. Not a such file : ${pathFile}`);
  }
  calculateHashFile(pathFile).catch((err) => console.error(err.message));
};

