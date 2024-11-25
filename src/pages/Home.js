import { useNavigate } from 'react-router-dom';
import { Button, Typography, Spin, message, Space } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { fetchQuestions } from '../services/questionService';

const { Title } = Typography;

function Home() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestions();
        setQuestions(data);
        setLoading(false);
      } catch (error) {
        message.error('Không thể tải câu hỏi');
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  const handleStartQuiz = (path) => {
    navigate(path, { 
      state: { 
        questions,
        allQuestions: questions
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8 mt-8 px-4">
      <Title className="text-center text-2xl sm:text-3xl md:text-4xl !mb-0">
        Ôn Tập Quản Lý Dự Án
      </Title>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Chọn loại bài thi:</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStartQuiz('/277')}
              className="min-w-[200px] h-12 text-base font-medium"
            >
              Bài thi 277 câu
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStartQuiz('/1200')}
              className="min-w-[200px] h-12 text-base font-medium"
            >
              Bài thi 1200 câu
            </Button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Home;