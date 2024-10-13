import { access } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import { createBrotliCompress } from 'node:zlib'; // Используем Brotli
import { pipeline } from 'node:stream';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Проверяем наличие файла
const checkFile = async (file) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};

const compressFiles = async (file, zipFile) => {
  // Проверяем, существует ли файл
  const isFileExists = await checkFile(file);
  if (!isFileExists) {
    throw new Error(`*** Compress operation failed. No such file: ${file}`);
  }

  // Создаем потоки для чтения, сжатия и записи
  const read = createReadStream(file);
  const brotli = createBrotliCompress(); // Brotli-компрессор
  const write = createWriteStream(zipFile);

  // Используем pipeline для связывания потоков
  pipeline(read, brotli, write, (err) => {
    if (err) {
      process.exitCode = 1;
      throw new Error(`*** Compress operation failed. Error: ${err.message}`);
    } else {
      console.log(`*** File ${basename(file)} has been compressed to ${basename(zipFile)}`);
    }
  });
};

const compress = async (file) => {
  const file = join(__dirname, 'files', 'fileToCompress.txt');  // Исходный файл
  const zipFile = join(__dirname, 'files', 'archive.br');       // Результат сжатия с расширением .br
  await compressFiles(file, zipFile).catch((err) => console.error(err.message));
};

await compress(file);
