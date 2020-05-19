<template>
  <div class="mt-3">
    <div
      v-if="!isEmpty(keyValues)"
      class="fr-key-value-list">
      <div
        v-for="(text, key) in keyValues"
        :key="`${id}_keyvalue-${key}`"
        class="fr-key-value-list-item">
        <div class="fr-key-value-list-header mt-3">
          <h5 class="text-truncate">
            {{ key }}
          </h5>
          <div class="fr-key-value-icon-holder">
            <i
              v-if="!disabled"
              @click="deleteItem(key)"
              class="material-icons-outlined mr-1 fr-key-value-icon noselect">
              delete
            </i>
            <i
              v-if="!disabled"
              @click="editItem(key)"
              class="material-icons-outlined fr-key-value-icon noselect">
              edit
            </i>
          </div>
        </div>
        <p class="d-flex">
          <pre class="flex-fill fr-keyvalue-body">
            {{ text }}
          </pre>
        </p>
        <FrKeyValuePanel
          v-if="currentKey === key"
          :key-value="keyValueObject"
          @cancel="currentKey = null"
          @saveKeyValue="saveKeyValue" />
      </div>
    </div>
    <div
      v-if="isEmpty(keyValues) && !currentKey"
      class="fr-key-value-panel text-center py-3">
      <span class="text-secondary">
        ({{ $t('editor.templates.noResourcesDefined') }})
      </span>
    </div>
    <FrKeyValuePanel
      v-if="currentKey === ''"
      :key-value="keyValueObject"
      @cancel="currentKey = null"
      @saveKeyValue="saveKeyValue" />
    <div
      v-else-if="!disabled"
      class="mt-3">
      <span
        class="fr-key-link"
        @click="showAdd()">
        <i class="material-icons-outlined mr-1">
          add
        </i>
        Add
      </span>
    </div>
  </div>
</template>

<script>
import { isEmpty, cloneDeep } from 'lodash';
import KeyValuePanel from './KeyValuePanel';

/**
 * Key value pair component
 */
export default {
  name: 'KeyValueList',
  components: {
    FrKeyValuePanel: KeyValuePanel,
  },
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    let keyValues;

    if (this.value === null) {
      keyValues = {};
    } else {
      keyValues = cloneDeep(this.value);
    }

    return {
      id: null,
      currentKey: null,
      keyValues,
      keyValueObject: { key: '', value: '' },
    };
  },
  watch: {
    value() {
      this.keyValues = this.value;
    },
  },
  mounted() {
    // eslint-disable-next-line no-underscore-dangle
    this.id = this._uid;
  },
  methods: {
    /**
      * Removes an item from the key value list
      *
      * @param {String} key key for the object property to be deleted
      */
    deleteItem(key) {
      this.$delete(this.keyValues, key);
      this.$emit('input', this.keyValues);
    },
    /**
     * Shows edit fields for key and value
     *
     * @param {String} key key for the object property to be edited
     */
    editItem(key) {
      const paredDownKeyValues = cloneDeep(this.keyValues);
      this.$delete(paredDownKeyValues, key);
      this.keyValueObject.value = this.keyValues[key];
      this.keyValueObject.key = key;
      this.currentKey = key;
    },
    /**
      * Check if an object is empty
      *
      * @param {Object} objectToCheck
      */
    isEmpty,
    /**
      * Emits an input change to notify v-model that the component has updated
      *
      * @param {Object} keyValueObject the key and value values to be added/edited in the save
      */
    saveKeyValue(keyValueObject) {
      if (keyValueObject.key !== this.currentKey && this.currentKey !== '') {
        this.$delete(this.keyValues, this.currentKey);
      }
      this.keyValues[keyValueObject.key] = keyValueObject.value;
      this.$emit('input', this.keyValues);
      this.currentKey = null;
    },
    /**
     * Displays blank key and value fields to add a new key-value object
     */
    showAdd() {
      this.keyValueObject.value = '';
      this.keyValueObject.key = '';
      this.currentKey = '';
    },
  },
};
</script>
<style lang="scss" scoped>
.fr-key-value-panel {
  background-color: $gray-100;
}

.fr-key-link {
  color: $blue;
  vertical-align: middle;

  .material-icons-outlined {
    position: relative;
    top: 6px;
  }

  &:hover {
    cursor: pointer;
    color: $hover-blue;
  }
}

.fr-key-value-list {
  .fr-keyvalue-body {
    max-height: 150px;
    overflow: hidden;
  }
  .fr-key-value-list-item {
    border-bottom: 1px solid $gray-200;

    &:hover .d-none {
      display: block !important;
    }

    .fr-key-value-list-header {
      display: flex;
    }

    .fr-key-value-icon-holder {
      margin-left: auto;
    }

    .fr-key-value-icon {
      cursor: pointer;
      color: $gray-500;

      &:hover {
        color: $gray-900;
      }
    }
  }
}
</style>
