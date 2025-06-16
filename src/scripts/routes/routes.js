import HomePage from '../pages/home/Home';
import { checkUnauthenticatedRouteOnly, checkAuthenticatedRoute } from '../utils/auth';
import LoginPage from '../pages/auth/login/Login';
import Register from '../pages/auth/register/Register';
import AddStoryPage from '../pages/add/AddStory.js';
// import NewStoryPage from '../pages/new-story/new-story-page';
import StoryDetailPage from '../pages/story-detail/story-detail-page';
// import NewStoryGuestPage from '../pages/new-story-guest/new-story-guest-page';
import OfflineStoriesPage from '../pages/OfflineStoriesPage';

const routes = {
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new Register()),
  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/new-story': () => checkAuthenticatedRoute(new AddStoryPage()),
  '/offline': () => checkAuthenticatedRoute(new OfflineStoriesPage()),
  // '/': () => (new LoginPage()),



  // '/new-story': () => checkAuthenticatedRoute(new NewStoryPage()),
  '/stories/:id': () => checkAuthenticatedRoute(new StoryDetailPage()),
  // '/new-story-guest': () => checkUnauthenticatedRouteOnly(new NewStoryGuestPage()),
};

export default routes;
