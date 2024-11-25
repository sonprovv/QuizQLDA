import { Link } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, BookOutlined, UserOutlined, TrophyOutlined } from '@ant-design/icons';

function Navigation() {
  return (
    <Menu mode="horizontal" className="nav-menu px-4 shadow-md bg-white">
      
      
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/">Trang chủ</Link>
      </Menu.Item>
      
    </Menu>
  );
}

export default Navigation;
