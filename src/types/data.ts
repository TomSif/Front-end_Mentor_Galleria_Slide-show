export interface Artist {
  image: string;
  name: string;
}

export interface Hero {
  small: string;
  large: string;
}

export interface Images {
  thumbnail: string;
  hero: Hero;
  gallery: string;
}

export interface GalerieData {
  name: string;
  year: number;
  description: string;
  source: string;
  artist: Artist;
  images: Images;
}
