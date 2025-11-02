import { userInfo, arch, cpus, EOL, homedir, } from "os";
// import cores from "os";

const systemInfo = (repl) => {
  switch (repl) {
    case "--EOL":
      console.log(EOL + JSON.stringify(EOL));
      break;
    case "--cpus":
      const processor = cpus();
      console.log(`${EOL}Overall amount of CPUS: ${processor.length}`);
      processor.forEach((cpu, index) => {
        const clockRateGHz = (cpu.speed / 1000).toFixed(2);
        console.log(`CPU ${index + 1}: ${cpu.model} - ${clockRateGHz} GHz`);
      });
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
