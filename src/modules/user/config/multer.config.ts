import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Define the destination and filename for uploaded files
const storage = diskStorage({
  destination: './uploads', // Specify the destination folder where the files will be stored
  filename: (req, file, callback) => {
    const filename = uuidv4(); // Generate a unique filename using UUIDv4
    const extension = file.originalname.split('.').pop(); // Get the file extension from the original name
    const uniqueFilename = `${filename}.${extension}`; // Concatenate the filename and extension
    callback(null, uniqueFilename);
  },
});

// Configure the multer options
export const multerConfig = {
  storage: storage, // Set the storage configuration
  limits: {
    fileSize: 5 * 1024 * 1024, // Set the maximum file size (in this example, 5MB)
  },
};
