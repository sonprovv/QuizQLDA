import { useState, useEffect } from 'react';
import { Typography, Spin, message, Collapse, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;
const { Panel } = Collapse;

function PMP() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChapters, setSelectedChapters] = useState([]);
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

  const handleSelectChapter = (chapterId) => {
    setSelectedChapters(prev => 
      prev.includes(chapterId) ? prev.filter(id => id !== chapterId) : [...prev, chapterId]
    );
  };

  const startQuiz = () => {
    navigate('/quiz-pmp', { state: { selectedChapters } });
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
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-3 sm:p-6">
        <Collapse accordion>
          {chapters.map((chapter) => (
            <Panel header={`${chapter.name} (${chapter.questions?.length || 0} questions)`} key={chapter.id}>
              <Button 
                type={selectedChapters.includes(chapter.id) ? "primary" : "default"} 
                onClick={() => handleSelectChapter(chapter.id)}
              >
                {selectedChapters.includes(chapter.id) ? "Bỏ chọn" : "Chọn"}
              </Button>
            </Panel>
          ))}
        </Collapse>
        <Button 
          type="primary" 
          className="mt-4" 
          onClick={startQuiz} 
          disabled={selectedChapters.length === 0}
        >
          Bắt đầu làm bài
        </Button>
      </div>
    </div>
  );
}

export default PMP;
