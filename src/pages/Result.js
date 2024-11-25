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
    <Card className="w-full max-w-md mx-auto">
      <AntResult
        status={percentage >= 70 ? "success" : "warning"}
        title={<span className="text-lg sm:text-xl">{earlyEnd ? "Quiz Ended Early" : "Quiz Completed!"}</span>}
        subTitle={
          <div className="space-y-4">
            <Title level={3} className="text-base sm:text-lg">
              You scored {score} out of {earlyEnd ? questionsAttempted : total} ({percentage}%)
            </Title>
            {earlyEnd && (
              <Text type="secondary" className="text-sm sm:text-base">
                Quiz ended early. Attempted {questionsAttempted} out of {total} questions.
              </Text>
            )}
            <div className="text-left">
              <Text strong className="text-sm sm:text-base">Packages attempted:</Text>
              <List
                size="small"
                className="mt-2"
                dataSource={packages.sort((a, b) => a - b)}
                renderItem={pkg => (
                  <List.Item className="text-xs sm:text-sm">
                    Package {pkg} (Questions {(pkg-1)*50 + 1}-{pkg*50})
                  </List.Item>
                )}
              />
            </div>
          </div>
        }
        extra={
          <Space wrap className="justify-center w-full">
            <Button 
              type="primary" 
              icon={<HomeFilled />}
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
            <Button
              type="default"
              icon={<FileSearchOutlined />}
              onClick={() => navigate('/review', { 
                state: { questions, userAnswers }
              })}
            >
              Review Answers
            </Button>
          </Space>
        }
      />
    </Card>
  );
}

export default ResultPage;
