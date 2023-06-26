import { EOL } from "os";
import { Transform } from "stream";
import { env, cwd, exit } from "process";

// import { compress, decompress } from "./modules/archiveProcessing.js";
// import { cd, up } from "./modules/moveCommands.js";
// import { list } from "./modules/listFiles.js";
// import osInfo from "./modules/osInfo.js";
// import { calculateHash } from "./modules/hashProcessing.js";
// import { add, cat, cp, mv, rm, rn } from "./modules/filesProcessing.js";
// import { add, cat, cp, mv, rm, rn } from "./modules/fsCommands.js";

const commandMan = new Transform({
  async transform(chunk, encoding, callback) {
    const [command, ...args] = chunk.toString().replace(EOL, "").split(" ");
    console.log('Yours command = ', command);
    try {
      switch (command) {
        case ".exit":
          // console.log('env.username = ', env.username);
          console.log(`${EOL}Thank you for using File Manager , ${env.username} , goodby!`);
          exit();
        case "up":
          up();
          break;
        case "cd":
          await cd(...args);
          break;
        case "ls":
          await list();
          break;
        case "os":
          args.forEach((i) => {
            osInfo(i);
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
        case "rm":
          await rm(...args);
          break;
        case "hash":
          await calculateHash(...args);
          break;
        case "compress":
          await compress(...args);
          break;
        case "decompress":
          await decompress(...args);
          break;
        default:
          throw new Error(
            `${EOL} Invalid input: unsupported command: ${command}`
          );
      }
    } catch (err) {
      console.log("Operation failed: " + err.message);
    }

    console.log(`${EOL}You are currently in ${cwd()}...`);
    callback();
  },
});

export default commandMan;
