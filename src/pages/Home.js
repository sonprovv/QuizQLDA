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
    name: `Package ${i + 1} (Questions ${i * 50 + 1}-${(i + 1) * 50})`,
  }));

  const handleStartQuiz = () => {
    if (selectedPackages.length === 0) {
      message.warning('Please select at least one package');
      return;
    }
    navigate('/quiz', { state: { packages: selectedPackages } });
  };

  return (
    <div className="flex flex-col items-center space-y-8 mt-16">
      <Title>Welcome to QLDA Quiz</Title>
      <Row gutter={[16, 16]} className="max-w-4xl">
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
            >
              {pkg.name}
            </Checkbox>
          </Col>
        ))}
      </Row>
      <Button 
        type="primary" 
        size="large" 
        icon={<PlayCircleOutlined />}
        onClick={handleStartQuiz}
      >
        Start Quiz ({selectedPackages.length} packages selected)
      </Button>
    </div>
  );
}

export default Home;
