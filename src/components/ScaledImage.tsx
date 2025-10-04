import React, { useEffect, useState } from 'react';
import { Image, ImageSourcePropType } from 'react-native';

interface Props {
  width?: number;
  height?: number;
  source: ImageSourcePropType;
}

export default ({ ...props }: Props) => {
  const [dimension, setDimension] = useState<{
    width?: number;
    height?: number;
  }>();

  useEffect(() => {
    const getSize = (width: number, height: number) => {
      if (props.width && !props.height) {
        setDimension({
          width: props.width,
          height: height * (props.width / width),
        });
      } else if (!props.width && props.height) {
        setDimension({
          width: width * (props.height / height),
          height: props.height,
        });
      } else {
        setDimension({ width: width, height: height });
      }
    };

    getSize(
      Image.resolveAssetSource(props.source).width,
      Image.resolveAssetSource(props.source).height,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Image
      source={props.source}
      style={{ height: dimension?.height, width: dimension?.width }}
    />
  );
};
