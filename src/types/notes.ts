export interface Note {
  id: string;
  userId: string;
  kanjiId: number;
  kanjiCharacter: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteRequest {
  kanjiId: number;
  kanjiCharacter: string;
  content: string;
}

export interface UpdateNoteRequest {
  content: string;
}

export type SortOrder = 'asc' | 'desc';