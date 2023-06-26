import { getPath } from "./utils.js";
import { chdir, cwd } from "process";
import { parse, basename } from "path";
import { lstat, rename, unlink } from "fs/promises";
import { access, constants, readdir } from 'node:fs/promises';

// import { createReadStream, createWriteStream } from "fs";
// import { EOL } from "os";
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
    for (let file of await readdir(dir, { withFileTypes: true })) {
      console.log(`${file.name}`);
    }
  }

  await listAll(pathDir);

};