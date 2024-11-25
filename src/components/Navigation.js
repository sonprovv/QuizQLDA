import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

function Navigation() {
  return (
    <Menu mode="horizontal" className="justify-end">
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/">Home</Link>
      </Menu.Item>
    </Menu>
  );
}

export default Navigation;
