import { Typography, List, Card, Tag, Select, Space, Button, Input } from 'antd';
import { useState, useEffect } from 'react';
import { HomeFilled } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const { Title, Text } = Typography;

function Questions() {
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const packages = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: `Gói ${i + 1} (Câu hỏi ${i * 50 + 1}-${(i + 1) * 50})`,
  }));

  useEffect(() => {
    if (!location.state?.questions) {
      navigate('/');
      return;
    }
    setQuestions(location.state.questions);
    setLoading(false);
  }, [location.state, navigate]);

  const filteredQuestions = questions
    .filter(q => selectedPackage === 'all' || q.packageId === parseInt(selectedPackage))
    .filter(q => 
      searchText === '' || 
      q.question.toLowerCase().includes(searchText.toLowerCase()) ||
      q.answers.some(answer => answer.toLowerCase().includes(searchText.toLowerCase()))
    );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Space className="w-full justify-between mb-4 flex-wrap">
        <Title level={2} className="!mb-0">Danh sách câu hỏi</Title>
        <Button type="primary" icon={<HomeFilled />} onClick={() => navigate('/')}>
          Trang chủ
        </Button>
      </Space>

      <div className="flex gap-4 mb-4 flex-wrap">
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={setSelectedPackage}
          options={[
            { value: 'all', label: 'Tất cả gói' },
            ...packages.map(pkg => ({
              value: pkg.id.toString(),
              label: pkg.name
            }))
          ]}
        />
        <Input.Search
          placeholder="Tìm kiếm câu hỏi..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>

      <List
        loading={loading}
        dataSource={filteredQuestions}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} câu hỏi`,
          onChange: (page) => setCurrentPage(page),
          current: currentPage
        }}
        renderItem={(item) => ( // removed index parameter since we're not using it
          <Card className="mb-4" key={item.id}>
            <div className="mb-4">
              <Text strong>Câu {item.orderNumber}:</Text> {item.question}
            </div>
            <div className="pl-4 space-y-2">
              {item.answers.map((answer, index) => (
                <div key={index} className={`p-2 rounded ${index === item.correct ? 'bg-green-50' : ''}`}>
                  {answer}
                  {index === item.correct && (
                    <Tag color="success" className="ml-2">Đáp án đúng</Tag>
                  )}
                </div>
              ))}
            </div>
            {item.explanation && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <Text strong>Giải thích:</Text>
                <div className="mt-1">{item.explanation}</div>
              </div>
            )}
          </Card>
        )}
      />
    </div>
  );
}

export default Questions;
