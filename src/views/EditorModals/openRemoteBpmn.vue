<!--
Copyright (c) 2020 ForgeRock. All rights reserved.

This software may be modified and distributed under the terms
of the MIT license. See the LICENSE file for details.
-->

<template>
  <BModal
    @show="getBpmnList"
    @ok="templateSelect"
    :ok-disabled="selectedBpmn === null"
    size="lg"
    centered
    :title="$t('editor.templates.openRemoteModalTitle')"
    id="openRemoteBpmn">
    <div class="h-100 w-100 row">
      <div
        :key="`${index}_radio_open`"
        class="col-4 col-md-6 col-lg-4"
        v-for="(bpmn, index) in availableBpmn">
        <CardRadioInput
          :value="index"
          name="template"
          v-model="selectedBpmn"
          class="mb-4">
          <div class="media align-items-center text-nowrap text-truncate">
            <i class="material-icons-outlined radio-card-icon mr-4">
              open_in_browser
            </i>
            <div class="media-body">
              <h6 class="m-0">
                {{ bpmn.name }}
              </h6>
              <small class="text-muted">
                {{ bpmn.createTime | displayDate }}
              </small>
            </div>
          </div>
        </CardRadioInput>
      </div>
      <div
        class="m-2 w-100"
        v-if="availableBpmn.length === 0">
        <p class="radio-card-no-items text-muted mb-2">
          <i class="material-icons-outlined radio-card-icon mr-3">
            cloud
          </i> {{ $t('editor.templates.noBpmn') }}
        </p>
      </div>
    </div>
  </BModal>
</template>
<script>
import CardRadioInput from '@/components/CardRadioInput/';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(advancedFormat);

/*
  open a BPMN from a remote Forgerock instance
*/
export default {
  name: 'OpenRemoteBpmnModal',
  components: {
    CardRadioInput,
  },
  data() {
    return {
      availableBpmn: [],
      selectedBpmn: null,
    };
  },
  methods: {
    /**
     * Gets a list of current available BPMNs that are available for edit. Returns the list sorted by time created.
     */
    getBpmnList() {
      const idmInstance = this.getRequestService();

      idmInstance.get('/workflow/model?_queryFilter=true&_sortKeys=createTime').then((workflowResults) => {
        this.availableBpmn = workflowResults.data.result;
      })
        .catch(() => {
          this.$bvToast.toast(this.$t('editor.notifications.workflowEndpointAccess'), {
            title: this.$t('editor.notifications.workflowErrorTitle'),
            toaster: 'b-toaster-top-center',
            variant: 'danger',
            solid: true,
          });
        });
    },
    templateSelect() {
      this.$emit('loadRemoteBpmn', this.availableBpmn[this.selectedBpmn]);
    },
  },
  filters: {
    displayDate(date) {
      return dayjs(date).format('MMMM Do YYYY');
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
