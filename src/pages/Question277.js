import { useState, useEffect } from 'react';
import { Radio, Button, Card, Typography, Checkbox, Row, Col, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import Quiz2 from './Quiz2';

const { Text, Title } = Typography;

const Question277 = () => {
  const [questionSets, setQuestionSets] = useState([]);
  const [selectedSets, setSelectedSets] = useState([]); // Changed from selectedSet to selectedSets
  const [startQuiz, setStartQuiz] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionSet = async () => {
      try {
        const response = await fetch('https://qlda-8ec11-default-rtdb.asia-southeast1.firebasedatabase.app/277/-OCcPxP7mgos5yKb_9Tg/questions.json');
        const questions = await response.json();
        
        // Split questions into sets of 50
        const sets = [];
        for (let i = 0; i < questions.length; i += 50) {
          sets.push({
            name: `Gói ${Math.floor(i/50) + 1} (Câu hỏi ${i + 1}-${Math.min(i + 50, questions.length)})`,
            questions: questions.slice(i, i + 50)
          });
        }
        setQuestionSets(sets);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestionSet();
  }, []);

  const handleSetChange = (values) => {
    setSelectedSets(values);
  };

  const handleStartQuiz = () => {
    if (selectedSets.length > 0) {
      // Combine all selected question sets
      const combinedQuestions = selectedSets.reduce((acc, setIndex) => {
        return [...acc, ...questionSets[setIndex].questions];
      }, []);
      
      navigate('/quiz2', { 
        state: { questions: combinedQuestions }
      });
    }
  };

  const handleViewAllQuestions = () => {
    if (questionSets.length > 0) {
      // Combine all questions from all sets
      const allQuestions = questionSets.reduce((acc, set) => {
        return [...acc, ...set.questions];
      }, []);
      
      navigate('/review-all-277', { 
        state: { questions: allQuestions }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 w-full">
      <Card className="shadow-md">
        <Title 
          level={2} 
          className="text-center text-blue-500 md:text-3xl text-2xl mb-6"
        >
          277 câu hỏi Quản lý dự án
        </Title>

        <div className="bg-gray-100 p-4 md:p-5 rounded-lg mb-5">
          <Checkbox.Group 
            onChange={handleSetChange} 
            value={selectedSets}
            className="flex flex-col space-y-3"
          >
            {questionSets.map((set, index) => (
              <Checkbox key={index} value={index}>
                <span className="md:text-base text-sm">
                  {set.name}
                </span>
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>

        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} md={12} lg={8}>
            <Button
              type="primary"
              size="large"
              onClick={handleStartQuiz}
              disabled={selectedSets.length === 0}
              block
              className="h-12 font-bold text-base"
            >
              Bắt đầu làm bài
            </Button>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Button
              type="default"
              size="large"
              onClick={handleViewAllQuestions}
              disabled={questionSets.length === 0}
              block
              className="h-12 font-bold text-base"
            >
              Xem tất cả câu hỏi
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Question277;
