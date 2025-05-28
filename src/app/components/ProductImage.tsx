import { useState } from "react";
import Image from "next/image";

export default function ProductImage({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={300}
      height={200}
      className="rounded-lg w-full h-32 object-cover mb-2"
      onError={() => setImgSrc("/images/placeholder.jpg")}
      {...props}
    />
  );
}