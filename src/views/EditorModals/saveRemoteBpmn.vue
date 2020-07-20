<!--
Copyright (c) 2020 ForgeRock. All rights reserved.

This software may be modified and distributed under the terms
of the MIT license. See the LICENSE file for details.
-->

<template>
  <BModal
    @ok="saveBpmn"
    :ok-disabled="name.length === 0"
    size="lg"
    scrollable
    centered
    :title="$t('editor.templates.saveRemoteModalTitle')"
    id="saveRemoteBpmn">
    <p>
      {{ $t('editor.templates.name') }}: <span class="text-muted">{{ name }}</span>
    </p>
    <BListGroup>
      <template v-if="keys(scripts).length > 0">
        <BListGroupItem
          :key="`${scriptName}-scriptitem`"
          v-for="(script, scriptName) in scripts">
          <div>
            <h5 class="mb-1">
              {{ scriptName }}
            </h5>
            <code>{{ script }}</code>
          </div>
        </BListGroupItem>
      </template>
      <BListGroupItem
        class="text-center"
        v-else>
        {{ $t('editor.templates.noScriptsToUpload') }}
      </BListGroupItem>
    </BListGroup>
  </BModal>
</template>
<script>
import { keys } from 'lodash';
import {
  BListGroup,
  BListGroupItem,
} from 'bootstrap-vue';

/**
 * Handles displaying users current workflow information to be saved remotely
 */
export default {
  name: 'SaveRemoteBpmnModal',
  components: {
    BListGroup,
    BListGroupItem,
  },
  props: {
    bpmn: {
      type: String,
      default: '',
    },
    scripts: {
      type: Object,
      default: () => {},
    },
    name: {
      type: String,
      default: 'default name',
    },
    remoteDetails: {
      type: [Object, null],
      default: null,
    },
  },
  data() {
    return {
      codeKeyValue: {},
    };
  },
  methods: {
    /**
     * Saves the bpmn to the current platform / IDM instance
     */
    saveBpmn() {
      if (this.remoteDetails === null) {
        const idmPostInstance = this.getRequestService();

        idmPostInstance.post('/workflow/model', {
          bpmnXML: this.bpmn,
          resourceMap: this.scripts,
          name: this.name,
        }).then((results) => {
          this.$bvToast.toast(this.$t('editor.notifications.workflowSaved'), {
            title: this.$t('editor.notifications.workflowMessageTitle'),
            toaster: 'b-toaster-top-center',
            variant: 'success',
            solid: true,
          });

          this.$emit('saveRemoteBpmn', results.data);
        })
          .catch(() => {
            this.$bvToast.toast(this.$t('editor.notifications.workflowFailed'), {
              title: this.$t('editor.notifications.workflowErrorTitle'),
              toaster: 'b-toaster-top-center',
              variant: 'danger',
              solid: true,
            });
          });
      } else {
        const idmPutInstance = this.getRequestService({ 'If-Match': '*' });

        idmPutInstance.put(`/workflow/model/${this.remoteDetails._id}`, {
          _id: this.remoteDetails._id,
          bpmnXML: this.bpmn,
          resourceMap: this.scripts,
          name: this.name,
        }).then((results) => {
          this.$bvToast.toast('Workflow successfully updated', {
            title: this.$t('editor.notifications.workflowMessageTitle'),
            toaster: 'b-toaster-top-center',
            variant: 'success',
            solid: true,
          });

          this.$emit('saveRemoteBpmn', results.data);
        })
          .catch(() => {
            this.$bvToast.toast(this.$t('editor.notifications.workflowFailed'), {
              title: this.$t('editor.notifications.workflowErrorTitle'),
              toaster: 'b-toaster-top-center',
              variant: 'danger',
              solid: true,
            });
          });
      }
    },
    keys,
  },
};
</script>
<style lang="scss">
</style>
