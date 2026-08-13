/* -------------------------------------------------------------------------- */
/*                                 NOTE CARD                                  */
/* -------------------------------------------------------------------------- */

export interface NoteCardData {
  id: string;

  title: string;

  content: string;

  topicId: string;

  subjectName?: string;

  topicName: string;

  createdAt: string;

  updatedAt: string;
}

/* -------------------------------------------------------------------------- */
/*                                NOTE FORM                                   */
/* -------------------------------------------------------------------------- */

export interface NoteFormData {
  title: string;

  content: string;

  topicId: string;
}

export interface NoteFormInitialData
  extends NoteFormData {
  id: string;
}

/* -------------------------------------------------------------------------- */
/*                              TOPIC OPTIONS                                 */
/* -------------------------------------------------------------------------- */

export interface NoteTopicOption {
  id: string;

  title: string;
}