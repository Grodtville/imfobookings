// src/lib/data.ts
export type Photographer = {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  coverImage: string;
  gallery: string[];
  packages: {
    title: string;
    price: number;
    description: string;
  }[];
};

export const photographers: Photographer[] = [
  {
    id: '1',
    name: 'Kwame Mensah',
    location: 'Accra, Greater Accra',
    rating: 5.0,
    reviews: 42,
    coverImage: '/cover-1.png',
    gallery: Array.from({ length: 6 }, (_, i) => `/gallery-${i + 1}.png`),
    packages: [
      { title: 'Bronze Wedding', price: 5000, description: '6 hours coverage, 300 edited photos, 1 photographer' },
      { title: 'Silver Wedding', price: 8000, description: 'Full day, 500 photos, album, 2 photographers' },
      { title: 'Gold Wedding', price: 12000, description: 'Full day + engagement shoot, cinematic highlights video' },
    ],
    },
    {
    id: '2',
    name: 'Awuku Photos',
    location: 'Accra, Greater Accra',
    rating: 5.0,
    reviews: 42,
    coverImage: '/cover-1.png',
    gallery: Array.from({ length: 6 }, (_, i) => `/gallery-${i + 1}.png`),
    packages: [
      { title: 'Bronze Wedding', price: 5000, description: '6 hours coverage, 300 edited photos, 1 photographer' },
      { title: 'Silver Wedding', price: 8000, description: 'Full day, 500 photos, album, 2 photographers' },
      { title: 'Gold Wedding', price: 12000, description: 'Full day + engagement shoot, cinematic highlights video' },
    ],
    },
    {
    id: '3',
    name: 'Jaylen Photos',
    location: 'Accra, Greater Accra',
    rating: 5.0,
    reviews: 42,
    coverImage: '/cover-1.png',
    gallery: Array.from({ length: 6 }, (_, i) => `/gallery-${i + 1}.png`),
    packages: [
      { title: 'Bronze Wedding', price: 5000, description: '6 hours coverage, 300 edited photos, 1 photographer' },
      { title: 'Silver Wedding', price: 8000, description: 'Full day, 500 photos, album, 2 photographers' },
      { title: 'Gold Wedding', price: 12000, description: 'Full day + engagement shoot, cinematic highlights video' },
    ],
  },
  // Add more photographers here later
];