import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
    component: Home
  },
  notFound: {
    id: 'notFound',
    label: 'Not Found',
    path: '/404',
    icon: 'AlertCircle',
    component: NotFound
  }
};

export const routeArray = Object.values(routes).filter(route => route.id !== 'notFound');