import { userInfo, arch, cpus, EOL, homedir, } from "os";
// import cores from "os";



const systemInfo = (repl) => {
  switch (repl) {
    case "--EOL":
      console.log(EOL + JSON.stringify(EOL));
      break;
    case "--cpus":
      const processor = cpus();
      // const processor = cores.cpus();
      console.log(`${EOL} ${processor.length} - ${processor[0].model}`);
      break;
    case "--homedir":
      console.log(`${EOL}`, homedir());
      break;
    case "--username":
      const { username } = userInfo();
      console.log(`${EOL} ${username}`);
      break;
    case "--architecture":
      console.log(`${EOL}`, arch());
      break;
    default:
      break;
  }
};

export default systemInfo;
