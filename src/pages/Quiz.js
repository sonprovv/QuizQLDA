import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Button, Space, Progress, Typography, Modal } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showEndModal, setShowEndModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPackages = location.state?.packages || [];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('https://qlda-8ec11-default-rtdb.asia-southeast1.firebasedatabase.app/questions/-OCYRzM0Fnt9yZfaAAwP.json');
        const questionsData = Object.values(response.data);
        
        // Filter questions based on selected packages
        const filteredQuestions = questionsData.filter((_, index) => {
          const packageNumber = Math.floor(index / 50) + 1;
          return selectedPackages.includes(packageNumber);
        });
        
        // Shuffle questions
        const shuffledQuestions = filteredQuestions.sort(() => Math.random() - 0.5);
        setQuestions(shuffledQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [selectedPackages]);

  const handleAnswerClick = (answerIndex) => {
    const isCorrect = answerIndex === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    // Store user's answer
    setUserAnswers([...userAnswers, {
      questionIndex: currentQuestion,
      userAnswer: answerIndex,
      isCorrect
    }]);

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      navigate('/result', { 
        state: { 
          score, 
          total: questions.length,
          packages: selectedPackages,
          questions, // Pass full questions
          userAnswers: [...userAnswers, { // Include last answer
            questionIndex: currentQuestion,
            userAnswer: answerIndex,
            isCorrect
          }]
        } 
      });
    }
  };

  const handleEndQuiz = () => {
    navigate('/result', { 
      state: { 
        score,
        total: questions.length,
        packages: selectedPackages,
        questions: questions.slice(0, currentQuestion + 1), // Only include attempted questions
        userAnswers,
        earlyEnd: true,
        questionsAttempted: currentQuestion + 1
      } 
    });
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Progress 
              percent={(currentQuestion / questions.length) * 100} 
              showInfo={false}
              className="w-full sm:flex-1 sm:mr-4"
            />
            <Button 
              type="default" 
              danger
              icon={<StopOutlined />}
              onClick={() => setShowEndModal(true)}
            >
              End Quiz
            </Button>
          </div>
          <div className="text-right">
            <Text strong className="text-sm sm:text-base">
              Question {currentQuestion + 1}/{questions.length}
            </Text>
          </div>
          <Title level={4} className="text-base sm:text-lg">
            {questions[currentQuestion].question}
          </Title>
          <Space direction="vertical" className="w-full" size="small">
            {questions[currentQuestion].answers.map((answer, index) => (
              <Button 
                key={index}
                block
                size="large"
                onClick={() => handleAnswerClick(index)}
                className="text-left text-sm sm:text-base py-2 px-4"
              >
                {answer}
              </Button>
            ))}
          </Space>
        </div>
      </Card>

      <Modal
        title="End Quiz Early"
        open={showEndModal}
        onOk={handleEndQuiz}
        onCancel={() => setShowEndModal(false)}
        okText="Yes, end quiz"
        cancelText="No, continue"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to end the quiz early? You have completed {currentQuestion} out of {questions.length} questions.</p>
        <p>Your current score is: {score}/{currentQuestion}</p>
      </Modal>
    </>
  );
}

export default Quiz;
