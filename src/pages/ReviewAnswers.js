import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, List, Space, Tag, Empty } from 'antd';
import { HomeFilled } from '@ant-design/icons';

const { Title, Text } = Typography;

function ReviewAnswers() {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions = [], userAnswers = [] } = location.state || {};

    console.log('Review State:', { questions, userAnswers }); // Debug log

    if (!questions?.length || !userAnswers?.length) {
        return (
            <div className="max-w-3xl mx-auto p-4">
                <Space className="w-full justify-between mb-4">
                    <Title level={2}>Review Answers</Title>
                    <Button type="primary" icon={<HomeFilled />} onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                </Space>
                <Card>
                    <Empty description="No answers to review" />
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <Space className="w-full justify-between mb-4">
                <Title level={2}>Review Answers</Title>
                <Button
                    type="primary"
                    icon={<HomeFilled />}
                    onClick={() => navigate('/')}
                >
                    Back to Home
                </Button>
            </Space>

            <List
                dataSource={questions.slice(0, userAnswers.length)} // Only show answered questions
                renderItem={(question, index) => {
                    const userAnswer = userAnswers[index];
                    if (!userAnswer) return null;

                    return (
                        <Card className="mb-4" key={index}>
                            <Space direction="vertical" className="w-full">
                                <Space className="w-full justify-between">
                                    <Text strong>Question {index + 1}</Text>
                                    <Tag color={userAnswer?.isCorrect ? 'success' : 'error'}>
                                        {userAnswer?.isCorrect ? 'Correct' : 'Incorrect'}
                                    </Tag>
                                </Space>
                                <Text>{question?.question}</Text>
                                <List
                                    size="small"
                                    dataSource={question?.answers || []}
                                    renderItem={(answer, ansIndex) => (
                                        <List.Item>
                                            <Space>
                                                {ansIndex === question?.correct && (
                                                    <Tag color="success">Correct Answer</Tag>
                                                )}
                                                {ansIndex === userAnswer?.userAnswer && (
                                                    <Tag color={userAnswer?.isCorrect ? 'success' : 'error'}>
                                                        Your Answer
                                                    </Tag>
                                                )}
                                                <Text>{answer}</Text>
                                            </Space>
                                        </List.Item>
                                    )}
                                />
                            </Space>
                        </Card>
                    );
                }}
            />
        </div>
    );
}

export default ReviewAnswers;
