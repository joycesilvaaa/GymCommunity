import React from 'react';
import { Image } from 'native-base';

interface ImagePlayerProps {
    imageUrl: string;
}

function ImageViewer({ imageUrl }: ImagePlayerProps) {
    return (
        <Image
            source={{ uri: "https://via.placeholder.com/150" }}
            alt="Image Viewer"
            width="100%"
            height="100%"
            resizeMode="cover"
        />
    );
}

export default ImageViewer;
