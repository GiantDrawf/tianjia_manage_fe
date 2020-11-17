import { dynamic } from 'umi';

export default dynamic({
  loader: async function () {
    const { default: Editor } = await import(/* webpackChunkName: "external_editor" */ './index');
    return Editor;
  },
});
