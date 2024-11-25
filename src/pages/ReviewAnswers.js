import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button, Typography, List, Space, Tag, Empty } from 'antd';
import { HomeFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

const { Title, Text } = Typography;

function ReviewAnswers() {
    const location = useLocation();
    const navigate = useNavigate();
    const { questions = [], userAnswers = [] } = location.state || {};

    const getRealQuestionNumber = (question) => {
        return ((question.packageId - 1) * 50) + question.orderNumber;
    };

    if (!questions?.length) {
        return (
            <div className="max-w-3xl mx-auto p-4">
                <Space className="w-full justify-between mb-4">
                    <Title level={2}>Xem lại đáp án</Title>
                    <Button type="primary" icon={<HomeFilled />} onClick={() => navigate('/')}>
                        Trang chủ
                    </Button>
                </Space>
                <Card>
                    <Empty description="Không có câu trả lời để xem lại" />
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full max-w-3xl mx-auto p-4">
            <Space className="w-full justify-between mb-4 flex-wrap">
                <Title level={2} className="text-lg sm:text-2xl !mb-0">Xem lại đáp án</Title>
                <Button type="primary" icon={<HomeFilled />} onClick={() => navigate('/')}>
                    Trang chủ
                </Button>
            </Space>
            <List
                dataSource={questions}
                renderItem={(question) => {
                    const userAnswer = userAnswers.find(a => a.questionIndex === question.index);
                    return (
                        <Card 
                            className="mb-4" 
                            key={question.id}
                            size="small" 
                            bodyStyle={{ padding: '16px' }}
                            title={
                                <div className="flex justify-between items-center">
                                    <Text strong className="text-sm sm:text-base">
                                        Câu {getRealQuestionNumber(question)}
                                    </Text>
                                    {!userAnswer && (
                                        <Tag color="default">Chưa làm</Tag>
                                    )}
                                </div>
                            }
                        >
                            <Space direction="vertical" className="w-full" size="middle">
                                <Text className="text-sm sm:text-base block mb-2">
                                    {question.question}
                                </Text>
                                
                                <div className="pl-4 space-y-2">
                                    {question.answers.map((answer, ansIndex) => (
                                        <div key={ansIndex} className="flex items-start space-x-2">
                                            {ansIndex === question.correct ? (
                                                <CheckCircleFilled className="text-green-500 mt-1" />
                                            ) : userAnswer?.userAnswer === ansIndex ? (
                                                <CloseCircleFilled className="text-red-500 mt-1" />
                                            ) : (
                                                <span className="w-4 h-4 inline-block" />
                                            )}
                                            <Text className={`text-sm sm:text-base ${
                                                ansIndex === question.correct ? 'text-green-600 font-medium' :
                                                userAnswer?.userAnswer === ansIndex ? 'text-red-600' : ''
                                            }`}>
                                                {answer}
                                            </Text>
                                        </div>
                                    ))}
                                </div>

                                {question.explanation && (
                                    <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                                        <Text strong className="text-sm">Giải thích:</Text>
                                        <Text className="text-sm block mt-1">{question.explanation}</Text>
                                    </div>
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