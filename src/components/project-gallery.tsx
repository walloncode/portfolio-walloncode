export function ProjectGallery({ images, title }: { images: string[]; title: string }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:thin] snap-x snap-mandatory">
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${title} — tela ${i + 1}`}
          loading="lazy"
          className="h-[440px] w-auto shrink-0 snap-start rounded-[var(--radius-md)] border border-white/[0.08] object-contain"
        />
      ))}
    </div>
  );
}
