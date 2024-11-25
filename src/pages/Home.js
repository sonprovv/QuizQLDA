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
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 sm:space-y-8 mt-4 sm:mt-8 px-2 sm:px-4">
      <Title className="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl !mb-0">
        Ôn Tập Quản Lý Dự Án
      </Title>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-3 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4 text-center sm:text-left">
            Chọn loại bài thi:
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStartQuiz('/277')}
              className="w-full sm:w-auto sm:min-w-[200px] h-12 text-base font-medium"
            >
              Bài thi 277 câu
            </Button>
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              onClick={() => handleStartQuiz('/1200')}
              className="w-full sm:w-auto sm:min-w-[200px] h-12 text-base font-medium"
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