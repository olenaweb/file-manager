•	General
o	+6 Application accepts username and prints proper message

o	+10 Application exits if user pressed ctrl+c or sent .exit command and proper message is printed

•	Operations fail
	
o	+20 Attempts to perform an operation on a non-existent file or work on a non-existent path result in the operation fail

o	+10 Operation fail doesn't crash application
	
•	Navigation & working directory operations implemented properly

o	+10 Go upper from current directory

o	+10 Go to dedicated folder from current directory

o	+20 List all files and folders in current directory

•	Basic operations with files implemented properly

o	+10 Read file and print it's content in console

o	+10 Create empty file

o	+10 Rename file

o	+10 Copy file  

o	+10 Move file 

o	+10 Delete file

•	Operating system info (prints following information in console) implemented properly

o	+6 Get EOL (default system End-Of-Line)

o	+10 Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them)

o	+6 Get home directory

o	+6 Get current system user name (Do not confuse with the username that is set when the application starts)

o	+6 Get CPU architecture for which Node.js binary has compiled

•	Hash calculation implemented properly

o	+20 Calculate hash for file

•	Compress and decompress operations

o	+20 Compress file (using Brotli algorithm)

o	+20 Decompress file (using Brotli algorithm)

Advanced Scope

•	+30 All operations marked as to be implemented using certain streams should be performed using Streams API

•	+20 No synchronous Node.js API with asynchronous analogues is used (e.g. not used readFileSync instead of readFile)

•	+20 Codebase is written in ESM modules instead of CommonJS

•	+20 Codebase is separated (at least 7 modules)

