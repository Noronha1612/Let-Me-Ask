import { Dispatch, useState } from 'react';
import { database } from '../../services/firebase';
import '../../styles/deleteModal.scss';

export interface DeletingOptions {
  questionToBeDeleted: string;
  isDeleting: boolean;
}

interface DeleteModalProps {
  roomId: string;
  deletingOptionsState: [
    DeletingOptions,
    Dispatch<React.SetStateAction<DeletingOptions>>
  ];
}

export const DeleteModal = ({
  roomId,
  deletingOptionsState,
}: DeleteModalProps) => {
  const [deletingOptions, setDeletingOptions] = deletingOptionsState;
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if ( isLoading ) return;

    setIsLoading(true);

    await database
      .ref(`/rooms/${roomId}/questions/${deletingOptions.questionToBeDeleted}`)
      .remove();

    setIsLoading(false);
    setDeletingOptions({ questionToBeDeleted: '', isDeleting: false });
  };

  const handleCancel = () => {
    if ( isLoading ) return;

    setDeletingOptions({ questionToBeDeleted: '', isDeleting: false });
  }

  return (
    <div className='modal-container'>
      <div id='delete-modal-container'>
        <svg
          width={48}
          height={48}
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M3 5.99988H5H21'
            stroke='#E73F5D'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
          <path
            d='M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z'
            stroke='#E73F5D'
            stroke-width='2'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>

        <h3>Excluir pergunta</h3>

        <p>Tem certeza que você deseja excluir esta pergunta?</p>

        <div className='buttons-wrapper'>
          <button disabled={isLoading} onClick={handleCancel} className='cancel-btn'>Cancelar</button>
          <button disabled={isLoading} onClick={handleDelete} className='confirm-btn'>Sim, Excluir</button>
        </div>
      </div>
    </div>
  );
};
