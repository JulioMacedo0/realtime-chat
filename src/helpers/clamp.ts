type Clamp = {
  val: number;
  min: number;
  max: number;
};

export function clamp({ val, min, max }: Clamp) {
  return Math.min(Math.max(val, min), max);
}
