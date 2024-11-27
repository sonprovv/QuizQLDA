import { useState, useEffect } from 'react';
import { Typography, Spin, message, Card, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function PMP() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChapters = async () => {
      const response = await fetch('https://qlda-8ec11-default-rtdb.asia-southeast1.firebasedatabase.app/rita.json');
      if (!response.ok) {
        throw new Error('Failed to fetch chapters');
      }
      const data = await response.json();
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    };

    const loadChapters = async () => {
      try {
        const data = await fetchChapters();
        setChapters(data);
        setLoading(false);
      } catch (error) {
        message.error('Không thể tải các chương');
        setLoading(false);
      }
    };
    loadChapters();
  }, []);

  const startQuiz = (chapterId) => {
    navigate('/quiz-pmp', { state: { selectedChapters: [chapterId] } });
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
        PMP EXAM PREP
      </Title>
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chapter) => (
            <Card 
              key={chapter.id}
              hoverable
              className="h-[200px] flex flex-col"
              bodyStyle={{ 
                height: '100%',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-center mb-4">{chapter.name}</h3>
                <p className="text-center text-gray-600 mb-auto">{chapter.questions?.length || 0} câu hỏi</p>
                <Button 
                  type="primary"
                  onClick={() => startQuiz(chapter.id)}
                  block
                  className="mt-auto"
                >
                  Bắt đầu
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PMP;
