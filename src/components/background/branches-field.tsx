import { ShaderField, BRANCHES_FRAG } from "@/components/background/shader-field";

/**
 * Colorful "space branches" backdrop for the inner pages — the same living
 * shader idea as the home hero, recolored to cosmic filaments for extra color.
 * Fixed behind all content, layered over the base BackgroundField, with scrims
 * that keep the copy readable. Degrades and respects reduced motion through
 * ShaderField.
 */
export function BranchesField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-[9] overflow-hidden"
    >
      <ShaderField frag={BRANCHES_FRAG} className="h-full w-full opacity-90" />
      {/* readability scrims — soft vignette + a light top fade behind the navbar */}
      <div className="absolute inset-0 bg-[radial-gradient(135%_105%_at_50%_-10%,transparent_45%,var(--color-canvas)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-canvas/90 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-canvas to-transparent" />
    </div>
  );
}
