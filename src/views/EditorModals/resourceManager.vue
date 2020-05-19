<template>
  <BModal
    @hide="saveScripts"
    hide-footer
    size="xxl"
    scrollable
    :title="$t('editor.templates.resourceManagerTitle')"
    id="scriptManager">
    <BCard class="fr-resource-body">
      <KeyValueList
        v-model="codeKeyValue" />
    </BCard>
  </BModal>
</template>
<script>
import {
  BCard,
} from 'bootstrap-vue';

import KeyValueList from '@/components/KeyValueList/';

/**
 * Dialog that manages the key/value storage of the current workflows scripts
 */
export default {
  name: 'ResourceManagerModal',
  components: {
    BCard,
    KeyValueList,
  },
  props: {
    scripts: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      codeKeyValue: {},
    };
  },
  methods: {
    saveScripts() {
      this.$emit('updateScripts', this.codeKeyValue);
    },
  },
  watch: {
    scripts() {
      this.codeKeyValue = this.scripts;
    },
  },
};
</script>
<style lang="scss" scoped>
  .card.fr-resource-body {
    min-height: 500px;
  }
</style>
