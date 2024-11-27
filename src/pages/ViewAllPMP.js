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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-xl rounded-xl border-0">
          <Space direction="vertical" className="w-full mb-8">
            <div className="text-center">
              <Title level={2} className="!text-3xl md:!text-4xl !mb-2 text-blue-600 flex items-center justify-center">
                <BookOutlined className="mr-3" />
                Tất cả câu hỏi và đáp án PMP
              </Title>
              <Text type="secondary" className="text-lg">
                Tìm kiếm và lọc câu hỏi theo chương
              </Text>
            </div>

            <div className="mt-6 space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
              <Select
                className="w-full"
                size="large"
                placeholder={
                  <span className="flex items-center">
                    <FilterOutlined className="mr-2" />
                    Chọn chương
                  </span>
                }
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
                enterButton={
                  <span className="flex items-center">
                    <SearchOutlined className="mr-2" />
                    Tìm kiếm
                  </span>
                }
                size="large"
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <Text>
                <FilterOutlined className="mr-2" />
                Hiển thị {filteredQuestions.length} / {questions.length} câu hỏi
              </Text>
            </div>
          </Space>

          <List
            itemLayout="vertical"
            dataSource={filteredQuestions}
            renderItem={(question, index) => (
              <List.Item className="!px-0 !py-4">
                <Card 
                  type="inner" 
                  className="transform transition-all duration-300 hover:shadow-lg border border-gray-200"
                  title={
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <Space className="text-lg">
                        <QuestionCircleOutlined className="text-blue-500" />
                        <span className="font-semibold">Câu {index + 1}</span>
                      </Space>
                      <Text type="secondary" className="text-sm">
                        {question.chapterName}
                      </Text>
                    </div>
                  }
                >
                  <Text strong className="text-base md:text-lg block mb-6">
                    {question.question}
                  </Text>

                  <div className="space-y-3">
                    {Object.entries(question.options || {}).map(([letter, option]) => (
                      <div
                        key={letter}
                        className={`
                          rounded-lg p-4 border transition-all duration-300
                          ${letter === question.answer 
                            ? 'border-green-500 bg-green-50 hover:bg-green-100' 
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <Text strong className="text-lg min-w-[24px]">
                            {letter}.
                          </Text>
                          <div className="flex-1">
                            <Text className="text-base">{option}</Text>
                          </div>
                          {letter === question.answer && (
                            <Text className="text-green-600 whitespace-nowrap flex items-center">
                              <CheckCircleOutlined className="mr-2" />
                              Đáp án đúng
                            </Text>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {question.explanation && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <Text strong className="flex items-center text-blue-700">
                        <InfoCircleOutlined className="mr-2 text-blue-500" />
                        Giải thích:
                      </Text>
                      <Text className="block mt-2 text-gray-700">
                        {question.explanation}
                      </Text>
                    </div>
                  )}
                </Card>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  );
}

export default ViewAllPMP;