export type SubjectCode = 'MAT' | 'ENG' | 'SCI' | 'HIS' | 'GEO' | 'ART';

export type CharacterId = 'mario' | 'luigi' | 'yoshi' | 'toad' | 'peach' | 'rosalina';

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  nameAr: string;
  color: string;
  accentColor: string;
  hatColor: string;
  overallsColor: string;
  icon: string;
  catchphrase: string;
}

export interface VehicleConfig {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  speedMultiplier: number;
  jumpMultiplier: number;
  unlockUnitReq: number;
  description: string;
}

export type InteractiveWidgetType =
  | 'standard'
  | 'cubes'
  | 'number-line'
  | 'clock'
  | 'fraction'
  | 'color-mixer'
  | 'phonics-tiles'
  | 'material-tester'
  | 'compass';

export interface Question {
  id: string;
  question: string;
  questionAr?: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  hintAr?: string;
  explanation: string;
  explanationAr?: string;
  interactiveType?: InteractiveWidgetType;
  interactiveData?: any;
}

export interface Lesson {
  id: string;
  subject: SubjectCode;
  unitId: string;
  unitNumber: number;
  lessonNumber: number;
  title: string;
  titleAr?: string;
  objective: string;
  explanation: string;
  questions: Question[];
  xp: number;
  coins: number;
}

export interface Unit {
  id: string;
  subject: SubjectCode;
  number: number;
  title: string;
  titleAr: string;
  icon: string;
  description: string;
  lessons: Lesson[];
  vehicleReward?: string;
}

export interface SubjectInfo {
  code: SubjectCode;
  name: string;
  nameAr: string;
  icon: string;
  color: string;
  bgGradient: string;
  description: string;
  units: Unit[];
}

export interface GameProfile {
  name: string;
  character: CharacterId;
  customColor?: string;
  level: number;
  xp: number;
  coins: number;
  stars: number;
  equippedVehicle: string;
  unlockedVehicles: string[];
  currentSubject: SubjectCode;
  currentUnitId: string;
}

export interface GameProgress {
  lessonsCompleted: Record<string, boolean>;
  unitsCompleted: Record<string, boolean>;
  subjectsCompleted: Record<string, boolean>;
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  streak: number;
  highScore: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  voiceRate: number;
  language: 'en' | 'bilingual';
  musicVolume: number;
  sfxVolume: number;
}

export interface GameState {
  profile: GameProfile;
  progress: GameProgress;
  settings: GameSettings;
}
