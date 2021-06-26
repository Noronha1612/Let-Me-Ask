import { useEffect } from 'react';
import { useHistory } from 'react-router';

export const useRedirect = (route: string, condition: boolean) => {
  const history = useHistory();

  useEffect(() => {
    if (condition) {
      history.push(route);
    }
  }, [ history, condition, route ])
};
