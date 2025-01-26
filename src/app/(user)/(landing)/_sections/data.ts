import logo_smartlive from '@/../../public/logos/smart-live.webp';
import logo_youtube from '@/../../public/logos/youtube.webp';
import logo_facebook from '@/../../public/logos/facebook.webp';
import about_1 from '@/../../public/images/about_1.webp';
import about_2 from '@/../../public/images/about_2.webp';
import about_3 from '@/../../public/images/about_3.webp';

export interface LogoLinks {
  text: string;
  logo: any;
  href: string;
}

export const LiveChannels: LogoLinks[] = [
  {
    text: 'Facebook',
    logo: logo_facebook,
    href: 'https://www.facebook.com/@CesafiEsportsLeague'
  },
  {
    text: 'Youtube',
    logo: logo_youtube,
    href: 'https://www.youtube.com/@cesafiesportsleague'
  },
  {
    text: 'Smart Sports',
    logo: logo_smartlive,
    href: 'https://www.facebook.com/SmartSportsPH'
  },
  {
    text: 'Smart Live App',
    logo: logo_smartlive,
    href: 'https://gigaplay.smart/home'
  },
  {
    text: 'Puso Pilipinas',
    logo: logo_smartlive,
    href: 'https://www.facebook.com/pusopilipinas'
  }
];

// Stat Information
export const StatInformation = [
  { heading: '12M+', desc: 'Reach' },
  { heading: '1000+', desc: 'Student Athletes' },
  { heading: '300+', desc: 'Student Volunteers' }
];

// About Us Data
export const AboutUsData = [
  {
    image: about_1,
    imageDesc: 'Season 1 Opening',
    title: 'Humble Beginnings',
    paragraph: `The Cebu Schools Athletic Foundation, Inc. (CESAFI) Esports
                    League (CEL) officially inaugurated back in December 2022
                    after three years of preparation. With the support of CESAFI
                    commissioner Felix Tiukinhoy Jr., and the initiative of now
                    CESAFI Executive Director Ryan Balbuena, the league has become
                    the premier collegiate esports competition in Cebu.`
  },
  {
    image: about_2,
    imageDesc: 'Preseason 3 Champion Trophy',
    title: 'Forging Legends',
    paragraph: `As a collegiate esports competition, the league is more than a
                  platform for esports student-athletes to showcase their skills,
                  the league has taken steps to ensure that the players are
                  responsible in-game and in their studies. Student-athletes
                  maintain a balanced school-work ethic to be able to compete in
                  the league; forging legends in-game without compromising
                  academic responsibilities.`
  },
  {
    image: about_3,
    imageDesc: 'Preseason 3 Finale Preparation',
    title: 'For students, by students',
    paragraph: `The organization started as and maintains itself in being a
                    student-led esports community, where student volunteers are
                    operating each department. The league is not
                    only a platform for student-athletes to test their skills but
                    also a platform for student volunteers to develop their skills
                    in esports production, including esports broadcasting and
                    organizing esports events. `
  }
];
