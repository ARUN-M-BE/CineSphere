import { Movie } from './types';

export const MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Interstellar Horizons',
    genre: ['Sci-Fi', 'Adventure'],
    rating: 4.8,
    duration: '2h 45m',
    posterUrl: 'https://picsum.photos/seed/interstellar/400/600',
    backdropUrl: 'https://picsum.photos/seed/interstellar-bg/1200/600',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    isPremiere: true,
    tags: ['IMAX', 'Dolby Atmos']
  },
  {
    id: '2',
    title: 'The Last Duelist',
    genre: ['Action', 'History'],
    rating: 4.5,
    duration: '2h 12m',
    posterUrl: 'https://picsum.photos/seed/duel/400/600',
    backdropUrl: 'https://picsum.photos/seed/duel-bg/1200/600',
    description: 'Two knights settle their differences in a battle that will determine the fate of the kingdom.',
    isPremiere: false,
    tags: ['Standard']
  },
  {
    id: '3',
    title: 'Neon Nights',
    genre: ['Thriller', 'Neo-Noir'],
    rating: 4.2,
    duration: '1h 55m',
    posterUrl: 'https://picsum.photos/seed/neon/400/600',
    backdropUrl: 'https://picsum.photos/seed/neon-bg/1200/600',
    description: 'In a city that never sleeps, a detective hunts a shadow from his past.',
    isPremiere: true,
    tags: ['4DX', 'Premiere']
  },
  {
    id: '4',
    title: 'Whispers of the Forest',
    genre: ['Fantasy', 'Animation'],
    rating: 4.9,
    duration: '1h 40m',
    posterUrl: 'https://picsum.photos/seed/forest/400/600',
    backdropUrl: 'https://picsum.photos/seed/forest-bg/1200/600',
    description: 'An ancient spirit awakens to protect the woods from industrial encroachment.',
    isPremiere: false,
    tags: ['Family', '3D']
  }
];
