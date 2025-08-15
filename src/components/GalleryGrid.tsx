import ImageCard from "./ImageCard";
import { Image } from "@/types";
import { Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GalleryGridProps {
  images: Image[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-24 gap-4">
        <Pencil className="w-16 h-16 text-accent" />
        <h2 className="text-2xl font-semibold">A Calma Antes da Criação.</h2>
        <p className="max-w-md text-lg">
          Toda grande obra de arte começa com uma tela em branco. Estamos preparando cada
          detalhe para exibir desenhos feitos com a alma. A sua visita em breve será recompensada.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      <AnimatePresence>
        {images.map((image) => (
          <motion.div
            key={image._id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <ImageCard image={image} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
