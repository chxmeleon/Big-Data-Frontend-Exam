import {
  BrowserRouter, Routes, Route, Navigate,
} from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import Search from './pages/Search';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Search />} />
          <Route path="/:year?/:city?/:district?" element={<Search />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
