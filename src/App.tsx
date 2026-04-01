import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Article from "./components/Articles";
import Error from "./pages/Error404";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<Article />} />
          <Route path="*" element={<Error />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
