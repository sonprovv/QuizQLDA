import { Card, Button, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ReviewAnswer2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { questions, userAnswers } = location.state || {};

  if (!questions || !userAnswers) {
    return <div>Không có dữ liệu để xem lại</div>;
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <Card className="max-w-4xl mx-auto mb-4">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Title level={4}>Xem lại đáp án</Title>
            <Button onClick={() => navigate('/')}>Về trang chủ</Button>
          </div>

          {questions.map((question, index) => {
            const userAnswer = userAnswers.find(a => a.questionIndex === index);
            
            return (
              <div key={index} className="border-b pb-6 last:border-b-0">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                  <Text className="text-lg whitespace-pre-wrap">
                    
                    {question.question}
                  </Text>
                </div>

                <div className="space-y-3">
                  {Object.entries(question.options).map(([key, value]) => (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border ${
                        key === question.answer
                          ? 'border-green-500 bg-green-50'  // Luôn bôi màu xanh cho đáp án đúng
                          : userAnswer?.userAnswer === key 
                          ? 'border-red-500 bg-red-50'      // Bôi màu đỏ cho đáp án sai đã chọn
                          : 'border-gray-200'               // Màu mặc định cho các options khác
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <Text>{`${key}. ${value}`}</Text>
                        <div className="flex items-center gap-2">
                          {key === question.answer && (
                            <Text className="text-green-500">
                              <CheckCircleOutlined /> Đáp án đúng
                            </Text>
                          )}
                          {userAnswer?.userAnswer === key && key !== question.answer && (
                            <Text className="text-red-500">
                              <CloseCircleOutlined /> Đáp án của bạn
                            </Text>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {question.explanation && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <Text strong>Giải thích:</Text>
                    <Text className="block mt-2 whitespace-pre-wrap">
                      {question.explanation}
                    </Text>
                  </div>
                )}

                <div className="mt-2 text-right">
                  <Text type="secondary">
                    {userAnswer ? (
                      userAnswer.isCorrect ? (
                        <span className="text-green-500">✓ Bạn đã trả lời đúng</span>
                      ) : (
                        <span className="text-red-500">✗ Bạn đã trả lời sai</span>
                      )
                    ) : (
                      <span className="text-yellow-500">! Bạn chưa trả lời - Đáp án đúng: {question.answer}</span>
                    )}
                  </Text>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default ReviewAnswer2;
