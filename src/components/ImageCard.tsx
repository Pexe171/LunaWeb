"use client";

import NextImage from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageType } from "@/types";
import { Card } from "./ui/card";
import Lightbox from "./Lightbox";
import LikeButton from "./LikeButton";

interface ImageCardProps {
  image: ImageType;
}

export default function ImageCard({ image }: ImageCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const imageUrl = image.url || `${process.env.NEXT_PUBLIC_DRIVE_EMBED_PREFIX}${image.fileId}`;
  const aspectRatio = image.width && image.height ? image.width / image.height : 1;

  const CardMotion = motion(Card);

  return (
    <>
      <CardMotion
        className="relative overflow-hidden cursor-pointer"
        onClick={() => setIsModalOpen(true)}
        variants={{ hover: { scale: 1.05 } }}
        initial="rest"
        whileHover="hover"
        animate="rest"
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <NextImage
          src={imageUrl}
          alt={image.title}
          width={400}
          height={Math.round(400 / aspectRatio)}
          className="object-cover w-full h-full"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjREREREREIiAvPjwvc3ZnPg==`}
        />
        <div className="absolute top-2 right-2 z-10">
          <LikeButton imageId={image._id} />
        </div>
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white"
          variants={{ rest: { opacity: 0, y: 40 }, hover: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-semibold text-lg">{image.title}</h3>
        </motion.div>
      </CardMotion>
      <Lightbox isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} image={image} />
    </>
  );
}
