import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert } from 'antd';
import './Welcome.less';

export default (): React.ReactNode => (
  <PageContainer>
    <Card>
      <Alert
        message="欢迎来到天佳空调内容发布管理平台。"
        type="success"
        showIcon
        banner
        style={{
          margin: -12,
          marginBottom: 24,
        }}
      />
    </Card>
  </PageContainer>
);
