import { useNavigate } from 'react-router-dom';
import { Button, Typography, Checkbox, Row, Col, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title } = Typography;

function Home() {
  const navigate = useNavigate();
  const [selectedPackages, setSelectedPackages] = useState([]);
  const packages = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: `Gói ${i + 1} (Câu hỏi ${i * 50 + 1}-${(i + 1) * 50})`,
  }));

  const handleStartQuiz = () => {
    if (selectedPackages.length === 0) {
      message.warning('Vui lòng chọn ít nhất một gói câu hỏi');
      return;
    }
    navigate('/quiz', { state: { packages: selectedPackages } });
  };

  return (
    <div className="flex flex-col items-center space-y-8 mt-8 px-4">
      <Title className="text-center text-2xl sm:text-3xl md:text-4xl !mb-0">
        Ôn Tập Quản Lý Dự Án
      </Title>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Chọn gói câu hỏi:</h2>
          <Row gutter={[16, 16]}>
            {packages.map(pkg => (
              <Col key={pkg.id} xs={24} sm={12} md={8}>
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPackages([...selectedPackages, pkg.id]);
                    } else {
                      setSelectedPackages(selectedPackages.filter(id => id !== pkg.id));
                    }
                  }}
                  className="w-full py-2 px-3 hover:bg-gray-50 rounded transition-colors"
                >
                  <span className="text-sm">{pkg.name}</span>
                </Checkbox>
              </Col>
            ))}
          </Row>
        </div>
        <div className="flex justify-center">
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            onClick={handleStartQuiz}
            className="min-w-[200px] h-12 text-base font-medium"
          >
            Bắt Đầu ({selectedPackages.length} gói đã chọn)
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;