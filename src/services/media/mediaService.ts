import { launchImageLibrary } from 'react-native-image-picker';
import type { ImageLibraryOptions, Asset } from 'react-native-image-picker';

export interface PickedMedia {
  uri?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  duration?: number;
  url?: string;
}

const toPickedMedia = (asset?: Asset): PickedMedia | null => {
  if (!asset?.uri) return null;

  return {
    uri: asset.uri,
    fileName: asset.fileName,
    fileType: asset.type,
    fileSize: asset.fileSize,
    duration: asset.duration,
  };
};

const pick = async (options: ImageLibraryOptions): Promise<PickedMedia | null> => {
  const result = await launchImageLibrary(options);

  if (result.didCancel) return null;

  if (result.errorCode) {
    throw new Error(result.errorMessage ?? 'No se pudo acceder a la galería.');
  }

  return toPickedMedia(result.assets?.[0]);
};

export const mediaService = {
  pickVideo: () =>
    pick({
      mediaType: 'video',
      selectionLimit: 1,
      videoQuality: 'high',
    }),

  pickCoverImage: () =>
    pick({
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.9,
    }),
};