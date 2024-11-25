import { Button, Card, Typography, Space, Progress } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Result2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total, questions, userAnswers, earlyEnd, questionsAttempted } = location.state || {};

  const percentage = Math.round((score / total) * 100);

  const getResultMessage = () => {
    if (percentage >= 80) return "Xuất sắc!";
    if (percentage >= 60) return "Khá tốt!";
    if (percentage >= 40) return "Cần cải thiện!";
    return "Cần cố gắng hơn!";
  };

  const handleReviewAnswers = () => {
    navigate('/review-answers2', { state: { questions, userAnswers } });
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  if (!location.state) {
    return <div>Không có dữ liệu kết quả</div>;
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <Card className="max-w-2xl mx-auto">
        <div className="text-center space-y-6">
          <Title level={2}>Kết Quả Bài Thi</Title>
          
          <div className="flex justify-center">
            <Progress
              type="circle"
              percent={percentage}
              format={(percent) => `${percent}%`}
              size={180}
              strokeWidth={8}
              status={percentage >= 40 ? "success" : "exception"}
            />
          </div>

          <div className="space-y-2">
            <Title level={3}>{getResultMessage()}</Title>
            <Text className="text-lg block">
              Số Câu Đúng: {score}/{total}
            </Text>
            {earlyEnd && (
              <Text type="secondary" className="block">
                Bài thi đã kết thúc sau khi làm {questionsAttempted} câu hỏi
              </Text>
            )}
          </div>

          <Space size="middle">
            <Button type="primary" onClick={handleReviewAnswers}>
              Xem Lại Chi Tiết
            </Button>
            <Button onClick={handleReturnHome}>
              Trang Chủ
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Result2;
