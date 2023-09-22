import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DefaultLayout from './layouts/DefaultLayout';
import Search from './pages/Search';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Search />} />
          <Route path="/:year?/:city?/:district?" element={<Search />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
