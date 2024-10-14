import { chdir, cwd } from "process";
import { parse, basename, dirname, join } from "path";
import { lstat, rename, unlink, writeFile, access, constants, readdir } from "node:fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { EOL } from "os";
import { checkFile, getPath } from "./utils.js";

// import { lstat } from "fs/promises";

// UP
export const up = () => {
  if (parse(cwd()).root === cwd()) {
    throw new Error("This operation shouldn't change working directory.This is root!");
  }
  chdir("../");
};

// RM
export const rm = async (file) => {
  const pathFile = getPath(file);
  let isFileExists = await checkFile(pathFile);
  if (!isFileExists) {
    throw new Error(`*** FS operation failed. Not a such file : ${pathFile}`);
  }
  try {
    await unlink(pathFile);
    console.log(`*** file ${pathFile} has been removed`);
  }
  catch (err) {
    throw new Error(`*** FS operation failed with ${pathFile} ` + err.message);
  }
};

// CD
export const cd = async (dir) => {
  if (!dir) {
    throw new Error(`Invalid input: ${dir} `);
  }
  const currDir = cwd();

  try {
    chdir(dir);
  } catch (err) {
    chdir(currDir);
    throw new Error(`*** FS operation failed. Not a such directory: ${dir}`);
  }
};

// LS
export const ls = async (path = "") => {
  const pathDir = path ? getPath(path) : cwd();

  try {
    await access(pathDir, constants.F_OK);
  }
  catch (err) {
    if (err.code === 'ENOENT') throw new Error(`*** FS operation failed. Not a such directory : ${pathDir}`);
  }

  async function listAll(dir) {
    const files = await readdir(dir, { withFileTypes: true }); // fs.Dirent
    const directories = [];
    const regularFiles = [];

    for (let file of files) {
      if (file.isDirectory()) {
        directories.push({ Name: file.name, Type: 'directory' });
      } else {
        regularFiles.push({ Name: file.name, Type: 'file' });
      }
    }

    directories.sort((a, b) => a.Name.localeCompare(b.Name));
    regularFiles.sort((a, b) => a.Name.localeCompare(b.Name));

    const sortedFiles = [...directories, ...regularFiles];

    // Tabular output
    console.table(sortedFiles);
  }

  await listAll(pathDir);

};

// CAT
export const cat = async (file) => {
  const pathFile = getPath(file);
  let isFileExists = await checkFile(pathFile);
  if (!isFileExists) {
    throw new Error(`*** FS operation failed. Not a such file : ${pathFile}`);
  }

  const readStream = createReadStream(getPath(pathFile), 'utf-8');
  readStream.on('data', (data) => {
    process.stdout.write(data + EOL + "> end of file, input next command" + EOL + ">");
  })

  readStream.on("error", (err) => console.log('*** FS operation failed. ' + err.message));

};

//ADD

export const add = async (file) => {
  const pathFile = getPath(file);
  let isFileExists = await checkFile(pathFile);
  if (isFileExists) {
    throw new Error(`*** FS operation failed. This file ${pathFile} exists`);
  }

  try {
    const string = '';
    await writeFile(pathFile, string)
    console.log(`${pathFile} have been created`);
  } catch (e) {
    throw new Error('FS operation failed. ' + e.message);
  }
};

// RN
// rn path_to_file new_filename
export const rn = async (file1, file2) => {

  const wrongName = getPath(file1);

  const pathFile2 = dirname(wrongName);
  const nameFile2 = basename(file2);
  const rightName = join(pathFile2, nameFile2);

  let isFileExists = await checkFile(wrongName);
  if (!isFileExists) {
    throw new Error(`*** FS operation failed. Not a such file : ${wrongName}`);
  }
  isFileExists = await checkFile(rightName);
  if (isFileExists) {
    throw new Error(`*** FS operation failed. That file exists : ${rightName}`);
  }
  try {
    await rename(wrongName, rightName);
    console.log(`${file1} renamed to ${file2}`);
  } catch (err) {
    throw new Error('*** FS operation failed.' + err);
  }
};

// CP
// cp path_to_file path_to_new_directory
export const cp = async (file1, dir2) => {
  const sourceFile = getPath(file1);
  let isFileExists = await checkFile(sourceFile);
  if (!isFileExists) {
    throw new Error(`*** FS operation failed. This file ${sourceFile} not exists`);
  }

  isFileExists = await checkFile(dir2);
  if (!isFileExists) {
    throw new Error(`*** FS operation failed. This directory ${dir2} not exists`);
  }
  const fullDir2 = getPath(dir2);
  const filename2 = basename(file1);
  const targetFile = join(fullDir2, filename2);

  try {
    const readStream = createReadStream(sourceFile);
    const writeStream = createWriteStream(targetFile);

    readStream.pipe(writeStream);
    readStream.on('error', (error) => {
      console.error(`Error reading the source file ${sourceFile} ` + error.message);
    });

    writeStream.on('error', (error) => {
      console.error(`Error writing to the destination file ${targetFile}` + error.message);
    });

    writeStream.on('finish', () => {
      process.stdout.write(EOL + `File ${sourceFile} copied to ${targetFile}` + EOL + "> ");
    });
  }
  catch (err) {
    console.log('*** FS operation failed. ' + err.message);
  }
};

// MV
// mv path_to_file path_to_new_directory
export const mv = async (file1, dir2) => {
  const sourceFile = getPath(file1);
  let isFileExists = await checkFile(sourceFile);
  if (!isFileExists) {
    throw new Error(`*** FS operation failed. This file ${sourceFile} not exists`);
  }

  isFileExists = await checkFile(dir2);
  if (!isFileExists) {
    throw new Error(`*** FS operation failed. This directory ${dir2} not exists`);
  }

  const fullDir2 = getPath(dir2);
  const filename2 = basename(file1);
  const targetFile = join(fullDir2, filename2);

  try {
    const readStream = createReadStream(sourceFile);
    const writeStream = createWriteStream(targetFile);

    readStream.pipe(writeStream);

    readStream.on('error', (error) => {
      console.error(`Error reading the source file ${sourceFile} ` + error.message);
    });

    writeStream.on('error', (error) => {
      console.error(`Error writing to the destination file ${targetFile}` + error.message);
    });

    // waiting for the recording to complete and writeStream to close
    writeStream.on('close', async () => {
      process.stdout.write(EOL + `File ${sourceFile} moved to ${targetFile}` + EOL + "> ");
      // Deleting the original file
      try {
        await unlink(sourceFile);
      } catch (err) {
        console.error(`*** FS operation failed. Unable to delete file ${sourceFile}: ${err.message}`);
      }
    });
  } catch (err) {
    console.log('*** FS operation failed. ' + err.message);
  }
};
