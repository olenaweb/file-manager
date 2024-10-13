import { EOL } from "os";
import { Transform } from "stream";
import { env, cwd, exit } from "process";
import { up, rm, cd, ls, cat, add, rn, cp, mv } from "./modules/fsCommands.js";
import systemInfo from "./modules/systemInfo.js";

const commandMan = new Transform({
  async transform(chunk, encoding, callback) {
    const [command, ...args] = chunk.toString().replace(EOL, "").split(" ");
    // console.log('args = ', args);
    // console.log('Yours command = ', command);
    try {
      switch (command) {
        case ".exit":
          console.log(`${EOL}Thank you for using File Manager , ${env.username} , goodby!`);
          break;
        case "up":
          up();
          break;
        case "rm":
          const toDeleteFile = args[0];
          await rm(toDeleteFile);
          break;
        case "cd":
          await cd(...args);
          break;
        case "ls":
          await ls(...args);
          break;
        case "os":
          args.forEach((item) => {
            systemInfo(item);
          });
          break;
        case "cat":
          await cat(...args);
          break;
        case "add":
          await add(...args);
          break;
        case "rn":
          await rn(...args);
          break;
        case "cp":
          await cp(...args);
          break;
        case "mv":
          await mv(...args);
          break;

        // case "hash":
        //   await calculateHash(...args);
        //   break;
        case "compress":
          await compress(...args);
          break;
        // case "decompress":
        //   await decompress(...args);
        //   break;
        default:
          throw new Error(
            `${EOL} Invalid input: wrong command: ${command}`
          );
      }
    } catch (err) {
      console.log(err.message);
    }

    console.log(`${EOL}You are currently in ${cwd()}`);
    process.stdout.write(EOL + "> ");

    callback();
  },
});

export default commandMan;
