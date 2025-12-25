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
    features: string[];
    eventsCompleted: number;
    packagesAvailable: number;
    photographerAvatar: string;
    location: string;
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
      {
        title: 'Bronze Wedding',
        price: 5000,
        description: '6 hours coverage, 300 edited photos, 1 photographer',
        features: [
          '6 Hours Photography Coverage',
          'Free Initial Consultation',
          'Secure Cloud Backup (2-Years guaranteed)',
          '50 Premium Edits',
          'Drone Photography Available',
          '2 Handcrafted Photo Albums',
          'Professional Lighting Kit',
        ],
        eventsCompleted: 33,
        packagesAvailable: 4,
        photographerAvatar: '/avatar-anatar.png',
        location: 'Abossey-Okai, Accra',
      },
      {
        title: 'Silver Wedding',
        price: 8000,
        description: 'Full day, 500 photos, album, 2 photographers',
        features: [
          '10+ Hours Coverage',
          'Engagement Shoot Included',
          'Secure Cloud Backup (2-Years guaranteed)',
          '150 Premium Edits',
          'Drone Photography Included',
          '3 Handcrafted Photo Albums',
          'Professional Lighting Kit',
        ],
        eventsCompleted: 48,
        packagesAvailable: 3,
        photographerAvatar: '/avatar-anatar.png',
        location: 'Abossey-Okai, Accra',
      },
      {
        title: 'Gold Wedding',
        price: 12000,
        description: 'Full day + engagement shoot, cinematic highlights video',
        features: [
          'Full Day + Engagement Shoot',
          'Cinematic Highlights Video',
          'Secure Cloud Backup (2-Years guaranteed)',
          '300 Premium Edits',
          'Drone Photography Included',
          '4 Handcrafted Photo Albums',
          'Professional Lighting & Studio Kit',
        ],
        eventsCompleted: 72,
        packagesAvailable: 2,
        photographerAvatar: '/avatar-anatar.png',
        location: 'Abossey-Okai, Accra',
      },
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
      {
        title: 'Bronze Wedding',
        price: 5000,
        description: '6 hours coverage, 300 edited photos, 1 photographer',
        features: [
          '6 Hours Photography Coverage',
          'Free Initial Consultation',
          'Secure Cloud Backup (2-Years guaranteed)',
          '50 Premium Edits',
          'Drone Photography Available',
          '2 Handcrafted Photo Albums',
          'Professional Lighting Kit',
        ],
        eventsCompleted: 33,
        packagesAvailable: 4,
        photographerAvatar: '/avatar-anatar.png',
        location: 'Abossey-Okai, Accra',
      },
      {
        title: 'Silver Wedding',
        price: 8000,
        description: 'Full day, 500 photos, album, 2 photographers',
        features: [
          '10+ Hours Coverage',
          'Engagement Shoot Included',
          'Secure Cloud Backup (2-Years guaranteed)',
          '150 Premium Edits',
          'Drone Photography Included',
          '3 Handcrafted Photo Albums',
          'Professional Lighting Kit',
        ],
        eventsCompleted: 48,
        packagesAvailable: 3,
        photographerAvatar: '/avatar-anatar.png',
        location: 'Abossey-Okai, Accra',
      },
      {
        title: 'Gold Wedding',
        price: 12000,
        description: 'Full day + engagement shoot, cinematic highlights video',
        features: [
          'Full Day + Engagement Shoot',
          'Cinematic Highlights Video',
          'Secure Cloud Backup (2-Years guaranteed)',
          '300 Premium Edits',
          'Drone Photography Included',
          '4 Handcrafted Photo Albums',
          'Professional Lighting & Studio Kit',
        ],
        eventsCompleted: 72,
        packagesAvailable: 2,
        photographerAvatar: '/avatar-anatar.png',
        location: 'Abossey-Okai, Accra',
      },
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
      {
        title: 'Bronze Wedding',
        price: 5000,
        description: '6 hours coverage, 300 edited photos, 1 photographer',
        features: [
          '6 Hours Photography Coverage',
          'Free Initial Consultation',
          'Secure Cloud Backup (2-Years guaranteed)',
          '50 Premium Edits',
          'Drone Photography Available',
          '2 Handcrafted Photo Albums',
          'Professional Lighting Kit',
        ],
        eventsCompleted: 33,
        packagesAvailable: 4,
        photographerAvatar: '/avatar-anatar.png',
        location: 'Abossey-Okai, Accra',
      },
      {
        title: 'Silver Wedding',
        price: 8000,
        description: 'Full day, 500 photos, album, 2 photographers',
        features: [
          '10+ Hours Coverage',
          'Engagement Shoot Included',
          'Secure Cloud Backup (2-Years guaranteed)',
          '150 Premium Edits',
          'Drone Photography Included',
          '3 Handcrafted Photo Albums',
          'Professional Lighting Kit',
        ],
        eventsCompleted: 48,
        packagesAvailable: 3,
        photographerAvatar: '/avatar-anatar.png',
        location: 'Abossey-Okai, Accra',
      },
      {
        title: 'Gold Wedding',
        price: 12000,
        description: 'Full day + engagement shoot, cinematic highlights video',
        features: [
          'Full Day + Engagement Shoot',
          'Cinematic Highlights Video',
          'Secure Cloud Backup (2-Years guaranteed)',
          '300 Premium Edits',
          'Drone Photography Included',
          '4 Handcrafted Photo Albums',
          'Professional Lighting & Studio Kit',
        ],
        eventsCompleted: 72,
        packagesAvailable: 2,
        photographerAvatar: '/avatar-anatar.png',
        location: 'Abossey-Okai, Accra',
      },
    ],
  },
  // Add more photographers here later
];