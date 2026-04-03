/**
 * Distribue des items dans N colonnes de hauteur égale via backtracking.
 *
 * Pour chaque item, essaie d'abord sa colonne round-robin (index % cols),
 * puis les autres colonnes. Élague dès qu'une colonne dépasserait la cible,
 * et revient en arrière si bloqué.
 *
 * Cela garantit un ordre de lecture gauche→droite tout en équilibrant
 * parfaitement les hauteurs de colonnes.
 *
 * Fallback : si aucune partition parfaite n'existe (ex: données dynamiques),
 * retourne un round-robin classique.
 */

export default function solveMasonry<T>(
  items: T[],
  getHeight: (item: T) => number,
  cols: number,
  gap: number,
): T[][] {
  const totalHeight = items.reduce((sum, item) => sum + getHeight(item), 0);
  const totalGaps = gap * (items.length - cols);
  const target = (totalHeight + totalGaps) / cols;

  const columns: T[][] = Array.from({ length: cols }, () => []);
  const colHeights = new Array(cols).fill(0);
  let found = false;

  function solve(index: number) {
    if (found) return;

    if (index === items.length) {
      if (colHeights.every((h) => Math.abs(h - target) < 1)) {
        found = true;
      }
      return;
    }

    const item = items[index];
    const height = getHeight(item);

    // Essayer d'abord la colonne round-robin, puis les autres
    const rrCol = index % cols;
    const tryOrder = [
      rrCol,
      ...Array.from({ length: cols }, (_, i) => i).filter((c) => c !== rrCol),
    ];

    for (const c of tryOrder) {
      const newHeight =
        colHeights[c] + height + (columns[c].length > 0 ? gap : 0);

      if (newHeight > target + 0.5) continue;

      columns[c].push(item);
      colHeights[c] = newHeight;

      solve(index + 1);
      if (found) return;

      columns[c].pop();
      colHeights[c] -= height + (columns[c].length > 0 ? gap : 0);
    }
  }

  solve(0);

  // Fallback round-robin si pas de partition parfaite
  if (!found) {
    const fallback: T[][] = Array.from({ length: cols }, () => []);
    items.forEach((item, i) => {
      fallback[i % cols].push(item);
    });
    return fallback;
  }

  return columns;
}
