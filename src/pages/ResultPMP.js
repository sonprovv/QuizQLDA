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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Text className="text-lg">No result data available</Text>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      <Card className="w-full max-w-4xl mx-auto shadow-md hover:shadow-lg transition-shadow">
        <div className="space-y-8 text-center">
          <Title level={2} className="!mb-0 text-2xl md:text-3xl">
            Kết quả bài thi PMP
          </Title>

          <div className="w-36 h-36 md:w-48 md:h-48 mx-auto">
            <Progress
              type="circle"
              percent={percentage}
              strokeWidth={8}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              format={() => (
                <div className="text-center">
                  <div className="text-xl md:text-2xl font-bold">{score}/{total}</div>
                  <div className="text-sm md:text-base">{percentage}%</div>
                </div>
              )}
            />
          </div>

          <div className="space-y-4">
            <Text className="block text-base md:text-lg">
              Bạn đã trả lời đúng <span className="font-semibold">{score}</span> trong số <span className="font-semibold">{total}</span> câu hỏi
            </Text>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              type="primary"
              onClick={handleReviewAnswers}
              size="large"
              className="min-w-[160px]"
            >
              Xem lại đáp án
            </Button>
            <Button
              onClick={handleReturnHome}
              size="large"
              className="min-w-[160px]"
            >
              Quay lại trang chủ
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ResultPMP;
