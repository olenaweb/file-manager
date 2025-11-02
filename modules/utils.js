import { cwd } from "process";
import { isAbsolute, join } from "path";
import { access } from 'node:fs/promises';

export const getPath = (file) => {
  return isAbsolute(file) ? file : join(cwd(), file);
};

export const checkFile = async (file) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};
