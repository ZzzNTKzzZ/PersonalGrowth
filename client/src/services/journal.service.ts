export interface UpdateJournalPayload {
    name: string,
    content: string
}
export interface CreateJournalPayload {
    name: string,
    content: string
}

export const journalApi = {
    updateJournal: (id: string, payload: UpdateJournalPayload) => {

    },

    createJournal: (payload: CreateJournalPayload) => {

    },

    deleteJournal: (id: string) => {

    }
}