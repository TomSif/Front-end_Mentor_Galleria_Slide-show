export function getCorrectPath(name: string): string {
  return name.toLowerCase().replaceAll(" ", "-");
}
