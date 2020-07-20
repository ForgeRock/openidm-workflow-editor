<!--
Copyright (c) 2020 ForgeRock. All rights reserved.

This software may be modified and distributed under the terms
of the MIT license. See the LICENSE file for details.
-->

<template>
  <div class="fr-key-value-panel p-3">
    <BFormInput
      v-model="key"
      class="mb-3"
      :placeholder="$t('editor.templates.resourceName')" />
    <PrismEditor
      class="workflow-code-editor"
      v-model="value"
      :line-numbers="true"
      language="js" />
    <div class="fr-key-value-add-panel-footer mt-3">
      <div class="pt-3 mr-3">
        <span
          class="fr-key-link"
          @click="$emit('cancel')">
          Cancel
        </span>
      </div>
      <BButton
        @click="saveKeyValue"
        variant="outline-primary">
        Save
      </BButton>
    </div>
  </div>
</template>

<script>
import {
  BButton,
  BFormInput,
} from 'bootstrap-vue';
import PrismEditor from 'vue-prism-editor';
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'vue-prism-editor/dist/VuePrismEditor.css';

/**
 * New/Edit Key value pair component
 */
export default {
  name: 'KeyValuePanel',
  components: {
    BButton,
    BFormInput,
    PrismEditor,
  },
  props: {
    keyValue: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      key: '',
      value: '',
    };
  },
  mounted() {
    this.key = this.keyValue.key;
    this.value = this.keyValue.value;
  },
  methods: {
    saveKeyValue() {
      this.$emit('saveKeyValue', { key: this.key, value: this.value });
    },
  },
};
</script>
<style lang="scss" scoped>
.fr-key-value-panel {
  background-color: $gray-100;
}

.fr-key-value-add-panel-footer {
  display: flex;
  justify-content: flex-end;
}

.fr-key-link {
  color: $blue;
  position: relative;
  top: 3px;

  &:hover {
    cursor: pointer;
    color: $hover-blue;
  }
}
</style>
