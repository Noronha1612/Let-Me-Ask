import { Home } from './pages/Home';
import { NewRoom } from './pages/NewRoom';

import { BrowserRouter, Route } from 'react-router-dom';

import { AuthContextProvider} from './contexts/AuthContext';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Route path="/" component={ Home } exact />
        <Route path="/rooms/new" component={ NewRoom } />
      </AuthContextProvider>
    </BrowserRouter>
  );
};