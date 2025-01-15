export enum SeriesType {
  BO2 = 'BO2',
  BO3 = 'BO3',
  BO5 = 'BO5',
  BO7 = 'BO7'
}

export enum SeasonType {
  Preseason = 'Preseason',
  RegularSeason = 'Regular Season'
}

export namespace Roles {
  export enum General {
    TeamCaptain = 'Team Captain',
    Flex = 'Flex'
  }

  export enum VALO {
    Controller = 'Controller',
    Duelist = 'Duelist',
    Initiator = 'Initiator',
    Sentinel = 'Sentinel'
  }

  export enum MLBB {
    GoldLaner = 'Gold Laner',
    EXPLaner = 'EXP Laner',
    Roam = 'Roam',
    Jungler = 'Jungler',
    MidLaner = 'Mid Laner'
  }

  export enum MLBB_HEROES {
    Assassin = 'Assassin',
    Fighter = 'Fighter',
    Mage = 'Mage',
    Marksman = 'Marksman',
    Support = 'Support',
    Tank = 'Tank'
  }
}
