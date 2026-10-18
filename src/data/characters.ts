import { CharacterConfig, VehicleConfig } from '../types/game';

export const CHARACTERS: CharacterConfig[] = [
  {
    id: 'mario',
    name: 'Mario',
    nameAr: 'ماريو',
    color: '#FF0000',
    accentColor: '#CC0000',
    hatColor: '#E52521',
    overallsColor: '#002688',
    icon: '🔴',
    catchphrase: "Let's-a go! Wahoo!"
  },
  {
    id: 'luigi',
    name: 'Luigi',
    nameAr: 'لويجي',
    color: '#00B020',
    accentColor: '#008518',
    hatColor: '#00B020',
    overallsColor: '#002688',
    icon: '🟢',
    catchphrase: "Luigi time! Oh yeah!"
  },
  {
    id: 'yoshi',
    name: 'Yoshi',
    nameAr: 'يوشي',
    color: '#2ECC71',
    accentColor: '#27AE60',
    hatColor: '#2ECC71',
    overallsColor: '#E67E22',
    icon: '🦖',
    catchphrase: "Yoshi! Yum yum!"
  },
  {
    id: 'toad',
    name: 'Toad',
    nameAr: 'تود',
    color: '#FFC800',
    accentColor: '#E67E22',
    hatColor: '#FFFFFF',
    overallsColor: '#E74C3C',
    icon: '🍄',
    catchphrase: "Ready for adventure!"
  },
  {
    id: 'peach',
    name: 'Princess Peach',
    nameAr: 'الأميرة بيتش',
    color: '#FF69B4',
    accentColor: '#FF1493',
    hatColor: '#FFD700',
    overallsColor: '#FF69B4',
    icon: '👑',
    catchphrase: "Peachy keen! Let's win!"
  },
  {
    id: 'rosalina',
    name: 'Rosalina',
    nameAr: 'روزالينا',
    color: '#00CED1',
    accentColor: '#008B8B',
    hatColor: '#E0FFFF',
    overallsColor: '#00CED1',
    icon: '✨',
    catchphrase: "May the stars guide you!"
  }
];

export const VEHICLES: VehicleConfig[] = [
  {
    id: 'walk',
    name: 'Super Sneakers',
    nameAr: 'حذاء الجري السريع',
    icon: '👟',
    speedMultiplier: 1.0,
    jumpMultiplier: 1.0,
    unlockUnitReq: 0,
    description: 'Classic running shoes for swift jumping.'
  },
  {
    id: 'scooter',
    name: 'Nitro Scooter',
    nameAr: 'سكوتر النيترو',
    icon: '🛴',
    speedMultiplier: 1.25,
    jumpMultiplier: 1.1,
    unlockUnitReq: 1,
    description: 'Fast two-wheeler with great agility.'
  },
  {
    id: 'bicycle',
    name: 'BMX Star Bike',
    nameAr: 'دراجة النجوم',
    icon: '🚲',
    speedMultiplier: 1.45,
    jumpMultiplier: 1.15,
    unlockUnitReq: 2,
    description: 'Pedal powered machine with high jumping bunny hops!'
  },
  {
    id: 'skateboard',
    name: 'Turbo Skateboard',
    nameAr: 'لوح التزلج التوربو',
    icon: '🛹',
    speedMultiplier: 1.6,
    jumpMultiplier: 1.25,
    unlockUnitReq: 3,
    description: 'Kick-flip over obstacles in style.'
  },
  {
    id: 'motorcycle',
    name: 'Mushroom Racer Bike',
    nameAr: 'موتوسيكل المشروم',
    icon: '🏍️',
    speedMultiplier: 1.85,
    jumpMultiplier: 1.3,
    unlockUnitReq: 4,
    description: 'Revving engine with huge boost ramps!'
  },
  {
    id: 'gokart',
    name: 'Super Go-Kart',
    nameAr: 'سيارة جو كارت',
    icon: '🏎️',
    speedMultiplier: 2.1,
    jumpMultiplier: 1.35,
    unlockUnitReq: 5,
    description: 'Classic Mario Kart chassis for high-speed drifting.'
  },
  {
    id: 'sportscar',
    name: 'Flame GT Racer',
    nameAr: 'السيارة الرياضية النارية',
    icon: '🚗',
    speedMultiplier: 2.35,
    jumpMultiplier: 1.4,
    unlockUnitReq: 6,
    description: 'Aerodynamic sportscar with nitro exhaust.'
  },
  {
    id: 'cloud',
    name: 'Lakitu Flying Cloud',
    nameAr: 'سحابة لاكيتو الطائرة',
    icon: '☁️',
    speedMultiplier: 2.65,
    jumpMultiplier: 1.6,
    unlockUnitReq: 7,
    description: 'Glide effortlessly through the air with floating power!'
  },
  {
    id: 'saucer',
    name: 'Cosmic Star Saucer',
    nameAr: 'الصحن الفضائي النجمي',
    icon: '🛸',
    speedMultiplier: 3.0,
    jumpMultiplier: 1.8,
    unlockUnitReq: 8,
    description: 'Anti-gravity cruiser from the distant galaxies.'
  },
  {
    id: 'rocket',
    name: 'Hyper Golden Rocket',
    nameAr: 'الصاروخ الذهبي الخارق',
    icon: '🚀',
    speedMultiplier: 3.5,
    jumpMultiplier: 2.0,
    unlockUnitReq: 9,
    description: 'Ultimate speed machine! Rockets over any obstacle!'
  }
];
