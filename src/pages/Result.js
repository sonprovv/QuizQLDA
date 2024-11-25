import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, Result as AntResult, List, Space } from 'antd';
import { HomeFilled, FileSearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    score, 
    total, 
    packages = [], 
    questions = [], 
    userAnswers = [],
    earlyEnd,
    questionsAttempted 
  } = location.state || {};
  const percentage = Math.round((score / total) * 100);

  return (
    <Card className="w-full max-w-md mx-auto p-4 md:p-6">
      <AntResult
        status={percentage >= 70 ? "success" : "warning"}
        title={
          <span className="text-lg sm:text-xl font-semibold">
            {earlyEnd ? "Kết thúc bài thi sớm" : "Hoàn thành bài thi!"}
          </span>
        }
        subTitle={
          <div className="space-y-4">
            <Title level={3} className="text-base sm:text-lg">
              Bạn đạt {score}/{earlyEnd ? questionsAttempted : total} điểm ({percentage}%)
            </Title>
            {earlyEnd && (
              <Text type="secondary" className="text-sm sm:text-base block">
                Bài thi kết thúc sớm. Đã làm {questionsAttempted}/{total} câu hỏi.
              </Text>
            )}
            <div className="text-left mt-4">
              <Text strong className="text-sm sm:text-base">
                Các gói câu hỏi đã làm:
              </Text>
              <List
                size="small"
                className="mt-2"
                dataSource={packages.sort((a, b) => a - b)}
                renderItem={pkg => (
                  <List.Item className="text-xs sm:text-sm py-2">
                    Gói {pkg} (Câu hỏi {(pkg-1)*50 + 1}-{pkg*50})
                  </List.Item>
                )}
              />
            </div>
          </div>
        }
        extra={
          <Space wrap className="justify-center w-full mt-4">
            <Button 
              type="primary" 
              icon={<HomeFilled />}
              onClick={() => navigate('/')}
              className="min-w-[120px]"
            >
              Trang chủ
            </Button>
            <Button
              type="default"
              icon={<FileSearchOutlined />}
              onClick={() => navigate('/review', { 
                state: { questions, userAnswers }
              })}
              className="min-w-[120px]"
            >
              Xem lại đáp án
            </Button>
          </Space>
        }
      />
    </Card>
  );
}

export default ResultPage;
