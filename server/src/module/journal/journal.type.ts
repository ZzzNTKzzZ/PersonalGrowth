export type CursorPaginationQuery = {
  cursor?: string;
  limit?: string;
};

export type JournalResponse = {
  id: string;
  name: string | null;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};
