import { access } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'fs';
import { createBrotliDecompress } from 'node:zlib'; // Используем Brotli для распаковки
import { pipeline } from 'node:stream';
import { dirname, join, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Функция для проверки наличия файла
const checkFile = async (file) => {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
};

// Функция для распаковки файлов
const decompressFiles = async (file, zipFile) => {
  const isFileExists = await checkFile(zipFile);
  if (!isFileExists) {
    throw new Error(`*** Decompress operation failed. No such file: ${zipFile}`);
  }

  // Создаем потоки для чтения, распаковки и записи
  const read = createReadStream(zipFile);
  const brotli = createBrotliDecompress(); // Brotli-декомпрессор
  const write = createWriteStream(file);

  // Используем pipeline для обработки потоков и ошибок
  pipeline(read, brotli, write, (err) => {
    if (err) {
      process.exitCode = 1;
      throw new Error(`*** Decompress operation failed. Error: ${err.message}`);
    } else {
      console.log(`*** File ${basename(zipFile)} has been decompressed to ${basename(file)}`);
    }
  });
};

// Основная функция для запуска распаковки
export const decompress = async () => {
  const file = join(__dirname, 'files', 'fileToCompress.txt');  // Результирующий файл
  const zipFile = join(__dirname, 'files', 'archive.br');       // Сжатый файл с расширением .br
  await decompressFiles(file, zipFile).catch((err) => console.error(err.message));
};

