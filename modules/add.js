export const add = async (file) => {
  const filename = basename(file);
  const src = getPath(filename);
  const existMsg = 'FS operation failed';

  try {
    // Check if the file already exists
    await access(src);
    console.error(`FS operation failed. ${file} already exists.`);
    throw new Error(existMsg);
  } catch (err) {
    if (err.message !== existMsg) {
      // Create the file only if it doesn't already exist
      try {
        await writeFile(src, ''); // Create empty file
        console.log(`${file} has been created.`);
      } catch (writeErr) {
        console.error(`Failed to create ${file}: ${writeErr.message}`);
        throw new Error(writeErr.message);
      }
    } else {
      throw err; // Re-throw error if it's the existence check failure
    }
  }
};
