import { FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import IllustrationImg from '../assets/images/illustration.svg';
import LogoImg from '../assets/images/logo.svg';

import '../styles/auth.scss';

import { Button } from '../components/Button';

import { useAuth } from '../hooks/useAuth';

import { database } from '../services/firebase';

export const NewRoom: React.FC = () => {
  const { user } = useAuth();
  const history = useHistory();

  const [newRoom, setNewRoom] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();
    setLoading(true);

    if (newRoom.trim() === '') return;

    const roomRef = database.ref('rooms');

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id,
    });

    setLoading(false);
    history.push(`/rooms/${firebaseRoom.key}`);
  }

  return (
    <div id='page-auth'>
      <aside>
        <img
          src={IllustrationImg}
          alt='Ilustração simbolizando perguntas e respostas'
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo real</p>
      </aside>
      <main>
        <div className='main-content'>
          <img src={LogoImg} alt='Letmeask' />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              value={newRoom}
              onChange={(event) => setNewRoom(event.target.value)}
              type='text'
              placeholder='Nome da sala'
            />
            <Button disabled={loading} type='submit'>
              Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente?
            <Link to='/'>Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
