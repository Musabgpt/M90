import { SubjectInfo, Question, Lesson, Unit, SubjectCode } from '../types/game';

// Helper to assemble question with proper validation
function createQuestion(q: {
  id: string;
  question: string;
  questionAr?: string;
  options: string[];
  correctAnswer: string;
  hint: string;
  hintAr?: string;
  explanation: string;
  explanationAr?: string;
  interactiveType?: 'standard' | 'cubes' | 'number-line' | 'clock' | 'fraction' | 'color-mixer' | 'phonics-tiles' | 'material-tester' | 'compass';
  interactiveData?: any;
}): Question {
  return {
    ...q,
    interactiveType: q.interactiveType || 'standard'
  };
}

export const SUBJECTS_DATA: SubjectInfo[] = [
  // ==========================================
  // MATHEMATICS (MAT)
  // ==========================================
  {
    code: 'MAT',
    name: 'Mathematics',
    nameAr: 'الرياضيات',
    icon: '🔢',
    color: '#FF5722',
    bgGradient: 'from-orange-500 to-amber-600',
    description: 'Number bonds, multiplication, fractions, analog time, geometry & problem solving.',
    units: [
      {
        id: 'MAT-U1',
        subject: 'MAT',
        number: 1,
        title: 'Skip Counting (2s, 5s, 10s, 3s)',
        titleAr: 'العد القفزي (2، 5، 10، 3)',
        icon: '🦘',
        description: 'Master skip counting patterns, multiples, and odd/even numbers.',
        lessons: [
          {
            id: 'MAT-U1-L1',
            subject: 'MAT',
            unitId: 'MAT-U1',
            unitNumber: 1,
            lessonNumber: 1,
            title: 'Counting in 2s (Pairs & Socks)',
            titleAr: 'العد بـ 2 (أزواج وأحذية)',
            objective: 'Count forward and backward in steps of 2 from any number.',
            explanation: 'When counting in 2s, we add 2 each time: 2, 4, 6, 8, 10, 12! Even numbers always end in 0, 2, 4, 6, or 8.',
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'MAT-U1-L1-Q1',
                question: 'Count on in 2s: 2, 4, 6, 8, __. What comes next?',
                questionAr: 'عد قفزياً باثنين: 2، 4، 6، 8، __. ما الرقم التالي؟',
                options: ['10', '9', '11', '12'],
                correctAnswer: '10',
                hint: 'Add 2 to the number 8.',
                hintAr: 'أضف 2 إلى الرقم 8.',
                explanation: '8 + 2 = 10. Counting in 2s goes: 2, 4, 6, 8, 10!',
                explanationAr: '8 + 2 = 10. العد باثنين: 2، 4، 6، 8، 10!',
                interactiveType: 'number-line',
                interactiveData: { min: 0, max: 12, step: 2, current: 8, target: 10 }
              }),
              createQuestion({
                id: 'MAT-U1-L1-Q2',
                question: 'There are 5 pairs of socks. How many socks in total?',
                questionAr: 'هناك 5 أزواج من الجوارب. كم جورباً في المجموع؟',
                options: ['10 socks', '8 socks', '12 socks', '7 socks'],
                correctAnswer: '10 socks',
                hint: 'Each pair has 2 socks. Count in 2s five times: 2, 4, 6, 8, 10.',
                hintAr: 'كل زوج به فردتان. عد باثنين 5 مرات.',
                explanation: '5 pairs × 2 socks = 10 socks in total.',
                explanationAr: '5 أزواج × 2 = 10 جوارب.',
                interactiveType: 'cubes',
                interactiveData: { countA: 5, multiplier: 2, label: 'Pair of socks' }
              }),
              createQuestion({
                id: 'MAT-U1-L1-Q3',
                question: 'Which of these numbers is an EVEN number?',
                questionAr: 'أي من هذه الأرقام هو عدد زوجي؟',
                options: ['16', '13', '15', '19'],
                correctAnswer: '16',
                hint: 'Even numbers end in 0, 2, 4, 6, or 8 and can be split into 2 equal teams.',
                hintAr: 'الأعداد الزوجية تنتهي بـ 0، 2، 4، 6، أو 8.',
                explanation: '16 ends in 6, so it is even! 16 can be divided equally into 8 and 8.',
                explanationAr: '16 ينتهي بـ 6 فهو زوجي وينقسم لـ 8 و 8.'
              })
            ]
          },
          {
            id: 'MAT-U1-L2',
            subject: 'MAT',
            unitId: 'MAT-U1',
            unitNumber: 1,
            lessonNumber: 2,
            title: 'Counting in 5s (Fingers & 5p Coins)',
            titleAr: 'العد بـ 5 (الأصابع والعملات)',
            objective: 'Count in 5s up to 100.',
            explanation: 'Numbers in the 5 times table always end with a 0 or a 5! 5, 10, 15, 20, 25, 30...',
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'MAT-U1-L2-Q1',
                question: 'Count in 5s: 5, 10, 15, 20, __. What comes next?',
                questionAr: 'عد بالخمسات: 5، 10، 15، 20، __. ما الرقم التالي؟',
                options: ['25', '22', '30', '24'],
                correctAnswer: '25',
                hint: 'Add 5 to 20.',
                hintAr: 'أضف 5 إلى 20.',
                explanation: '20 + 5 = 25. The pattern is 5, 10, 15, 20, 25!',
                interactiveType: 'number-line',
                interactiveData: { min: 0, max: 30, step: 5, current: 20, target: 25 }
              }),
              createQuestion({
                id: 'MAT-U1-L2-Q2',
                question: 'How many fingers are on 4 hands? (5 fingers on each hand)',
                questionAr: 'كم إصبعاً في 4 أيادٍ؟ (5 أصابع في كل يد)',
                options: ['20 fingers', '15 fingers', '25 fingers', '18 fingers'],
                correctAnswer: '20 fingers',
                hint: 'Count in 5s four times: 5, 10, 15, 20.',
                explanation: '4 hands × 5 fingers = 20 fingers.',
                interactiveType: 'cubes',
                interactiveData: { countA: 4, multiplier: 5, label: 'Hand fingers' }
              })
            ]
          },
          {
            id: 'MAT-U1-L3',
            subject: 'MAT',
            unitId: 'MAT-U1',
            unitNumber: 1,
            lessonNumber: 3,
            title: 'Counting in 10s (Dimes & Base-10)',
            titleAr: 'العد بالعشرات (10، 20، 30...)',
            objective: 'Recognise the place value of each digit in a two-digit number.',
            explanation: 'Counting in 10s increases the tens digit by 1 while the ones digit stays 0: 10, 20, 30, 40, 50, 60, 70, 80, 90, 100!',
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'MAT-U1-L3-Q1',
                question: 'What is 10 more than 47?',
                questionAr: 'ما هو العدد الذي يزيد بمقدار 10 عن 47؟',
                options: ['57', '48', '37', '67'],
                correctAnswer: '57',
                hint: 'Add 1 to the tens digit (4 tens becomes 5 tens). The ones digit stays 7.',
                explanation: '47 + 10 = 57. The tens digit goes up from 4 to 5.'
              }),
              createQuestion({
                id: 'MAT-U1-L3-Q2',
                question: 'You have six 10p coins. How much money do you have in total?',
                questionAr: 'لديك ست عملات من فئة 10 بنسات. كم معك بالإجمالي؟',
                options: ['60p', '50p', '70p', '16p'],
                correctAnswer: '60p',
                hint: 'Count in 10s six times: 10, 20, 30, 40, 50, 60.',
                explanation: '6 × 10p = 60p.'
              })
            ]
          },
          {
            id: 'MAT-U1-L4',
            subject: 'MAT',
            unitId: 'MAT-U1',
            unitNumber: 1,
            lessonNumber: 4,
            title: 'Counting in 3s (Triangles & Wheels)',
            titleAr: 'العد بثلاثات (المثلثات والأشكال)',
            objective: 'Recall and use multiplication facts for the 3 times table.',
            explanation: 'Counting in 3s: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30. Think of triangles because every triangle has 3 sides!',
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'MAT-U1-L4-Q1',
                question: 'Count in 3s: 3, 6, 9, __. What is the missing number?',
                questionAr: 'عد بالثلاثات: 3، 6، 9، __. ما هو الرقم الناقص؟',
                options: ['12', '10', '11', '13'],
                correctAnswer: '12',
                hint: 'Add 3 to 9.',
                explanation: '9 + 3 = 12. The sequence is 3, 6, 9, 12, 15.'
              }),
              createQuestion({
                id: 'MAT-U1-L4-Q2',
                question: '4 tricycles are in the park. Each tricycle has 3 wheels. How many wheels altogether?',
                questionAr: '4 دراجات ثلاثية العجلات في الحديقة. كم عجلة بالمجموع؟',
                options: ['12 wheels', '10 wheels', '9 wheels', '14 wheels'],
                correctAnswer: '12 wheels',
                hint: '4 groups of 3 wheels: 3 + 3 + 3 + 3 = 12.',
                explanation: '4 × 3 = 12 wheels.'
              })
            ]
          }
        ]
      },
      // U2: Place Value
      {
        id: 'MAT-U2',
        subject: 'MAT',
        number: 2,
        title: 'Place Value & Partitioning',
        titleAr: 'القيمة المكانية والتحليل',
        icon: '🧱',
        description: 'Understand tens and ones, compare numbers using <, > and =.',
        lessons: [
          {
            id: 'MAT-U2-L1',
            subject: 'MAT',
            unitId: 'MAT-U2',
            unitNumber: 2,
            lessonNumber: 1,
            title: 'Tens and Ones Partitioning',
            titleAr: 'العشرات والآحاد',
            objective: 'Partition two-digit numbers into tens and ones.',
            explanation: 'In the number 54, the digit 5 stands for 5 tens (50) and the digit 4 stands for 4 ones (4). 50 + 4 = 54!',
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'MAT-U2-L1-Q1',
                question: 'Which shows 63 partitioned into tens and ones correctly?',
                questionAr: 'أي خيار يمثل تحليل 63 إلى عشرات وآحاد؟',
                options: ['60 + 3', '6 + 3', '60 + 30', '30 + 6'],
                correctAnswer: '60 + 3',
                hint: '6 tens is 60, and 3 ones is 3.',
                explanation: '63 is made up of 6 tens (60) and 3 ones (3): 60 + 3 = 63.',
                interactiveType: 'cubes',
                interactiveData: { countA: 6, countB: 3, label: 'Tens & Ones' }
              }),
              createQuestion({
                id: 'MAT-U2-L1-Q2',
                question: 'Which number has 7 tens and 4 ones?',
                questionAr: 'أي عدد يحتوي على 7 عشرات و 4 آحاد؟',
                options: ['74', '47', '704', '740'],
                correctAnswer: '74',
                hint: 'The tens digit goes first on the left, then the ones.',
                explanation: '7 tens = 70. 70 + 4 = 74.'
              })
            ]
          },
          {
            id: 'MAT-U2-L2',
            subject: 'MAT',
            unitId: 'MAT-U2',
            unitNumber: 2,
            lessonNumber: 2,
            title: 'Comparing Numbers (<, >, =)',
            titleAr: 'مقارنة الأعداد (أكبر وأصغر)',
            objective: 'Compare and order numbers from 0 up to 100.',
            explanation: 'The crocodile symbol always eats the bigger number! 58 > 39 because 5 tens is greater than 3 tens.',
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'MAT-U2-L2-Q1',
                question: 'Which symbol makes this true?  48 __ 84',
                questionAr: 'أي رمز يجعل المقارنة صحيحة؟ 48 __ 84',
                options: ['< (less than)', '> (greater than)', '= (equal to)', '+'],
                correctAnswer: '< (less than)',
                hint: 'Look at the tens: 4 tens is less than 8 tens.',
                explanation: '48 is less than 84, so 48 < 84.'
              }),
              createQuestion({
                id: 'MAT-U2-L2-Q2',
                question: 'Order these numbers from SMALLEST to GREATEST: 62, 19, 45',
                questionAr: 'رتب الأعداد من الأصغر إلى الأكبر: 62، 19، 45',
                options: ['19, 45, 62', '62, 45, 19', '19, 62, 45', '45, 19, 62'],
                correctAnswer: '19, 45, 62',
                hint: 'Check the tens: 19 has 1 ten, 45 has 4 tens, 62 has 6 tens.',
                explanation: '19 is smallest, then 45, then 62.'
              })
            ]
          }
        ]
      },
      // U3: Analog Time
      {
        id: 'MAT-U3',
        subject: 'MAT',
        number: 3,
        title: 'Telling Time on the Clock',
        titleAr: 'قراءة الوقت على الساعة',
        icon: '⏰',
        description: "Tell and write the time to o'clock, half past, quarter past and quarter to.",
        lessons: [
          {
            id: 'MAT-U3-L1',
            subject: 'MAT',
            unitId: 'MAT-U3',
            unitNumber: 3,
            lessonNumber: 1,
            title: "O'Clock and Half Past",
            titleAr: 'تمام الساعة والنصف',
            objective: "Tell time to o'clock and half past using analog clock faces.",
            explanation: "Short hand points to the HOUR. Long hand points to the MINUTES. When the minute hand points straight up at 12, it is o'clock. When it points at 6, it is half past!",
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'MAT-U3-L1-Q1',
                question: 'The long hand points to 6 and the short hand is halfway between 3 and 4. What time is it?',
                questionAr: 'عقرب الدقائق يشير إلى 6 وعقرب الساعات بين 3 و 4. ما الوقت؟',
                options: ['Half past 3', "3 o'clock", 'Half past 4', 'Quarter past 3'],
                correctAnswer: 'Half past 3',
                hint: 'Hand on 6 means half past (30 minutes past). It has passed 3.',
                explanation: 'The time is half past 3 (3:30).',
                interactiveType: 'clock',
                interactiveData: { hour: 3, minute: 30 }
              }),
              createQuestion({
                id: 'MAT-U3-L1-Q2',
                question: 'How many minutes are in one whole hour?',
                questionAr: 'كم دقيقة في الساعة الكاملة؟',
                options: ['60 minutes', '30 minutes', '100 minutes', '24 minutes'],
                correctAnswer: '60 minutes',
                hint: 'Each number on the clock represents 5 minutes. 12 × 5 = 60.',
                explanation: 'There are 60 minutes in 1 hour (and 30 minutes in half an hour).'
              })
            ]
          },
          {
            id: 'MAT-U3-L2',
            subject: 'MAT',
            unitId: 'MAT-U3',
            unitNumber: 3,
            lessonNumber: 2,
            title: 'Quarter Past & Quarter To',
            titleAr: 'وربع وإلا ربع',
            objective: 'Tell time to quarter past and quarter to the hour.',
            explanation: 'When the minute hand is at 3, a quarter of the hour has passed (15 mins past). When the minute hand is at 9, there is a quarter of an hour left until the next hour (15 mins to)!',
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'MAT-U3-L2-Q1',
                question: 'The minute hand points to 3 and the hour hand is just past 8. What time is it?',
                questionAr: 'عقرب الدقائق عند 3 وعقرب الساعات بعد 8 بقليل. ما الوقت؟',
                options: ['Quarter past 8 (8:15)', 'Quarter to 8 (7:45)', 'Half past 8', "8 o'clock"],
                correctAnswer: 'Quarter past 8 (8:15)',
                hint: 'Pointer on 3 means 15 minutes past the hour (quarter past).',
                explanation: 'It is quarter past 8 (8:15).',
                interactiveType: 'clock',
                interactiveData: { hour: 8, minute: 15 }
              }),
              createQuestion({
                id: 'MAT-U3-L2-Q2',
                question: 'The minute hand points to 9 and the hour hand is almost at 5. What time is it?',
                questionAr: 'عقرب الدقائق عند 9 وعقرب الساعات يقترب من 5. ما الوقت؟',
                options: ['Quarter to 5 (4:45)', 'Quarter past 5 (5:15)', 'Half past 4', "5 o'clock"],
                correctAnswer: 'Quarter to 5 (4:45)',
                hint: 'Minute hand on 9 means 15 minutes until the next hour.',
                explanation: 'It is quarter to 5 (4:45).',
                interactiveType: 'clock',
                interactiveData: { hour: 4, minute: 45 }
              })
            ]
          }
        ]
      },
      // U4: Fractions
      {
        id: 'MAT-U4',
        subject: 'MAT',
        number: 4,
        title: 'Fractions (1/2, 1/4, 1/3, 3/4)',
        titleAr: 'الكسور (نصف، ربع، ثلث)',
        icon: '🍕',
        description: 'Find fractions of shapes, lengths and quantities.',
        lessons: [
          {
            id: 'MAT-U4-L1',
            subject: 'MAT',
            unitId: 'MAT-U4',
            unitNumber: 4,
            lessonNumber: 1,
            title: 'Fractions of Shapes & Quantities',
            titleAr: 'كسور الأشكال والمجموعات',
            objective: 'Recognise, find, name and write fractions 1/3, 1/4, 2/4 and 3/4.',
            explanation: 'Fractions MUST be equal parts! 1/2 means 1 out of 2 equal parts. 1/4 means 1 out of 4 equal parts.',
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'MAT-U4-L1-Q1',
                question: 'What is 1/2 (half) of 16 cookies?',
                questionAr: 'ما هو نصف (1/2) 16 قطعة بسكويت؟',
                options: ['8', '6', '4', '10'],
                correctAnswer: '8',
                hint: 'Share 16 into 2 equal piles: 16 ÷ 2 = ?',
                explanation: 'Half of 16 is 8 because 8 + 8 = 16.',
                interactiveType: 'fraction',
                interactiveData: { denominator: 2, numerator: 1, total: 16 }
              }),
              createQuestion({
                id: 'MAT-U4-L1-Q2',
                question: 'A pizza is cut into 4 equal slices. You eat 3 slices. What fraction did you eat?',
                questionAr: 'بيتزا قُسمت إلى 4 قطع متساوية، أكلت منها 3. ما الكسر الذي أكلته؟',
                options: ['3/4 (three quarters)', '1/4 (one quarter)', '1/2 (one half)', '2/3 (two thirds)'],
                correctAnswer: '3/4 (three quarters)',
                hint: '3 pieces eaten out of 4 total pieces.',
                explanation: 'Eating 3 out of 4 equal slices is 3/4 (three quarters).',
                interactiveType: 'fraction',
                interactiveData: { denominator: 4, numerator: 3 }
              }),
              createQuestion({
                id: 'MAT-U4-L1-Q3',
                question: 'What is 1/4 of 20?',
                questionAr: 'ما هو ربع (1/4) العدد 20؟',
                options: ['5', '4', '10', '2'],
                correctAnswer: '5',
                hint: 'Half of 20 is 10. Half of 10 is 5.',
                explanation: 'To find 1/4, divide by 4. 20 ÷ 4 = 5.'
              })
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // ENGLISH (ENG)
  // ==========================================
  {
    code: 'ENG',
    name: 'English & Literacy',
    nameAr: 'اللغة الإنجليزية',
    icon: '📚',
    color: '#3B82F6',
    bgGradient: 'from-blue-500 to-indigo-600',
    description: 'Phonics digraphs, exception words, punctuation, conjunctions, and grammar.',
    units: [
      {
        id: 'ENG-U1',
        subject: 'ENG',
        number: 1,
        title: 'Phonics & Alternative Digraphs',
        titleAr: 'الصوتيات والتركيبات الصوتية',
        icon: '🗣️',
        description: 'Vowel digraphs: ai, ee, igh, oa, oo, ar, or, ur, ow, oi.',
        lessons: [
          {
            id: 'ENG-U1-L1',
            subject: 'ENG',
            unitId: 'ENG-U1',
            unitNumber: 1,
            lessonNumber: 1,
            title: 'Long Vowel /ai/ Sound (rain, train, snail)',
            titleAr: 'صوت /ai/ مثل rain و train',
            objective: 'Identify and spell words using the /ai/ vowel digraph.',
            explanation: "The two letters 'a' and 'i' join together to make one sound: /ai/ like in 'rain', 'wait', and 'snail'!",
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'ENG-U1-L1-Q1',
                question: "Which of these words has the /ai/ sound?",
                questionAr: "أي من هذه الكلمات تحتوي على صوت /ai/؟",
                options: ['train', 'tree', 'night', 'boat'],
                correctAnswer: 'train',
                hint: "Sound it out: t - r - ai - n.",
                explanation: "'train' uses the 'ai' digraph: t-r-ai-n. Tree has 'ee', night has 'igh', and boat has 'oa'.",
                interactiveType: 'phonics-tiles',
                interactiveData: { targetWord: 'train', sounds: ['t', 'r', 'ai', 'n'] }
              }),
              createQuestion({
                id: 'ENG-U1-L1-Q2',
                question: "Complete the sentence: 'The slow ___ leaves a silvery trail.'",
                questionAr: "أكمل الجملة بالكلمة الصحيحة التي تحتوي على ai:",
                options: ['snail', 'dog', 'frog', 'cat'],
                correctAnswer: 'snail',
                hint: "A creature with a shell that rhymes with 'trail' and 'tail'.",
                explanation: "'snail' (s-n-ai-l) has the 'ai' sound and leaves a shiny trail!"
              })
            ]
          },
          {
            id: 'ENG-U1-L2',
            subject: 'ENG',
            unitId: 'ENG-U1',
            unitNumber: 1,
            lessonNumber: 2,
            title: 'Long Vowel /ee/ and /igh/ Sounds',
            titleAr: 'أصوات /ee/ و /igh/',
            objective: 'Distinguish between /ee/ (tree, sleep) and /igh/ (light, bright).',
            explanation: "'ee' makes the long sound in 'tree', 'bee', and 'green'. 'igh' is a trigraph (3 letters, 1 sound) in 'bright', 'night', and 'flight'!",
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'ENG-U1-L2-Q1',
                question: "Which word rhymes with 'bright' and has the 'igh' trigraph?",
                questionAr: "أي كلمة تتناغم مع bright وبها صوت igh؟",
                options: ['light', 'late', 'boat', 'blue'],
                correctAnswer: 'light',
                hint: "L - igh - t. We turn it on when it is dark.",
                explanation: "'light' (l-igh-t) rhymes with 'bright' and uses 'igh'.",
                interactiveType: 'phonics-tiles',
                interactiveData: { targetWord: 'light', sounds: ['l', 'igh', 't'] }
              }),
              createQuestion({
                id: 'ENG-U1-L2-Q2',
                question: "Select the correctly spelt word:",
                questionAr: "اختر الكلمة المكتوبة بالتهجئة الصحيحة:",
                options: ['sleep', 'slep', 'slepe', 'slipe'],
                correctAnswer: 'sleep',
                hint: "It has the double 'e' digraph (s-l-ee-p).",
                explanation: "'sleep' is spelt with 'ee'."
              })
            ]
          }
        ]
      },
      // U2: Punctuation & Sentence Types
      {
        id: 'ENG-U2',
        subject: 'ENG',
        number: 2,
        title: 'Punctuation & Sentence Types',
        titleAr: 'علامات الترقيم وأنواع الجمل',
        icon: '✍️',
        description: 'Capital letters, full stops, question marks, and exclamation marks.',
        lessons: [
          {
            id: 'ENG-U2-L1',
            subject: 'ENG',
            unitId: 'ENG-U2',
            unitNumber: 2,
            lessonNumber: 1,
            title: 'Questions vs Exclamations',
            titleAr: 'أسئلة وتعجبات',
            objective: 'Select appropriate punctuation for questions (?) and exclamations (!).',
            explanation: 'Questions ask something and start with question words like Who, What, Where, When, Why, or How. Exclamations express strong emotion or surprise!',
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'ENG-U2-L1-Q1',
                question: "Which sentence needs a QUESTION MARK (?) at the end?",
                questionAr: "أي جملة تحتاج إلى علامة استفهام (؟) في نهايتها؟",
                options: [
                  'Where did you put my coat',
                  'The big red bus stopped',
                  'I love playing in the park',
                  'Look at that giant dinosaur'
                ],
                correctAnswer: 'Where did you put my coat',
                hint: "Look for the question word 'Where'.",
                explanation: "'Where did you put my coat?' is an inquiry, so it ends with a question mark."
              }),
              createQuestion({
                id: 'ENG-U2-L1-Q2',
                question: "Which word MUST begin with a capital letter because it is a PROPER NOUN?",
                questionAr: "أي كلمة يجب أن تبدأ بحرف كبير لأنها اسم علم؟",
                options: ['London', 'pencil', 'garden', 'happy'],
                correctAnswer: 'London',
                hint: "Names of cities, countries, days of the week, and people always take a capital letter.",
                explanation: "London is a proper noun (the capital of England), so it always starts with capital 'L'."
              })
            ]
          },
          {
            id: 'ENG-U2-L2',
            subject: 'ENG',
            unitId: 'ENG-U2',
            unitNumber: 2,
            lessonNumber: 2,
            title: 'Conjunctions (and, but, because, so)',
            titleAr: 'أدوات الربط (and, but, because)',
            objective: 'Use co-ordinating and subordinating conjunctions to join ideas.',
            explanation: "Conjunctions are joining words. 'Because' explains the reason why. 'But' shows a contrast or surprise.",
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'ENG-U2-L2-Q1',
                question: "Choose the best conjunction: 'We wore our raincoats ___ it was pouring with rain.'",
                questionAr: "اختر أداة الربط المناسبة للجملة:",
                options: ['because', 'but', 'or', 'so that'],
                correctAnswer: 'because',
                hint: "It gives the REASON why we put on our raincoats.",
                explanation: "'because' gives the reason: We wore raincoats because it was raining!"
              }),
              createQuestion({
                id: 'ENG-U2-L2-Q2',
                question: "Which word is an ADJECTIVE (describing word) in: 'The brave knight defeated the dragon'?",
                questionAr: "أي كلمة هي صفة (Adjective) في هذه الجملة؟",
                options: ['brave', 'knight', 'defeated', 'dragon'],
                correctAnswer: 'brave',
                hint: "Which word tells us what the knight was like?",
                explanation: "'brave' describes the noun 'knight', so it is an adjective."
              })
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // SCIENCE (SCI)
  // ==========================================
  {
    code: 'SCI',
    name: 'Science & Nature',
    nameAr: 'العلوم والطبيعة',
    icon: '🔬',
    color: '#10B981',
    bgGradient: 'from-emerald-500 to-teal-600',
    description: 'Living things, habitats, materials, plants, animals, and life processes.',
    units: [
      {
        id: 'SCI-U1',
        subject: 'SCI',
        number: 1,
        title: 'Living, Dead & Never Alive',
        titleAr: 'الكائنات الحية وغير الحية',
        icon: '🌱',
        description: 'Explore the 7 life processes (MRS GREN) and classify objects.',
        lessons: [
          {
            id: 'SCI-U1-L1',
            subject: 'SCI',
            unitId: 'SCI-U1',
            unitNumber: 1,
            lessonNumber: 1,
            title: 'The Seven Life Processes (MRS GREN)',
            titleAr: 'العمليات الحيوية السبع',
            objective: 'Identify things that are living, dead, and things that have never been alive.',
            explanation: 'Living things carry out 7 life processes: Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, and Nutrition (MRS GREN)!',
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'SCI-U1-L1-Q1',
                question: 'Which of the following is LIVING?',
                questionAr: 'أي من التالي كائن حي؟',
                options: ['An oak tree', 'A stone', 'A plastic toy car', 'A metal key'],
                correctAnswer: 'An oak tree',
                hint: 'It grows from an acorn, needs sunlight and water, and breathes.',
                explanation: 'Plants are living organisms! An oak tree grows, reproduces acorns, and needs nutrients and water.',
                interactiveType: 'standard'
              }),
              createQuestion({
                id: 'SCI-U1-L1-Q2',
                question: 'A fallen autumn leaf on the ground is classified as...',
                questionAr: 'ورقة الشجر الساقطة على الأرض تصنف كـ...',
                options: ['Dead (was once part of a living tree)', 'Never been alive', 'Living right now', 'A mineral'],
                correctAnswer: 'Dead (was once part of a living tree)',
                hint: 'It was once part of a living tree, but has now stopped growing and living.',
                explanation: 'A fallen leaf was once part of a living plant, so it is classified as dead (once living).'
              }),
              createQuestion({
                id: 'SCI-U1-L1-Q3',
                question: 'Which object has NEVER BEEN ALIVE?',
                questionAr: 'أي شيء لم يكن حياً أبداً؟',
                options: ['A granite rock', 'A wooden chair', 'A woolly jumper', 'A leather shoe'],
                correctAnswer: 'A granite rock',
                hint: 'Wood came from a tree, wool from a sheep, leather from a cow. Rock is mineral.',
                explanation: 'Granite rock is a mineral from the Earth; it was never alive and did not come from any plant or animal.'
              })
            ]
          }
        ]
      },
      {
        id: 'SCI-U2',
        subject: 'SCI',
        number: 2,
        title: 'Everyday Materials & Suitability',
        titleAr: 'المواد واستخداماتها المناسبة',
        icon: '🪵',
        description: 'Investigate wood, metal, plastic, glass, rock, and fabric.',
        lessons: [
          {
            id: 'SCI-U2-L1',
            subject: 'SCI',
            unitId: 'SCI-U2',
            unitNumber: 2,
            lessonNumber: 1,
            title: 'Properties of Materials (Transparent, Waterproof)',
            titleAr: 'خصائص المواد (شفاف، مقاوم للماء)',
            objective: 'Identify and compare the suitability of a variety of everyday materials.',
            explanation: "Different materials have different properties. Glass is transparent (we can see through it). Rubber is waterproof and flexible. Metal is strong and rigid.",
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'SCI-U2-L1-Q1',
                question: 'Why are window panes made from GLASS rather than wood?',
                questionAr: 'لماذا تصنع النوافذ من الزجاج بدلاً من الخشب؟',
                options: [
                  'Because glass is transparent so light can pass through',
                  'Because glass is soft and bendy',
                  'Because glass is magnetic',
                  'Because wood is completely invisible'
                ],
                correctAnswer: 'Because glass is transparent so light can pass through',
                hint: 'Transparent means you can see right through it.',
                explanation: 'Glass is chosen for windows because it is transparent, letting sunlight in while keeping rain out!',
                interactiveType: 'material-tester',
                interactiveData: { material: 'glass', property: 'transparent' }
              }),
              createQuestion({
                id: 'SCI-U2-L1-Q2',
                question: 'Which material is best for an umbrella?',
                questionAr: 'أي مادة هي الأفضل لصنع مظلة المطر؟',
                options: [
                  'Waterproof nylon fabric',
                  'Cardboard paper',
                  'Cotton wool sponge',
                  'Heavy brick'
                ],
                correctAnswer: 'Waterproof nylon fabric',
                hint: 'It needs to repel water and be light enough to hold.',
                explanation: 'Umbrellas need waterproof and flexible materials so rain rolls off without soaking through.',
                interactiveType: 'material-tester',
                interactiveData: { material: 'waterproof-fabric', property: 'waterproof' }
              })
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // HISTORY (HIS)
  // ==========================================
  {
    code: 'HIS',
    name: 'History',
    nameAr: 'التاريخ',
    icon: '🏰',
    color: '#8B5CF6',
    bgGradient: 'from-purple-500 to-violet-600',
    description: 'Great Fire of London, Neil Armstrong, Florence Nightingale, and toys through time.',
    units: [
      {
        id: 'HIS-U1',
        subject: 'HIS',
        number: 1,
        title: 'The Great Fire of London (1666)',
        titleAr: 'حريق لندن الكبير (1666)',
        icon: '🔥',
        description: 'Explore where it started, why it spread, and how London was rebuilt.',
        lessons: [
          {
            id: 'HIS-U1-L1',
            subject: 'HIS',
            unitId: 'HIS-U1',
            unitNumber: 1,
            lessonNumber: 1,
            title: 'Pudding Lane Bakery & The Spread',
            titleAr: 'مخبز بودينغ لين وانتشار الحريق',
            objective: 'Know where the Great Fire started and why it spread so quickly.',
            explanation: 'The Great Fire of London started on 2 September 1666 in Thomas Farriner’s bakery on Pudding Lane. In 1666, houses were made of wood, packed closely together, and a strong wind was blowing!',
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'HIS-U1-L1-Q1',
                question: 'In which year did the Great Fire of London occur?',
                questionAr: 'في أي عام حدث حريق لندن الكبير؟',
                options: ['1666', '1966', '1066', '1866'],
                correctAnswer: '1666',
                hint: 'Look for the year with three sixes: 1-6-6-6.',
                explanation: 'The Great Fire of London broke out in September 1666.'
              }),
              createQuestion({
                id: 'HIS-U1-L1-Q2',
                question: 'Why did the fire spread so quickly across London?',
                questionAr: 'لماذا انتشر الحريق بسرعة كبيرة في لندن؟',
                options: [
                  'Houses were made of wood and built very close together',
                  'All houses were made of stone and brick',
                  'There was heavy rainfall and snow',
                  'Fire engines put it out in five minutes'
                ],
                correctAnswer: 'Houses were made of wood and built very close together',
                hint: 'Wood burns easily, and the streets were very narrow.',
                explanation: 'Houses in 1666 were timber-framed (wood) with pitch/tar, close together, and there had been a long dry summer.'
              }),
              createQuestion({
                id: 'HIS-U1-L1-Q3',
                question: 'Which famous London diarist buried wine and Parmesan cheese to save them from the fire?',
                questionAr: 'أي كاتب يوميات مشهور دفن جبن البارميزان لحمايته من الحريق؟',
                options: ['Samuel Pepys', 'King Charles II', 'William Shakespeare', 'Guy Fawkes'],
                correctAnswer: 'Samuel Pepys',
                hint: 'He kept a detailed diary of events during 1666.',
                explanation: 'Samuel Pepys wrote an eyewitness diary about the fire and buried his valuable cheese and wine!'
              })
            ]
          }
        ]
      },
      {
        id: 'HIS-U2',
        subject: 'HIS',
        number: 2,
        title: 'Significant Individuals: Nightingale & Armstrong',
        titleAr: 'شخصيات تاريخية بارزة',
        icon: '🚀',
        description: 'Florence Nightingale (Lady with the Lamp) and Neil Armstrong (Moon Landing 1969).',
        lessons: [
          {
            id: 'HIS-U2-L1',
            subject: 'HIS',
            unitId: 'HIS-U2',
            unitNumber: 2,
            lessonNumber: 1,
            title: 'Florence Nightingale & Mary Seacole',
            titleAr: 'فلورنس نايتينجيل وماري سيكول',
            objective: 'Understand the improvements made to hospitals and nursing.',
            explanation: "Florence Nightingale was known as 'The Lady with the Lamp'. She improved hygiene, clean water, and healthy food in military hospitals during the Crimean War.",
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'HIS-U2-L1-Q1',
                question: "Why was Florence Nightingale known as 'The Lady with the Lamp'?",
                questionAr: "لماذا سميت فلورنس نايتينجيل بـ 'سيدة المصباح'؟",
                options: [
                  'She carried a lamp at night to check on wounded soldiers in hospital',
                  'She invented the electric streetlamp',
                  'She was a lighthouse keeper in England',
                  'She made oil lamps in a workshop'
                ],
                correctAnswer: 'She carried a lamp at night to check on wounded soldiers in hospital',
                hint: 'She walked around the hospital wards at night caring for patients.',
                explanation: 'Florence Nightingale walked the hospital corridors at night with a small lamp, checking on sick and injured soldiers.'
              }),
              createQuestion({
                id: 'HIS-U2-L1-Q2',
                question: 'In 1969, who became the first human to step onto the surface of the Moon?',
                questionAr: 'في عام 1969، من كان أول إنسان يخطو على سطح القمر؟',
                options: ['Neil Armstrong', 'Buzz Lightyear', 'Christopher Columbus', 'Tim Peake'],
                correctAnswer: 'Neil Armstrong',
                hint: "'That's one small step for man, one giant leap for mankind.'",
                explanation: 'American astronaut Neil Armstrong was commander of Apollo 11 and stepped onto the Moon in July 1969.'
              })
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // GEOGRAPHY (GEO)
  // ==========================================
  {
    code: 'GEO',
    name: 'Geography',
    nameAr: 'الجغرافيا',
    icon: '🌍',
    color: '#06B6D4',
    bgGradient: 'from-cyan-500 to-blue-600',
    description: 'The United Kingdom countries & capitals, continents, oceans, compass directions, and maps.',
    units: [
      {
        id: 'GEO-U1',
        subject: 'GEO',
        number: 1,
        title: 'The United Kingdom (4 Countries & Capitals)',
        titleAr: 'المملكة المتحدة (4 دول وعواصم)',
        icon: '🇬🇧',
        description: 'Name, locate and identify characteristics of the 4 countries of the UK.',
        lessons: [
          {
            id: 'GEO-U1-L1',
            subject: 'GEO',
            unitId: 'GEO-U1',
            unitNumber: 1,
            lessonNumber: 1,
            title: 'Countries and Capital Cities of the UK',
            titleAr: 'دول وعواصم المملكة المتحدة',
            objective: 'Name and locate the 4 countries and capital cities of the United Kingdom.',
            explanation: 'The United Kingdom is made of 4 countries: England (capital London), Scotland (capital Edinburgh), Wales (capital Cardiff), and Northern Ireland (capital Belfast)!',
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'GEO-U1-L1-Q1',
                question: 'Which four countries make up the United Kingdom?',
                questionAr: 'ما هي الدول الأربع التي تشكل المملكة المتحدة؟',
                options: [
                  'England, Scotland, Wales, and Northern Ireland',
                  'England, France, Spain, and Germany',
                  'England, Scotland, Ireland, and Australia',
                  'London, Edinburgh, Cardiff, and Belfast'
                ],
                correctAnswer: 'England, Scotland, Wales, and Northern Ireland',
                hint: 'London, Edinburgh, Cardiff and Belfast are capital cities, not the countries themselves.',
                explanation: 'The four countries are England, Scotland, Wales, and Northern Ireland.'
              }),
              createQuestion({
                id: 'GEO-U1-L1-Q2',
                question: 'What is the capital city of Scotland?',
                questionAr: 'ما هي عاصمة اسكتلندا؟',
                options: ['Edinburgh', 'London', 'Cardiff', 'Dublin'],
                correctAnswer: 'Edinburgh',
                hint: 'Home to the famous Edinburgh Castle on an extinct volcano.',
                explanation: 'Edinburgh is the capital of Scotland. (London is England, Cardiff is Wales, Belfast is Northern Ireland).'
              }),
              createQuestion({
                id: 'GEO-U1-L1-Q3',
                question: 'What is the capital city of Wales?',
                questionAr: 'ما هي عاصمة ويلز؟',
                options: ['Cardiff', 'Swansea', 'London', 'Glasgow'],
                correctAnswer: 'Cardiff',
                hint: 'Starts with the letter C.',
                explanation: 'Cardiff is the capital city of Wales.'
              })
            ]
          }
        ]
      },
      {
        id: 'GEO-U2',
        subject: 'GEO',
        number: 2,
        title: 'Compass Directions & Map Skills',
        titleAr: 'اتجاهات البوصلة ورموز الخريطة',
        icon: '🧭',
        description: 'North, South, East, West, aerial maps, and map keys.',
        lessons: [
          {
            id: 'GEO-U2-L1',
            subject: 'GEO',
            unitId: 'GEO-U2',
            unitNumber: 2,
            lessonNumber: 1,
            title: 'The Four Cardinal Compass Points',
            titleAr: 'الاتجاهات الأربعة الرئيسية',
            objective: 'Use simple compass directions (North, South, East and West).',
            explanation: "Remember compass points with the rhyme: Never Eat Shredded Wheat (North at the top, East on the right, South at the bottom, West on the left)!",
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'GEO-U2-L1-Q1',
                question: 'Which compass direction is directly OPPOSITE to North?',
                questionAr: 'أي اتجاه بوصلة هو المقابل تماماً للشمال (North)؟',
                options: ['South', 'East', 'West', 'North-East'],
                correctAnswer: 'South',
                hint: 'North points up; this one points down.',
                explanation: 'South is directly opposite North. East is directly opposite West.',
                interactiveType: 'compass',
                interactiveData: { targetDirection: 'South' }
              }),
              createQuestion({
                id: 'GEO-U2-L1-Q2',
                question: 'What does a MAP KEY (or legend) show you?',
                questionAr: 'ماذا يوضح مفتاح الخريطة (Map Key)؟',
                options: [
                  'It explains what the symbols and colours on the map mean',
                  'It unlocks secret doors in buildings',
                  'It tells you today’s temperature',
                  'It shows the names of all your family members'
                ],
                correctAnswer: 'It explains what the symbols and colours on the map mean',
                hint: 'Symbols like a blue line for a river, or a tent for a campsite.',
                explanation: 'A map key explains what each symbol, colour, or picture represents on the map.'
              })
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // ART & DESIGN (ART)
  // ==========================================
  {
    code: 'ART',
    name: 'Art & Design',
    nameAr: 'الفنون والتصميم',
    icon: '🎨',
    color: '#EC4899',
    bgGradient: 'from-pink-500 to-rose-600',
    description: 'Colour mixing (primary & secondary), famous artists, tints, shades, and texture.',
    units: [
      {
        id: 'ART-U1',
        subject: 'ART',
        number: 1,
        title: 'Primary & Secondary Colour Mixing',
        titleAr: 'خلط الألوان الأساسية والثانوية',
        icon: '🖌️',
        description: 'Mix primary colours to make secondary colours (Orange, Green, Purple).',
        lessons: [
          {
            id: 'ART-U1-L1',
            subject: 'ART',
            unitId: 'ART-U1',
            unitNumber: 1,
            lessonNumber: 1,
            title: 'Creating Secondary Colours',
            titleAr: 'صنع الألوان الثانوية',
            objective: 'Understand that primary colours can be mixed to make secondary colours.',
            explanation: 'The 3 primary colours are RED, YELLOW, and BLUE. When you mix: Red + Yellow = Orange. Yellow + Blue = Green. Blue + Red = Purple!',
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'ART-U1-L1-Q1',
                question: 'Which colour is created when you mix RED and YELLOW paint together?',
                questionAr: 'ما هو اللون الناتج عند خلط طلاء أحمر وأصفر معاً؟',
                options: ['Orange', 'Green', 'Purple', 'Brown'],
                correctAnswer: 'Orange',
                hint: 'Think of bright fruit or a fiery sunset!',
                explanation: 'Red + Yellow = Orange! Orange is a secondary colour.',
                interactiveType: 'color-mixer',
                interactiveData: { color1: '#FF0000', color2: '#FFD700', result: '#FFA500', name1: 'Red', name2: 'Yellow', resultName: 'Orange' }
              }),
              createQuestion({
                id: 'ART-U1-L1-Q2',
                question: 'Which two primary colours do you mix to make GREEN paint?',
                questionAr: 'أي لونين أساسيين تخلطهما لصنع اللون الأخضر؟',
                options: ['Blue and Yellow', 'Red and Blue', 'Red and Yellow', 'Black and White'],
                correctAnswer: 'Blue and Yellow',
                hint: 'Blue sky + Yellow sun = Green grass!',
                explanation: 'Blue + Yellow makes Green!',
                interactiveType: 'color-mixer',
                interactiveData: { color1: '#0055FF', color2: '#FFD700', result: '#00B020', name1: 'Blue', name2: 'Yellow', resultName: 'Green' }
              }),
              createQuestion({
                id: 'ART-U1-L1-Q3',
                question: 'How do you make a colour into a LIGHTER TINT in painting?',
                questionAr: 'كيف تجعل لوناً أكثر تفتيحاً (Tint) في الرسم؟',
                options: ['Add white paint', 'Add black paint', 'Add water only', 'Add purple paint'],
                correctAnswer: 'Add white paint',
                hint: 'Adding white makes pink from red, or baby blue from dark blue.',
                explanation: 'Adding WHITE to any colour creates a TINT (makes it lighter). Adding black creates a SHADE.'
              })
            ]
          }
        ]
      },
      {
        id: 'ART-U2',
        subject: 'ART',
        number: 2,
        title: 'Famous Artists (Monet & Van Gogh)',
        titleAr: 'الفنانون المشهورون (مونيه وفان جوخ)',
        icon: '🖼️',
        description: 'Explore impressionism, water lilies, and swirling starry nights.',
        lessons: [
          {
            id: 'ART-U2-L1',
            subject: 'ART',
            unitId: 'ART-U2',
            unitNumber: 2,
            lessonNumber: 1,
            title: 'Claude Monet & Water Lilies',
            titleAr: 'كلود مونيه ولوحات زنابق الماء',
            objective: 'Recognise the style and technique of French impressionist Claude Monet.',
            explanation: 'Claude Monet painted outdoors in natural light. He used quick dabbed brushstrokes of pure colour to paint water lilies and bridges in his Japanese garden in Giverny, France!',
            xp: 15,
            coins: 5,
            questions: [
              createQuestion({
                id: 'ART-U2-L1-Q1',
                question: 'What famous plant in his pond garden did Claude Monet paint hundreds of times?',
                questionAr: 'ما هو النبات الشهير في حديقته الذي رسمه كلود مونيه مئات المرات؟',
                options: ['Water lilies', 'Cactus plants', 'Giant oak trees', 'Sunflowers only'],
                correctAnswer: 'Water lilies',
                hint: 'Floating flowers on the surface of calm water.',
                explanation: 'Claude Monet is world famous for his series of Water Lilies (Nymphéas) paintings.'
              }),
              createQuestion({
                id: 'ART-U2-L1-Q2',
                question: 'Vincent van Gogh painted a famous painting of the night sky with swirling stars called...',
                questionAr: 'رسم فان جوخ لوحة شهيرة لسماء الليل بنجوم متلألئة تدعى...',
                options: ['The Starry Night', 'The Sunny Day', 'The Rainy Afternoon', 'The Dark Forest'],
                correctAnswer: 'The Starry Night',
                hint: 'Swirling blue and yellow brushstrokes of stars above a sleepy village.',
                explanation: 'The Starry Night is one of Vincent van Gogh’s most famous post-impressionist masterpieces!'
              })
            ]
          }
        ]
      }
    ]
  }
];

export function getSubjectByCode(code: SubjectCode): SubjectInfo {
  return SUBJECTS_DATA.find(s => s.code === code) || SUBJECTS_DATA[0];
}

export function getAllUnitsForSubject(code: SubjectCode): Unit[] {
  const subj = getSubjectByCode(code);
  return subj.units;
}
