import { useNavigate } from 'react-router-dom';
import { Button, Typography, Checkbox, Row, Col, message, Spin } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { fetchQuestions } from '../services/questionService';

const { Title } = Typography;

function Question1200() {
  const navigate = useNavigate();
  const [selectedPackages, setSelectedPackages] = useState([]);
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

  const packages = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: `Gói ${i + 1} (Câu hỏi ${i * 50 + 1}-${(i + 1) * 50})`,
  }));

  const handleStartQuiz = () => {
    if (selectedPackages.length === 0) {
      message.warning('Vui lòng chọn ít nhất một gói câu hỏi');
      return;
    }
    
    const selectedQuestions = questions.filter(q => 
      selectedPackages.includes(q.packageId)
    );

    navigate('/quiz', { 
      state: { 
        packages: selectedPackages,
        questions: selectedQuestions,
        allQuestions: questions // Pass all questions for reference
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
        1200 Câu Hỏi Quản Lý Dự Án
      </Title>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Chọn gói câu hỏi:</h2>
          <Row gutter={[16, 16]}>
            {packages.map(pkg => (
              <Col key={pkg.id} xs={24} sm={12} md={8}>
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPackages([...selectedPackages, pkg.id]);
                    } else {
                      setSelectedPackages(selectedPackages.filter(id => id !== pkg.id));
                    }
                  }}
                  className="w-full py-2 px-3 hover:bg-gray-50 rounded transition-colors"
                >
                  <span className="text-sm">{pkg.name}</span>
                </Checkbox>
              </Col>
            ))}
          </Row>
        </div>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={handleStartQuiz}
            className="min-w-[200px] h-12 text-base font-medium"
          >
            Bắt Đầu ({selectedPackages.length} gói đã chọn)
          </Button>
          <Button
            type="default"
            size="large"
            onClick={() => navigate('/review-all-1200', { 
              state: { questions: questions } 
            })}
            className="min-w-[200px] h-12 text-base font-medium"
          >
            Xem Tất Cả Câu Hỏi
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Question1200;