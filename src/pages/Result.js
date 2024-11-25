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
    <Card className="max-w-md mx-auto">
      <AntResult
        status={percentage >= 70 ? "success" : "warning"}
        title={earlyEnd ? "Quiz Ended Early" : "Quiz Completed!"}
        subTitle={
          <div className="space-y-4">
            <Title level={3}>
              You scored {score} out of {earlyEnd ? questionsAttempted : total} ({percentage}%)
            </Title>
            {earlyEnd && (
              <Text type="secondary">
                Quiz ended early. Attempted {questionsAttempted} out of {total} questions.
              </Text>
            )}
            <div className="text-left">
              <Text strong>Packages attempted:</Text>
              <List
                size="small"
                dataSource={packages.sort((a, b) => a - b)}
                renderItem={pkg => (
                  <List.Item>
                    Package {pkg} (Questions {(pkg-1)*50 + 1}-{pkg*50})
                  </List.Item>
                )}
              />
            </div>
          </div>
        }
        extra={
          <Space>
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
