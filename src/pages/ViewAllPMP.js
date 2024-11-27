import React, { useState, useMemo, useEffect } from 'react';
import { Card, Typography, List, Input, Space, Select, Spin, message } from 'antd';
import { 
  SearchOutlined, 
  BookOutlined, 
  CheckCircleOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined,
  FilterOutlined
} from '@ant-design/icons';

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
    gap: '8px',
    transition: 'all 0.3s ease'
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Card className="shadow-lg">
        <Space direction="vertical" className="w-full mb-6">
          <Title level={2} className="text-center text-blue-500 mb-6 flex items-center justify-center">
            <BookOutlined className="mr-2" />
            Tất cả câu hỏi và đáp án PMP
          </Title>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              className="w-full"
              placeholder={<><FilterOutlined /> Chọn chương</>}
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
              enterButton={<>
                <SearchOutlined /> Tìm kiếm
              </>}
              size="large"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <Text type="secondary" className="text-sm">
            <FilterOutlined className="mr-1" />
            Hiển thị {filteredQuestions.length} / {questions.length} câu hỏi
          </Text>
        </Space>

        <List
          itemLayout="vertical"
          dataSource={filteredQuestions}
          renderItem={(question, index) => (
            <List.Item className="mb-4">
              <Card 
                type="inner" 
                className="hover:shadow-md transition-shadow duration-300"
                title={
                  <Space>
                    <QuestionCircleOutlined className="text-blue-500" />
                    <span>Câu {index + 1}</span>
                    <Text type="secondary" className="text-sm">({question.chapterName})</Text>
                  </Space>
                }
              >
                <Text strong className="text-base block mb-4">
                  {question.question}
                </Text>

                <div className="space-y-2">
                  {Object.entries(question.options || {}).map(([letter, option]) => (
                    <div
                      key={letter}
                      style={getAnswerStyle(letter, question.answer)}
                      className="hover:shadow-sm transition-all duration-300"
                    >
                      <Text strong className="w-6">
                        {letter}.
                      </Text>
                      <div className="flex-1">
                        {option}
                      </div>
                      {letter === question.answer && (
                        <Text className="text-green-500 ml-auto flex items-center">
                          <CheckCircleOutlined className="mr-1" /> Đáp án đúng
                        </Text>
                      )}
                    </div>
                  ))}
                </div>

                {question.explanation && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <Text strong className="flex items-center">
                      <InfoCircleOutlined className="mr-2 text-blue-500" />
                      Giải thích:
                    </Text>
                    <Text className="block mt-2">{question.explanation}</Text>
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
