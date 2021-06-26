import { useEffect, useState } from 'react';
import { database } from '../services/firebase';
import { useAuth } from './useAuth';

export type QuestionType = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
  likeCount: number;
  likeId: string | undefined;
};

type FirebaseQuestions = Record<string, Omit<QuestionType, 'id'> & {
    likes: Record<string, {
        authorId: string;
      }
    >;
  }
>;

export const useRoom = (roomId: string, ) => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.on('value', (room) => {
      const firebaseQuestions: FirebaseQuestions =
        room.val().questions ?? {};

      const parsedQuestions = Object.entries(
        firebaseQuestions
      ).map<QuestionType>(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find(
            ([, like]) => like.authorId === user?.id
          )?.[0],
        };
      });

      setTitle(room.val().title);
      setAuthorId(room.val().authorId);
      setQuestions(parsedQuestions);

      return () => roomRef.off('value');
    });
  }, [roomId, user?.id]);

  return {
    title,
    questions,
    authorId,
  };
};
