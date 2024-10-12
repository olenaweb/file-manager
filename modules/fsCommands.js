import { getPath } from "./utils.js";
import { chdir, cwd } from "process";
import { parse, basename } from "path";
import { lstat, rename, unlink, writeFile, access, constants, readdir } from "node:fs/promises";
import { appendFile, createReadStream, createWriteStream } from "fs";
import { EOL } from "os";


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
  const filename = basename(file);
  try {
    await unlink(getPath(filename));
    console.log(`*** file ${file} has been removed`);
  }
  catch {
    throw new Error(`*** FS operation failed. Not a such file ${file}`);
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
    await lstat(cwd());
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
    console.log(err.message);
    return;
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
  const filename = basename(file);

  const readStream = createReadStream(getPath(filename), 'utf-8');
  readStream.on('data', (data) => {
    process.stdout.write(data + EOL + "> end of file, input next command" + EOL + ">");
  })

  readStream.on("error", (err) => console.log(err.message));

};

//ADD

export const add = async (file) => {
  const filename = basename(file);
  const src = getPath(filename);
  const existMsg = 'FS operation failed';
  try {
    await access(src);
    throw new Error(existMsg);
  } catch (err) {
    try {
      if (err.message === existMsg) {
        throw new Error(err);
      }
      const string = '';
      await writeFile(src, string)
      console.log(`${file} have been created`);
    } catch (e) {
      throw new Error(e.message);
    }
  }
};

// RN
export const rn = async (file1, file2) => {
  const filename1 = basename(file1);
  const filename2 = basename(file2);

  const name = getPath(filename2);
  const wrongName = getPath(filename1);

  const existMsg = 'FS operation failed';
  try {
    await access(name);
    throw new Error(existMsg);
  } catch (e) {
    try {
      if (e.message === existMsg) {
        throw new Error(e);
      }
      await rename(wrongName, name);
      console.log(`${file1} renamed to ${file2}`);
    } catch (err) {
      throw new Error(err);
    }
  }
};

// CP
export const cp = async (file1, file2) => {
  const filename1 = basename(file1);
  const filename2 = basename(file2);

  const currPath = getPath(filename1);
  const newFile = getPath(filename2);
  try {
    const readStream = createReadStream(currPath);
    const writeStream = createWriteStream(newFile);

    readStream.pipe(writeStream);
    readStream.on('error', (error) => {
      console.error('Error reading the source file:', error);
    });

    writeStream.on('error', (error) => {
      console.error('Error writing to the destination file:', error);
    });

    writeStream.on('finish', () => {
      console.log(EOL + `File ${file1} copied to ${file2}!`);
    });
  }
  catch (err) {
    if (err.code === 'ENOENT') throw new Error(`*** ${file2} will be created`);
    console.log(err.message);
    // add(file2);
    // return;
  }
};

// MV
export const mv = async (file1, file2) => {
  const filename1 = basename(file1);
  const filename2 = basename(file2);

  const currPath = getPath(filename1);
  const newFile = getPath(filename2);
  try {
    const readStream = createReadStream(currPath);
    const writeStream = createWriteStream(newFile);

    readStream.pipe(writeStream);
    readStream.on('error', (error) => {
      console.error('Error reading the source file:', error);
    });

    writeStream.on('error', (error) => {
      console.error('Error writing to the destination file:', error);
    });

    writeStream.on('finish', () => {
      console.log(EOL + `File ${file1} movied to ${file2}!`);
      rm(file1);
    });
  }
  catch (err) {
    if (err.code === 'ENOENT') throw new Error(`*** ${file2} will be created`);
    console.log(err.message);
    add(file2);
    return;
  }
};

