import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function ReviewPMP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, userAnswers } = location.state || {};

  const handleReturn = () => {
    navigate('/pmp');
  };

  if (!questions || !userAnswers) {
    return <div>No review data available</div>;
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <Card className="w-full max-w-4xl mx-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Title level={2}>Xem lại đáp án</Title>
            <Button onClick={handleReturn}>Quay lại</Button>
          </div>

          {questions.map((question, index) => {
            const userAnswer = userAnswers.find(a => a.questionIndex === index);
            return (
              <Card key={index} className="mb-4">
                <div className="space-y-4">
                  <Text strong>
                    <div className="flex items-center gap-2">
                      <span>Câu {index + 1}:</span>
                      {userAnswer?.isCorrect ? (
                        <CheckCircleOutlined className="text-green-500" />
                      ) : (
                        <CloseCircleOutlined className="text-red-500" />
                      )}
                    </div>
                  </Text>
                  <Text className="block">{question.question}</Text>

                  <Space direction="vertical" className="w-full">
                    {Object.entries(question.originalOptions).map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-3 border rounded ${
                          key === question.originalAnswer
                            ? 'border-green-500 bg-green-50'
                            : userAnswer?.userAnswer === Object.keys(question.originalOptions).indexOf(key)
                            ? 'border-red-500 bg-red-50'
                            : ''
                        }`}
                      >
                        {key}. {value}
                      </div>
                    ))}
                  </Space>

                  <div className="bg-gray-50 p-3 rounded">
                    <Text strong>Giải thích: </Text>
                    <Text>{question.explanation}</Text>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

export default ReviewPMP;
