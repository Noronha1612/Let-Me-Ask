import { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import '../styles/room.scss';

// import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

import { database } from '../services/firebase';
import { DeleteModal } from '../components/modals/DeleteModal';

type RoomParams = {
  id: string;
};

export const AdminRoom = () => {
  const { id: roomId } = useParams<RoomParams>();
  const history = useHistory();
  // const { user } = useAuth();
  const { questions, title } = useRoom(roomId);

  const [ deletingOptions, setDeletingOptions ] = useState({
    isDeleting: false,
    questionToBeDeleted: '',
  });

  const handleEndRoom = async () => {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push('/');
  };

  const handleRemoveQuestion = async (questionId: string) => {
    setDeletingOptions({
      isDeleting: true,
      questionToBeDeleted: questionId
    })
  };
  const handleCheckQuestionAsAnswered = async (
    questionId: string
  ) => {
    await database
      .ref(`/rooms/${roomId}/questions/${questionId}`)
      .update({
        isAnswered: true,
      });
  };

  const handleHighlightQuestion = async (questionId: string) => {
    await database
      .ref(`/rooms/${roomId}/questions/${questionId}`)
      .update({
        isHighlighted: true,
      });
  };

  return (
    <div id='page-room'>
      {!!deletingOptions.isDeleting && (
        <DeleteModal
          deletingOptionsState={[deletingOptions, setDeletingOptions]}
          roomId={roomId}
        />
      )}

      <header>
        <div className='content'>
          <img src={logoImg} alt='Letmeask' />
          <div>
            <RoomCode code={roomId} />
            <Button onClick={handleEndRoom} isOutlined>
              Encerrar sala
            </Button>
          </div>
        </div>
      </header>

      <main>
        <div className='room-title'>
          <h1>Sala {title}</h1>
          {questions.length > 0 && (
            <span>{questions.length} pergunta(s)</span>
          )}
        </div>

        {questions.map((question) => (
          <Question
            key={question.id}
            content={question.content}
            author={question.author}
            isAnswered={question.isAnswered}
            isHighlighted={question.isHighlighted}
          >
            {!question.isAnswered && (
              <>
                <button
                  type='button'
                  onClick={() =>
                    handleCheckQuestionAsAnswered(question.id)
                  }
                >
                  <img
                    src={checkImg}
                    alt='Marcar pergunta como respondida'
                  />
                </button>
                <button
                  type='button'
                  onClick={() => handleHighlightQuestion(question.id)}
                >
                  <img
                    src={answerImg}
                    alt='Dar destaque à pergunta'
                  />
                </button>
              </>
            )}
            <button
              type='button'
              onClick={() => handleRemoveQuestion(question.id)}
            >
              <img src={deleteImg} alt='Remover pergunta' />
            </button>
          </Question>
        ))}
      </main>
    </div>
  );
};
