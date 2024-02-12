import React, { useCallback } from 'react';
import { View } from 'react-native';
import Canvas, { Image as CanvasImage } from 'react-native-canvas';

interface GetPixelColorAtProps {
  imageUri: string;
  onGetFormat: (format: 'closed' | 'far') => void;
}

export const GetPixelColorAt = React.memo(({ imageUri, onGetFormat }: GetPixelColorAtProps) => {
  const handleCanvas = useCallback(async (canvas: Canvas) => {
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const image = new CanvasImage(canvas);
    canvas.width = 100;
    canvas.height = 100;

    const response = await fetch(imageUri);
    const blob = await response.blob();
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      image.src = base64 as string;
    };
    reader.readAsDataURL(blob);

    image.addEventListener('load', async () => {
      ctx.drawImage(image, 0, 0, 100, 100);

      const imageData = await ctx.getImageData(0, 0, 200, 200);
      const data = imageData.data;
      const pixels = Object.values(data);
      let firstLineOfPixels: number[] | null = null;
      for (let index = pixels.length - 400; index >= 0; index -= 400) {
        if (pixels.slice(index - 400, index).some((value) => value !== 0)) {
          firstLineOfPixels = pixels.slice(index - 400, index);
          break;
        }
      }
      if (firstLineOfPixels === null) {
        return;
      }

      let numberOfFirstTransparentPixels = 0;
      for (let index = 0; index < firstLineOfPixels.length; index += 4) {
        if (firstLineOfPixels[index] === 0) {
          numberOfFirstTransparentPixels++;
        } else {
          break;
        }
      }

      onGetFormat(numberOfFirstTransparentPixels > 40 ? 'far' : 'closed');
    });
  }, []);

  return (
    <View style={{ display: 'none' }}>
      <Canvas ref={handleCanvas} />
    </View>
  );
});
