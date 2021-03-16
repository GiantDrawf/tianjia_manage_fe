/*
 * @Author: zhujian1995@outlook.com
 * @Date: 2020-10-12 09:57:09
 * @LastEditors: zhujian
 * @LastEditTime: 2021-03-16 10:40:22
 * @Description: 你 kin 你擦
 */
import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Row, Col } from 'antd';
import './Welcome.less';
import { usePerformance } from '@/services/os';
import { Gauge, Liquid } from '@ant-design/charts';

export default (): React.ReactNode => {
  const { data: performance, isValidating: loading } = usePerformance();

  const performanceInfo = performance?.data || {};
  const cpuUsedConfig = {
    padding: 20,
    percent: performanceInfo.cpuUsed || 0,
    range: { color: 'l(0) 0:#bde8ff 1:#0112f6' },
    startAngle: Math.PI,
    endAngle: 2 * Math.PI,
    indicator: false,
    statistic: {
      title: {
        offsetY: -36,
        style: {
          fontSize: '18px',
          lineHeight: '40px',
          color: '#4B535E',
        },
        formatter: function formatter() {
          return performanceInfo.cpuUsed ? `${(performanceInfo.cpuUsed * 100).toFixed(2)}%` : '0%';
        },
      },
      content: {
        style: {
          fontSize: '14px',
          lineHeight: '16px',
          color: '#4B535E',
        },
        formatter: function formatter() {
          return `cpu占用-共${performanceInfo.cpuCount}核`;
        },
      },
    },
  };
  const memUsedConfig = {
    padding: 20,
    percent: performanceInfo.memUsed || 0,
    range: { color: 'l(0) 0:#30BF78 0.5:#FAAD14 1:#F4664A' },
    startAngle: Math.PI,
    endAngle: 2 * Math.PI,
    indicator: false,
    statistic: {
      title: {
        offsetY: -36,
        style: {
          fontSize: '18px',
          lineHeight: '40px',
          color: '#4B535E',
        },
        formatter: function formatter() {
          return performanceInfo.memUsed ? `${(performanceInfo.memUsed * 100).toFixed(2)}%` : '0%';
        },
      },
      content: {
        style: {
          fontSize: '14px',
          lineHeight: '16px',
          color: '#4B535E',
        },
        formatter: function formatter() {
          return `内存占用-共${performanceInfo.memTotal}GB`;
        },
      },
    },
  };
  const driverUsedConfig = {
    padding: 20,
    percent: performanceInfo.driveUsage || 0,
    statistic: {
      title: {
        style: {
          fontSize: '18px',
          lineHeight: '40px',
          color: '#4B535E',
        },
        formatter: function formatter() {
          return performanceInfo.driveUsage
            ? `${(performanceInfo.driveUsage * 100).toFixed(2)}%`
            : '0%';
        },
      },
      content: {
        style: {
          fontSize: '15px',
        },
        formatter: () => `磁盘容量-共${performanceInfo.driveTotal}`,
      },
    },
  };

  return (
    <PageContainer>
      <Card>
        <Alert message="欢迎来到天佳空调内容发布管理平台。" type="success" showIcon banner />
      </Card>
      <Card style={{ marginTop: 20 }} title="系统状态指标">
        <Row align="middle" justify="center">
          <Col md={{ span: 8 }} style={{ height: 200 }}>
            <Gauge {...cpuUsedConfig} />
          </Col>
          <Col md={{ span: 8 }} style={{ height: 200 }}>
            <Gauge {...memUsedConfig} />
          </Col>
          <Col md={{ span: 8 }} style={{ height: 200 }}>
            <Liquid {...driverUsedConfig} />
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};
