import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, Typography, List, Input, Space } from 'antd';

const { Title, Text } = Typography;
const { Search } = Input;

const ViewAllQuestions = () => {
  const location = useLocation();
  const { questions } = location.state || { questions: [] };
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = useMemo(() => {
    return questions.filter(question => 
      question.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (question.explanation && question.explanation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (Array.isArray(question.options) 
        ? question.options.some(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()))
        : Object.values(question.options || {}).some(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    );
  }, [questions, searchQuery]);

  const getOptionsArray = (options) => {
    if (Array.isArray(options)) {
      return options;
    }
    if (typeof options === 'object' && options !== null) {
      return ['A', 'B', 'C', 'D'].map(key => options[key]).filter(Boolean);
    }
    return [];
  };

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: '0 16px' }}>
      <Card>
        <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
          <Title level={2} style={{ textAlign: 'center', color: '#1890ff', marginBottom: 24 }}>
            Tất cả câu hỏi và đáp án
          </Title>
          <Search
            placeholder="Tìm kiếm câu hỏi, đáp án hoặc giải thích..."
            allowClear
            enterButton="Tìm kiếm"
            size="large"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Text type="secondary">
            Hiển thị {filteredQuestions.length} / {questions.length} câu hỏi
          </Text>
        </Space>
        <List
          itemLayout="vertical"
          dataSource={filteredQuestions}
          renderItem={(question, index) => (
            <List.Item>
              <Card type="inner" title={`Câu ${index + 1}`}>
                <Text strong>{question.question}</Text>
                <br />
                <br />
                {(() => {
                  const optionsArray = getOptionsArray(question.options);
                  return optionsArray.length > 0 ? (
                    <>
                      {optionsArray.map((option, optIndex) => (
                        <div key={optIndex} style={{ 
                          marginBottom: '8px',
                          color: (
                            question.correctAnswer === optIndex || 
                            question.answer === String.fromCharCode(65 + optIndex)
                          ) ? '#52c41a' : 'inherit',
                          fontWeight: (
                            question.correctAnswer === optIndex || 
                            question.answer === String.fromCharCode(65 + optIndex)
                          ) ? 'bold' : 'normal'
                        }}>
                          {String.fromCharCode(65 + optIndex)}. {option}
                        </div>
                      ))}
                      {question.explanation && (
                        <div style={{ 
                          marginTop: '16px', 
                          padding: '12px',
                          background: '#f5f5f5',
                          borderRadius: '4px',
                          borderLeft: '4px solid #1890ff'
                        }}>
                          <Text strong>Giải thích: </Text>
                          <Text>{question.explanation}</Text>
                        </div>
                      )}
                    </>
                  ) : (
                    <Text type="warning">Không có câu trả lời cho câu hỏi này</Text>
                  );
                })()}
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ViewAllQuestions;
