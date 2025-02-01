export interface NavigationLink {
  text: string;
  href: string;
}

export const defaultNavLinks: NavigationLink[] = [
  { text: 'Home', href: '/' },
  // { text: 'News', href: '/news' },
  { text: 'Schedule', href: '/schedule' },
  { text: 'Statistics', href: '/statistics' },
  { text: 'Standings', href: '/standings' },
  { text: 'Contact', href: '/contact' }
];
