import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, Space, Progress, Typography, Modal, Spin, message } from 'antd';
import { StopOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function QuizPMP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showEndModal, setShowEndModal] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [canNavigate, setCanNavigate] = useState(false);
  const { selectedChapters } = location.state || {};

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://qlda-8ec11-default-rtdb.asia-southeast1.firebasedatabase.app/rita.json');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        const selectedQuestions = selectedChapters.flatMap(chapterId => {
          const chapter = data[chapterId];
          return chapter.questions.map((q, index) => ({
            ...q,
            question: q.question,
            // Chuyển đổi options object thành mảng với key và value
            answers: Object.entries(q.options).map(([key, value]) => `${key}. ${value}`),
            // Map answer (D) sang index trong mảng answers (3)
            correct: Object.keys(q.options).indexOf(q.answer),
            explanation: q.explanation,
            index: index,
            chapterId: chapterId,
            // Giữ lại thông tin gốc cho phần review
            originalAnswer: q.answer,
            originalOptions: q.options
          }));
        });
        setQuestions(selectedQuestions);
        setLoading(false);
      } catch (error) {
        message.error('Không thể tải các câu hỏi');
        setLoading(false);
      }
    };

    if (selectedChapters) {
      fetchQuestions();
    }
  }, [selectedChapters]);

  const handleAnswerClick = (answerIndex) => {
    if (showAnswer) return;
    
    const isCorrect = answerIndex === questions[currentQuestion].correct;
    setSelectedAnswer(answerIndex);
    setShowAnswer(true);
    setCanNavigate(true);
    
    if (isCorrect) {
      setScore(score + 1);
    }
    setUserAnswers([...userAnswers, {
      questionIndex: currentQuestion,
      userAnswer: answerIndex,
      isCorrect
    }]);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowAnswer(false);
      setSelectedAnswer(null);
      setCanNavigate(false);
    } else {
      handleEndQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswer = userAnswers.find(a => a.questionIndex === currentQuestion - 1);
      if (prevAnswer) {
        setShowAnswer(true);
        setSelectedAnswer(prevAnswer.userAnswer);
      }
    }
  };

  const handleEndQuiz = () => {
    navigate('/result-pmp', { 
      state: { 
        score,
        total: questions.length,
        questions,
        userAnswers,
        isPMP: true
      } 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <Card className="w-full max-w-4xl mx-auto">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Progress 
              percent={((currentQuestion + 1) / questions.length) * 100} 
              className="flex-1 mr-4"
            />
            <Button 
              type="default" 
              danger
              icon={<StopOutlined />}
              onClick={() => setShowEndModal(true)}
            >
              Kết thúc bài thi
            </Button>
          </div>

          <Title level={4}>{questions[currentQuestion].question}</Title>

          <Space direction="vertical" className="w-full">
            {questions[currentQuestion].answers.map((answer, index) => (
              <Button
                key={index}
                block
                onClick={() => handleAnswerClick(index)}
                className={`text-left ${
                  showAnswer && index === questions[currentQuestion].correct
                    ? 'border-green-500'
                    : showAnswer && index === selectedAnswer
                    ? 'border-red-500'
                    : ''
                }`}
                disabled={showAnswer}
              >
                {answer}
                {showAnswer && index === questions[currentQuestion].correct && (
                  <CheckCircleOutlined className="text-green-500 ml-2" />
                )}
                {showAnswer && index === selectedAnswer && index !== questions[currentQuestion].correct && (
                  <CloseCircleOutlined className="text-red-500 ml-2" />
                )}
              </Button>
            ))}
          </Space>

          {showAnswer && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <Text strong>
                {selectedAnswer === questions[currentQuestion].correct ? "✅ Đúng!" : "❌ Sai!"}
              </Text>
              <Text className="block mt-2">
                Giải thích: {questions[currentQuestion].explanation}
              </Text>
            </div>
          )}

          <div className="flex justify-between mt-4">
            <Button onClick={handlePrevious} disabled={currentQuestion === 0}>
              Câu trước
            </Button>
            <Button 
              type="primary" 
              onClick={handleNext}
              disabled={!showAnswer}
            >
              {currentQuestion === questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp'}
            </Button>
          </div>
        </div>
      </Card>

      <Modal
        title="Kết thúc bài thi sớm"
        open={showEndModal}
        onOk={handleEndQuiz}
        onCancel={() => setShowEndModal(false)}
        okText="Có, kết thúc"
        cancelText="Không, tiếp tục"
      >
        <p>Bạn có chắc muốn kết thúc bài thi? Điểm hiện tại của bạn là: {score}/{currentQuestion + 1}</p>
      </Modal>
    </div>
  );
}

export default QuizPMP;
