import LoadingComponent from './components/LoadingComponent.jsx';
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import LINKS from './routes/index.js';

const ProtectedRoute = lazy(() => import('./pages/ProtectedRoute.jsx'));

function App() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <Routes>
        {LINKS.map(({ path, component: Component, key, isProtected }) => (
          <Route
            key={key}
            path={path}
            element={
              isProtected ? (
                <ProtectedRoute>
                  <Component />
                </ProtectedRoute>
              ) : (
                <Component />
              )
            }
          />
        ))}
      </Routes>
    </Suspense>
  );
}

export default App;