import { getPath } from "./utils.js";
import { chdir, cwd } from "process";
import { parse, basename } from "path";
import { lstat, rename, unlink } from "fs/promises";
import { createReadStream, createWriteStream } from "fs";
import { EOL } from "os";

// import { lstat } from "fs/promises";


export const up = () => {
  if (parse(cwd()).root === cwd()) {
    throw new Error("This operation shouldn't change working directory.This is root!");
  }

  chdir("../");
};

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
// await remove('fileToRemove.txt');