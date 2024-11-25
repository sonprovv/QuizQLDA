import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import ResultPage from './pages/Result';
import ReviewAnswers from './pages/ReviewAnswers';
import './App.css';

const { Header, Content } = Layout;

function App() {
  return (
    <Router>
      <Layout className="min-h-screen">
        <Header className="bg-white px-4">
          <Navigation />
        </Header>
        <Content className="w-full max-w-4xl mx-auto p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path='/review' element={<ReviewAnswers />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
