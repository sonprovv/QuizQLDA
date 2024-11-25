import { useState, useEffect } from 'react';
import { Radio, Button, Card, Typography, Checkbox } from 'antd';
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
        const response = await fetch('https://qlda-8ec11-default-rtdb.asia-southeast1.firebasedatabase.app/277/-OCZeDWiLN4v3Fi5SCp1/questions.json');
        const questions = await response.json();
        
        // Split questions into sets of 50
        const sets = [];
        for (let i = 0; i < questions.length; i += 50) {
          sets.push({
            name: `Set ${Math.floor(i/50) + 1} (Questions ${i + 1}-${Math.min(i + 50, questions.length)})`,
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
    <div style={{ maxWidth: 800, margin: '20px auto', padding: '0 16px' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', color: '#1890ff' }}>
          Bộ đề 277 câu
        </Title>
        
        <Text style={{ display: 'block', marginBottom: 20, textAlign: 'center' }}>
          Vui lòng chọn một hoặc nhiều bộ câu hỏi bạn muốn làm bài
        </Text>

        <div style={{ 
          background: '#f5f5f5',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <Checkbox.Group 
            onChange={handleSetChange} 
            value={selectedSets}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px'
            }}
          >
            {questionSets.map((set, index) => (
              <Checkbox key={index} value={index}>
                {set.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Button
            type="primary"
            size="large"
            onClick={handleStartQuiz}
            disabled={selectedSets.length === 0}
            style={{ 
              minWidth: 200,
              height: 45,
              fontSize: '16px',
              fontWeight: 'bold',
              marginRight: '16px'
            }}
          >
            Bắt đầu làm bài
          </Button>
          <Button
            type="default"
            size="large"
            onClick={handleViewAllQuestions}
            disabled={questionSets.length === 0}
            style={{ 
              minWidth: 200,
              height: 45,
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Xem tất cả câu hỏi
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Question277;
