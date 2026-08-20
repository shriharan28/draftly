/** Join class names; falsy values skipped. Our tiny zero-dependency `cn`. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
