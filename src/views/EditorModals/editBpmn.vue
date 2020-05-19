<template>
  <BModal
    @ok="updateBpmn"
    @show="setBpmn"
    size="xxl"
    centered
    :title="$t('editor.templates.editModalTitle')"
    id="editBpmnModel">
    <div class="h-100 w-100 p-3 row">
      <PrismEditor
        class="workflow-large-code-editor"
        v-model="editTemplate"
        :line-numbers="true"
        language="js" />
    </div>
  </BModal>
</template>
<script>
import PrismEditor from 'vue-prism-editor';
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

/**
 * Allows for direct XML editing of a workflow, currently no validation is provided
 */
export default {
  name: 'EditBpmnModal',
  components: {
    PrismEditor,
  },
  props: {
    template: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      editTemplate: '',
    };
  },
  methods: {
    updateBpmn() {
      this.$emit('updateBpmn', this.editTemplate);
    },
    setBpmn() {
      this.editTemplate = this.template;
    },
  },
};
</script>
<style lang="scss" scoped>
  .fr-card-clickable {
    height: 120px;
    overflow:hidden;
  }
</style>
