import { useCallback, useState } from 'react';
import { Modal, Table, Button, Tooltip } from 'antd';
import { aTypeMap, simpleArticleSearchFormItems } from '@/utils/const';
import { Article, GetArticleParams } from '@/types/apiTypes';
import QueryList, { OnSearch } from '../QueryList';
import { useArticleList } from '@/services/article';

interface SelectArticleModalProps {
  modalVisible: boolean;
  onCancel: () => void;
  handleImportArticle: (articles: Article[]) => void;
}

export default function SelectArticleModal(props: SelectArticleModalProps) {
  const { modalVisible = false, onCancel = () => {}, handleImportArticle } = props;
  const [queryParams, setQueryParams] = useState<GetArticleParams>({
    query: {},
    pagination: {
      page: 1,
      pageSize: 100,
    },
    sort: {
      createTime: -1, // 默认按照创建时间倒序排
    },
  });
  const [selectedArticles, setSelectedArticles] = useState<Article[]>([]);
  const { isValidating: loading, data: listData } = useArticleList(queryParams);
  const dataSource = listData?.data?.list || [];
  const total = listData?.data?.pagination?.total || 0;
  const onSearch = useCallback(({ searchParam, pageInfo }: OnSearch) => {
    setQueryParams({
      query: { ...searchParam },
      pagination: {
        page: pageInfo.pageNo,
        pageSize: pageInfo.pageSize || 10,
      },
    });
  }, []);
  const articleColumns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      ellipsis: true,
      render: (title: string, record: Article) => (
        <Tooltip title={title}>
          <a href={`/#/article/edit/${record.aid}`} target="_blank">
            {title}
          </a>
        </Tooltip>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => aTypeMap[type]?.label || '未知类型',
    },
    {
      title: '描述',
      dataIndex: 'summary',
      key: 'summary',
      ellipsis: true,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 50,
      render: (_: any, record: Article) => (
        <a onClick={() => handleImportArticle([record])}>导入</a>
      ),
    },
  ];
  const handleBatchImportArticles = useCallback(() => {
    handleImportArticle(selectedArticles);
  }, [selectedArticles, handleImportArticle]);

  return (
    <Modal width={900} title="添加文章" visible={modalVisible} onCancel={onCancel} footer={null}>
      <QueryList
        {...{
          initialValues: { pageSize: 100 },
          formItem: simpleArticleSearchFormItems,
          formSize: 'small',
          total,
          onSearch,
          plusAction: (
            <Button disabled={!selectedArticles.length} onClick={handleBatchImportArticles}>
              批量导入
            </Button>
          ),
        }}
      >
        <Table
          locale={{ emptyText: '暂无文章' }}
          columns={articleColumns}
          loading={loading}
          dataSource={dataSource}
          rowKey="aid"
          pagination={false}
          scroll={{ y: 250 }}
          size="small"
          rowSelection={{
            onChange: (_, selectedRows: Article[]) => setSelectedArticles(selectedRows),
          }}
        />
      </QueryList>
    </Modal>
  );
}
