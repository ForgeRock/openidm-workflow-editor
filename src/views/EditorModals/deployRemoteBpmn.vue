<template>
  <BModal
    @show="getBpmnList"
    @ok="deploySelected"
    :ok-disabled="selectedBpmn === null"
    size="lg"
    centered
    :title="$t('editor.templates.deployModalTitle')"
    id="deployRemoteBpmn">
    <div class="h-100 w-100 row">
      <div
        :key="`${index}_radio_deploy`"
        class="col-4 col-md-6 col-lg-4"
        v-for="(bpmn, index) in availableBpmn">
        <CardRadioInput
          :value="index"
          name="template"
          v-model="selectedBpmn"
          class="mb-4">
          <div class="media align-items-center text-nowrap text-truncate">
            <i class="material-icons-outlined radio-card-icon mr-4">
              public
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
  Deploy a BPMN from a remote Forgerock instance
*/
export default {
  name: 'DeployRemoteBpmn',
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
    getBpmnList() {
      const idmInstance = this.getRequestService();

      idmInstance.get('/workflow/model?_queryFilter=true&_sortKeys=createTime').then((workflowResults) => {
        this.availableBpmn = workflowResults.data.result;
      })
        .catch(() => {
          this.$bvToast.toast('Unable to access IDM Workflow endpoint.', {
            title: this.$t('editor.notifications.workflowErrorTitle'),
            toaster: 'b-toaster-top-center',
            variant: 'danger',
            solid: true,
          });
        });
    },
    deploySelected() {
      const idmInstance = this.getRequestService();
      const workflowId = this.availableBpmn[this.selectedBpmn]._id;

      idmInstance.post(`/workflow/model/${workflowId}?_action=deploy`).then(() => {
        this.$bvToast.toast(this.$t('editor.notifications.workflowSuccessDeployed'), {
          title: this.$t('editor.notifications.workflowMessageTitle'),
          toaster: 'b-toaster-top-center',
          variant: 'success',
          solid: true,
        });
      })
        .catch(() => {
          this.$bvToast.toast(this.$t('editor.notifications.workflowFailedDeployed'), {
            title: this.$t('editor.notifications.workflowErrorTitle'),
            toaster: 'b-toaster-top-center',
            variant: 'danger',
            solid: true,
          });
        });
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
