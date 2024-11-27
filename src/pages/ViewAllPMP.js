import React, { useState, useMemo,useEffect } from 'react';
import { Card, Typography, List, Input, Space, Select, Spin, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;

function ViewAllPMP() {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [chapters, setChapters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://qlda-8ec11-default-rtdb.asia-southeast1.firebasedatabase.app/rita.json');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        
        const allChapters = Object.keys(data).map(key => ({
          id: key,
          name: data[key].name
        }));
        setChapters(allChapters);

        const allQuestions = Object.entries(data).flatMap(([chapterId, chapter]) =>
          chapter.questions?.map(q => ({
            ...q,
            chapterId,
            chapterName: chapter.name
          })) || []
        );
        setQuestions(allQuestions);
        setLoading(false);
      } catch (error) {
        message.error('Không thể tải dữ liệu');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredQuestions = useMemo(() => {
    let filtered = questions;
    
    if (selectedChapter !== 'all') {
      filtered = filtered.filter(q => q.chapterId === selectedChapter);
    }

    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(q =>
        q.question.toLowerCase().includes(searchLower) ||
        (q.explanation && q.explanation.toLowerCase().includes(searchLower)) ||
        Object.values(q.options || {}).some(opt => 
          opt.toLowerCase().includes(searchLower)
        )
      );
    }

    return filtered;
  }, [questions, selectedChapter, searchQuery]);

  const getAnswerStyle = (letter, correctAnswer) => ({
    marginBottom: '12px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid',
    borderColor: letter === correctAnswer ? '#52c41a' : '#d9d9d9',
    background: letter === correctAnswer ? '#f6ffed' : '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '20px auto', padding: '0 16px' }}>
      <Card>
        <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
          <Title level={2} style={{ textAlign: 'center', color: '#1890ff', marginBottom: 24 }}>
            Tất cả câu hỏi và đáp án PMP
          </Title>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Select
              style={{ width: '100%' }}
              placeholder="Chọn chương"
              defaultValue="all"
              onChange={setSelectedChapter}
            >
              <Select.Option value="all">Tất cả các chương</Select.Option>
              {chapters.map(chapter => (
                <Select.Option key={chapter.id} value={chapter.id}>
                  {chapter.name}
                </Select.Option>
              ))}
            </Select>

            <Search
              placeholder="Tìm kiếm câu hỏi, đáp án hoặc giải thích..."
              allowClear
              enterButton="Tìm kiếm"
              size="large"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Space>

          <Text type="secondary">
            Hiển thị {filteredQuestions.length} / {questions.length} câu hỏi
          </Text>
        </Space>

        <List
          itemLayout="vertical"
          dataSource={filteredQuestions}
          renderItem={(question, index) => (
            <List.Item>
              <Card 
                type="inner" 
                title={
                  <Space>
                    <span>Câu {index + 1}</span>
                    <Text type="secondary">({question.chapterName})</Text>
                  </Space>
                }
              >
                <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '16px' }}>
                  {question.question}
                </Text>

                <div style={{ padding: '8px 0' }}>
                  {Object.entries(question.options || {}).map(([letter, option]) => (
                    <div
                      key={letter}
                      style={getAnswerStyle(letter, question.answer)}
                    >
                      <Text strong style={{ width: '24px' }}>
                        {letter}.
                      </Text>
                      <div style={{ flex: 1 }}>
                        {option}
                      </div>
                      {letter === question.answer && (
                        <Text style={{ color: '#52c41a', marginLeft: 'auto' }}>
                          ✓ Đáp án đúng
                        </Text>
                      )}
                    </div>
                  ))}
                </div>

                {question.explanation && (
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    borderLeft: '4px solid #1890ff'
                  }}>
                    <Text strong>Giải thích: </Text>
                    <Text>{question.explanation}</Text>
                  </div>
                )}
              </Card>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}

export default ViewAllPMP;
