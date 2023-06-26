import { cwd } from "process";
import { isAbsolute, join, parse } from "path";
export const getPath = (file) => {
  return isAbsolute(file) ? file : join(cwd(), file);
};
