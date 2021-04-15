import { Article } from '@/types/apiTypes';
import React from 'react';
import { dynamic } from 'umi';

export default (dynamic({
  loader: async function () {
    const { default: Editor } = await import(/* webpackChunkName: "external_editor" */ './index');
    return Editor;
  },
}) as unknown) as React.ComponentClass<
  { article: Article; handleContentChange: (newHtml: string) => void },
  any
>;
