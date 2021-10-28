import React from 'react';
import NFT from '../../../images/nft.svg';
import MTL from '../../../images/mtl.svg';
import DATABASE from '../../../images/database.svg';

export default function FileExtension({ src }) {
  return (
    <img src={src === 'NFT' ? NFT : src === 'MTL' ? MTL : DATABASE} alt={src} />
  );
}
