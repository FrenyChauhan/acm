import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CustomCursor from './components/common/CustomCursor';
import PageTransition from './components/common/PageTransition';
import ScrollToTop from './components/common/ScrollToTop';

import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Projects from './pages/Projects';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Team from './pages/Team';
import Achievements from './pages/Achievements';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

const Layout = () => (
  <>
    <CustomCursor />
    <ScrollToTop />
    <Navbar />
    <PageTransition>
      <Outlet />
    </PageTransition>
    <Footer />
  </>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,             element: <Home /> },
      { path: 'events',          element: <Events /> },
      { path: 'events/:slug',    element: <EventDetail /> },
      { path: 'projects',        element: <Projects /> },
      { path: 'blogs',           element: <Blogs /> },
      { path: 'blogs/:slug',     element: <BlogDetail /> },
      { path: 'team',            element: <Team /> },
      { path: 'achievements',    element: <Achievements /> },
      { path: 'contact',         element: <Contact /> },
      { path: '*',               element: <NotFound /> },
    ]
  }
]);

export default function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}
