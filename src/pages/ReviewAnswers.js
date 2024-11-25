import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, List, Space, Tag, Empty } from 'antd';
import { HomeFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

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
                <Button type="primary" icon={<HomeFilled />} onClick={() => navigate('/')}>
                    Back to Home
                </Button>
            </Space>
            <List
                dataSource={questions}
                renderItem={(question, index) => {
                    const userAnswer = userAnswers.find(a => a.questionIndex === index);
                    if (!userAnswer) return null;

                    return (
                        <Card className="mb-4" key={index}>
                            <Space direction="vertical" className="w-full">
                                <Text strong>{`Question ${index + 1}: ${question.question}`}</Text>
                                <Space>
                                    <Text>Your answer: </Text>
                                    <Tag color={userAnswer.isCorrect ? 'success' : 'error'}>
                                        {question.answers[userAnswer.userAnswer]}
                                    </Tag>
                                </Space>
                                <Space>
                                    <Text>Correct answer: </Text>
                                    <Tag color="success">{question.answers[question.correct]}</Tag>
                                </Space>
                                {userAnswer.isCorrect ? (
                                    <Text type="success"><CheckCircleFilled /> Correct!</Text>
                                ) : (
                                    <Text type="danger"><CloseCircleFilled /> Incorrect</Text>
                                )}
                            </Space>
                        </Card>
                    );
                }}
            />
        </div>
    );
}

export default ReviewAnswers;