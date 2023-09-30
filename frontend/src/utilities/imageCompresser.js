import imageCompression from "browser-image-compression";
export const reduceSizeProfileImage = async (file) => {
  const options = {
    maxSizeMB: 0.5,
    useWebWorker: true,
  };
  try {
    // stores Blob type data
    const compressedFile = await imageCompression(file, options);
    // convert Blob to File
    const image = new File([compressedFile], file.name, {
      type: compressedFile.type,
    });
    return image;
  } catch (error) {
    throw new Error(error);
  }
};
