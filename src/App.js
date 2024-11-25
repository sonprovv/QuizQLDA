import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import ResultPage from './pages/Result';
import './App.css';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="min-h-screen">
        <Header className="bg-white">
          <Navigation />
        </Header>
        <Content className="max-w-4xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
