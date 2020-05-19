<template>
  <BModal
    @ok="templateSelect"
    size="lg"
    centered
    :title="$t('editor.templates.newModalTitle')"
    id="newBpmnModel">
    <div class="h-100 w-100 row">
      <div
        :key="`${key}_radio`"
        class="col-4 col-md-6 col-lg-4"
        v-for="(template, key) in availableTemplates">
        <CardRadioInput
          :value="key"
          name="template"
          v-model="selectedTemplate"
          class="mb-4">
          <div class="media align-items-center text-nowrap text-truncate">
            <i class="material-icons-outlined radio-card-icon mr-4">
              {{ template.icon }}
            </i>
            <div class="media-body">
              <h6 class="m-0">
                {{ template.displayName }}
              </h6>
            </div>
          </div>
        </CardRadioInput>
      </div>
    </div>
  </BModal>
</template>
<script>
import CardRadioInput from '@/components/CardRadioInput/';

/**
 * Start a new BPMN instance, currently three templates are provided
 * Empty - A baseline starting bpmn
 * basicProvision - A basic provisioning template for IDM
 * basic - A more extensive BPMN to start from
 */
export default {
  name: 'NewBpmnModal',
  components: {
    CardRadioInput,
  },
  props: {
    templateDefault: {
      type: String,
      default: 'newTemplate',
    },
    availableTemplates: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      selectedTemplate: this.templateDefault,
    };
  },
  methods: {
    templateSelect() {
      this.$emit('selectedBpmn', this.availableTemplates[this.selectedTemplate]);
      this.selectedTemplate = this.templateDefault;
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
