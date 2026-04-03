import { useState, useEffect } from "react";

/**
 * Retourne le nombre de colonnes selon la largeur d'écran.
 * < 40rem (640)  → 1 colonne
 * >= 40rem         → 2 colonnes
 * >= desktop       → 4 colonnes (à ajuster selon ta maquette)
 */

export default function useColumns() {
  const [cols, setCols] = useState(1);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width >= 1100) setCols(4);
      else if (width >= 640) setCols(2);
      else setCols(1);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cols;
}
