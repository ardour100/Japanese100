export interface GojuonChar {
  hiragana: string;
  romaji: string;
}

export const gojuonData: GojuonChar[][] = [
  // A row
  [
    { hiragana: 'あ', romaji: 'a' },
    { hiragana: 'い', romaji: 'i' },
    { hiragana: 'う', romaji: 'u' },
    { hiragana: 'え', romaji: 'e' },
    { hiragana: 'お', romaji: 'o' }
  ],
  // K row
  [
    { hiragana: 'か', romaji: 'ka' },
    { hiragana: 'き', romaji: 'ki' },
    { hiragana: 'く', romaji: 'ku' },
    { hiragana: 'け', romaji: 'ke' },
    { hiragana: 'こ', romaji: 'ko' }
  ],
  // S row
  [
    { hiragana: 'さ', romaji: 'sa' },
    { hiragana: 'し', romaji: 'shi' },
    { hiragana: 'す', romaji: 'su' },
    { hiragana: 'せ', romaji: 'se' },
    { hiragana: 'そ', romaji: 'so' }
  ],
  // T row
  [
    { hiragana: 'た', romaji: 'ta' },
    { hiragana: 'ち', romaji: 'chi' },
    { hiragana: 'つ', romaji: 'tsu' },
    { hiragana: 'て', romaji: 'te' },
    { hiragana: 'と', romaji: 'to' }
  ],
  // N row
  [
    { hiragana: 'な', romaji: 'na' },
    { hiragana: 'に', romaji: 'ni' },
    { hiragana: 'ぬ', romaji: 'nu' },
    { hiragana: 'ね', romaji: 'ne' },
    { hiragana: 'の', romaji: 'no' }
  ],
  // H row
  [
    { hiragana: 'は', romaji: 'ha' },
    { hiragana: 'ひ', romaji: 'hi' },
    { hiragana: 'ふ', romaji: 'fu' },
    { hiragana: 'へ', romaji: 'he' },
    { hiragana: 'ほ', romaji: 'ho' }
  ],
  // M row
  [
    { hiragana: 'ま', romaji: 'ma' },
    { hiragana: 'み', romaji: 'mi' },
    { hiragana: 'む', romaji: 'mu' },
    { hiragana: 'め', romaji: 'me' },
    { hiragana: 'も', romaji: 'mo' }
  ],
  // Y row
  [
    { hiragana: 'や', romaji: 'ya' },
    { hiragana: '', romaji: '' },
    { hiragana: 'ゆ', romaji: 'yu' },
    { hiragana: '', romaji: '' },
    { hiragana: 'よ', romaji: 'yo' }
  ],
  // R row
  [
    { hiragana: 'ら', romaji: 'ra' },
    { hiragana: 'り', romaji: 'ri' },
    { hiragana: 'る', romaji: 'ru' },
    { hiragana: 'れ', romaji: 're' },
    { hiragana: 'ろ', romaji: 'ro' }
  ],
  // W row + N
  [
    { hiragana: 'わ', romaji: 'wa' },
    { hiragana: '', romaji: '' },
    { hiragana: '', romaji: '' },
    { hiragana: '', romaji: '' },
    { hiragana: 'を', romaji: 'wo' }
  ],
  // N (standalone)
  [
    { hiragana: 'ん', romaji: 'n' },
    { hiragana: '', romaji: '' },
    { hiragana: '', romaji: '' },
    { hiragana: '', romaji: '' },
    { hiragana: '', romaji: '' }
  ]
];

export const gojuonHeaders = ['a', 'i', 'u', 'e', 'o'];