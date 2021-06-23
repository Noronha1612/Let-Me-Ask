import { FormEvent, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import logoImg from '../assets/images/logo.svg';

import '../styles/room.scss';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { useCallback } from 'react';

type Question = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  isAnswered: boolean;
  isHighlighted: boolean;
};

type FirebaseQuestions = Record<string, Omit<Question, 'id'>>;

type RoomParams = {
  id: string;
};

export const Room = () => {
  const { user } = useAuth();
  const { id: roomId } = useParams<RoomParams>();

  const [newQuestion, setNewQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');

  const loadRoomData = useCallback(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.once('value', (room) => {
      const firebaseQuestions: FirebaseQuestions =
        room.val().questions ?? {};

      const parsedQuestions = Object.entries(firebaseQuestions).map(
        ([key, value]) => {
          return {
            id: key,
            content: value.content,
            author: value.author,
            isHighlighted: value.isHighlighted,
            isAnswered: value.isAnswered,
          };
        }
      );

      setTitle(room.val().title);
      setQuestions(parsedQuestions);
    });
  }, [ roomId ])

  const handleSendQuestion = useCallback(async (event: FormEvent) => {
    if (newQuestion.trim() === '') return;
    event.preventDefault();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false,
    };

    setIsLoading(true);

    await database.ref(`rooms/${roomId}/questions`).push(question);

    setIsLoading(false);
    loadRoomData();
    setNewQuestion('');
  }, [loadRoomData, newQuestion, roomId, user])

  useEffect(() => {
    loadRoomData();
  }, [ loadRoomData ]);

  return (
    <div id='page-room'>
      <header>
        <div className='content'>
          <img src={logoImg} alt='Letmeask' />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>{questions.length} pergunta(s)</span>
          )}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            value={newQuestion}
            onChange={(event) => setNewQuestion(event.target.value)}
            placeholder='O que você quer perguntar?'
          />
          <div className='form-footer'>
            {!user ? (
              <span>
                Para enviar uma pergunta,{' '}
                <button>faça seu login.</button>
              </span>
            ) : (
              <div className='user-info'>
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            )}
            <Button disabled={!user || isLoading} type='submit'>
              Enviar pergunta
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};
