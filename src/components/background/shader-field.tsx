import { useEffect, useRef } from "react";

/**
 * Living aurora shader for the hero. WebGL2 full-screen fragment shader,
 * recolored to the single-accent indigo identity (in-palette, tonemapped —
 * not the rainbow/neon original). Degrades gracefully: if WebGL2 is
 * unavailable the canvas stays transparent and the page background shows
 * through. Respects prefers-reduced-motion and pauses when scrolled offscreen.
 */

const VERT_SRC = `#version 300 es
precision highp float;
in vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }`;

/**
 * Colorful wave pattern used behind the "Como eu trabalho" section.
 * Original concept by Matthias Hurrle (@atzedent). Uses the same `time` /
 * `resolution` uniforms as the default field, so it drops straight into the
 * renderer below.
 */
export const WAVES_FRAG = `#version 300 es
precision highp float;
uniform float time;
uniform vec2 resolution;
out vec4 fragColor;

const float WAVE_COUNT = 3.0;
const float WAVE_AMPLITUDE = 0.2;
const float WAVE_FREQUENCY = 1.5;
const float BRIGHTNESS = 0.005;
const float COLOR_SEPARATION = 0.03;

float pattern(vec2 uv) {
  float intensity = 0.0;
  for (float i = 0.0; i < WAVE_COUNT; i++) {
    uv.x += sin(time * (1.0 + i) + uv.y * WAVE_FREQUENCY) * WAVE_AMPLITUDE;
    intensity += BRIGHTNESS / abs(uv.x);
  }
  return intensity;
}

vec3 scene(vec2 uv) {
  vec3 color = vec3(0.0);
  vec2 rotated_uv = vec2(uv.y, uv.x);
  for (float i = 0.0; i < WAVE_COUNT; i++) {
    int colorChannel = int(mod(i, 3.0));
    vec2 channel_uv = rotated_uv + vec2(0.0, i * COLOR_SEPARATION);
    color[colorChannel] += pattern(channel_uv);
  }
  return color;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
  vec3 color = scene(uv);
  fragColor = vec4(color, 1.0);
}`;

/**
 * "Ramificações espaciais" — cosmic filaments for the inner pages. Ridged
 * multifractal noise (the ridges read as glowing branches) with domain warping
 * so the filaments curl and drift. Recolored past the single-accent identity
 * into a fuller cosmic palette for extra color. Same `time` / `resolution`
 * uniforms as the other fields.
 */
export const BRANCHES_FRAG = `#version 300 es
precision highp float;
uniform float time;
uniform vec2 resolution;
out vec4 fragColor;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// ridged multifractal — the sharp ridges look like branching filaments
float ridged(vec2 p) {
  float sum = 0.0, amp = 0.5, freq = 1.0;
  for (int i = 0; i < 3; i++) {
    float n = vnoise(p * freq);
    n = 1.0 - abs(n * 2.0 - 1.0);
    n *= n;
    sum += n * amp;
    freq *= 2.0;
    amp *= 0.5;
  }
  return sum;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
  float t = time * 0.04;

  // domain warp so the branches curl and flow
  vec2 q = uv * 1.7;
  vec2 warp = vec2(ridged(q + vec2(0.0, t)), ridged(q + vec2(5.2, -t * 0.8)));
  float branch = ridged(q + warp * 0.9 + vec2(-t * 0.6, t * 0.3));
  branch = pow(clamp(branch, 0.0, 1.0), 1.4);  // lower exponent -> more of it lights up

  // cosmic palette anchored on the indigo identity, branching into color
  vec3 base    = vec3(0.055, 0.060, 0.150);  // dark indigo, never pure black -> keeps hue
  vec3 indigo  = vec3(0.357, 0.424, 1.000);
  vec3 violet  = vec3(0.620, 0.320, 1.000);
  vec3 magenta = vec3(1.000, 0.300, 0.680);
  vec3 cyan    = vec3(0.300, 0.920, 1.000);

  vec3 col = mix(base, indigo, smoothstep(0.04, 0.42, branch));
  col = mix(col, violet, smoothstep(0.35, 0.80, branch));
  col += magenta * pow(branch, 2.4) * 0.8;
  col += cyan * pow(max(branch - 0.55, 0.0), 2.0) * 1.4;  // hot filament cores
  col += indigo * 0.10;                                   // ambient color lift

  // sparse static star dust
  float star = hash21(floor(uv * 900.0));
  col += vec3(step(0.9992, star)) * 0.6;

  col = col / (1.0 + col);  // tonemap
  col *= 1.12;

  fragColor = vec4(col, 1.0);
}`;

const FRAG_SRC = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
#define FC gl_FragCoord.xy
#define R resolution
#define T time
#define MN min(R.x,R.y)

float pattern(vec2 uv){
  float d = 0.0;
  for (float i = 0.0; i < 3.0; i++) {
    uv.x += sin(T*(1.0+i) + uv.y*1.5) * 0.2;
    d += 0.0032 / abs(uv.x);
  }
  return d;
}

float scene(vec2 uv){
  uv = vec2(atan(uv.x, uv.y) * 2.0 / 6.28318, -log(length(uv)) + T*0.28);
  float d = 0.0;
  for (float i = 0.0; i < 3.0; i++) {
    d += pattern(uv + i*6.0/MN);
  }
  return d;
}

void main(){
  vec2 uv = (FC - 0.5*R) / MN;
  uv.y += R.x > R.y ? 0.5 : 0.5*(R.y/R.x);

  float g = scene(uv);

  // in-palette: indigo #5B6CFF -> soft violet
  vec3 accent = vec3(0.357, 0.424, 1.0);
  vec3 violet = vec3(0.545, 0.400, 1.0);
  vec3 col = mix(accent, violet, clamp(g*0.5, 0.0, 1.0)) * g;

  // faint fine grid glow, kept subtle and in-accent
  float s = 12.0, e = 5e-4;
  col += (e / abs(sin(uv.x*s) * cos(uv.y*s))) * accent;

  // tonemap so highlights don't blow out to white; keep it calm
  col = col / (1.0 + col);
  col *= 0.85;

  O = vec4(col, 1.0);
}`;

function compile(gl: WebGL2RenderingContext, src: string, type: number) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh) || "shader error";
    gl.deleteShader(sh);
    throw new Error(info);
  }
  return sh;
}

export function ShaderField({
  className,
  frag = FRAG_SRC,
}: {
  className?: string;
  /** Fragment shader source. Must expose `time` + `resolution` uniforms. */
  frag?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", { alpha: true, antialias: true });
    if (!gl) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let program: WebGLProgram;
    try {
      const v = compile(gl, VERT_SRC, gl.VERTEX_SHADER);
      const f = compile(gl, frag, gl.FRAGMENT_SHADER);
      program = gl.createProgram()!;
      gl.attachShader(program, v);
      gl.attachShader(program, f);
      gl.linkProgram(program);
      gl.deleteShader(v);
      gl.deleteShader(f);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "link error");
      }
    } catch (err) {
      console.error("[ShaderField]", err);
      return;
    }

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
    );

    gl.useProgram(program);
    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "time");
    const uRes = gl.getUniformLocation(program, "resolution");
    gl.clearColor(0.031, 0.031, 0.039, 1);

    const fit = () => {
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 1.4));
      const rect = canvas.getBoundingClientRect();
      const w = Math.floor(Math.max(1, rect.width) * dpr);
      const h = Math.floor(Math.max(1, rect.height) * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    fit();

    const ro = new ResizeObserver(fit);
    ro.observe(canvas);

    let raf = 0;
    let running = true;

    const draw = (t: number) => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    if (prefersReducedMotion) {
      // single pleasant static frame, no animation loop
      draw(8.0);
    } else {
      // throttle to ~30fps — these ambient fields don't need 60, and it halves
      // the GPU work when several are on screen
      const FRAME_MS = 1000 / 30;
      let last = -Infinity;
      const loop = (now: number) => {
        if (!running) return;
        raf = requestAnimationFrame(loop);
        if (now - last < FRAME_MS) return;
        last = now;
        draw(now * 1e-3);
      };
      raf = requestAnimationFrame(loop);

      // pause the loop when the hero is scrolled out of view
      const io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !running) {
            running = true;
            raf = requestAnimationFrame(loop);
          } else if (!entry.isIntersecting && running) {
            running = false;
            cancelAnimationFrame(raf);
          }
        },
        { threshold: 0 },
      );
      io.observe(canvas);

      return () => {
        running = false;
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        gl.deleteBuffer(buf);
        gl.deleteProgram(program);
      };
    }

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
  }, [frag]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
