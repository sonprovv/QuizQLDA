import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Progress } from 'antd';

const { Title, Text } = Typography;

function ResultPMP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total, questions, userAnswers } = location.state || {};

  const percentage = Math.round((score / total) * 100);

  const handleReviewAnswers = () => {
    navigate('/review-pmp', { state: { questions, userAnswers } });
  };

  const handleReturnHome = () => {
    navigate('/pmp');
  };

  if (!location.state) {
    return <div>No result data available</div>;
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <Card className="w-full max-w-4xl mx-auto">
        <div className="space-y-6 text-center">
          <Title level={2}>Kết quả bài thi PMP</Title>
          
          <div className="w-48 h-48 mx-auto">
            <Progress
              type="circle"
              percent={percentage}
              format={() => (
                <div className="text-center">
                  <div className="text-2xl font-bold">{score}/{total}</div>
                  <div className="text-sm">{percentage}%</div>
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Text className="block text-lg">
              Bạn đã trả lời đúng {score} trong số {total} câu hỏi
            </Text>
          </div>

          <div className="space-x-4">
            <Button type="primary" onClick={handleReviewAnswers}>
              Xem lại đáp án
            </Button>
            <Button onClick={handleReturnHome}>
              Quay lại trang chủ
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ResultPMP;
