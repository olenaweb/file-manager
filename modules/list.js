import { access, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Получение пути файла
const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

// Функция для проверки существования каталога
const checkDirectory = async (dir) => {
  try {
    await access(dir);
    return true;
  } catch {
    return false;
  }
};

// Основная функция для получения и сортировки файлов и каталогов
const listDir = async (dir) => {
  let isDirExists = await checkDirectory(dir);
  if (!isDirExists) {
    throw new Error(`*** FS operation failed. Directory does not exist: ${dir}`);
  }

  const files = await readdir(dir, { withFileTypes: true }); // fs.Dirent
  const directories = [];
  const regularFiles = [];

  // Разделение файлов и каталогов
  for (let file of files) {
    if (file.isDirectory()) {
      directories.push({ Name: file.name, Type: 'directory' });
    } else {
      regularFiles.push({ Name: file.name, Type: 'file' });
    }
  }

  // Сортировка по алфавиту
  directories.sort((a, b) => a.Name.localeCompare(b.Name));
  regularFiles.sort((a, b) => a.Name.localeCompare(b.Name));

  // Объединение результатов с каталогами первыми
  const sortedFiles = [...directories, ...regularFiles];

  // Вывод в табличном виде
  console.table(sortedFiles);
};

// Функция для запуска
const list = async () => {
  const dir = join(_dirname, 'files');
  await listDir(dir).catch((err) => console.error(err.message));
};

await list();
