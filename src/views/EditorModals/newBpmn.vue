<!-- Copyright 2020 ForgeRock AS. All Rights Reserved

Use of this code requires a commercial software license with ForgeRock AS.
or with one of its affiliates. All use shall be exclusively subject
to such license between the licensee and ForgeRock AS. -->
<template>
  <BModal @ok="templateSelect" size="lg" centered title="New BPMN" id="newBpmnModel">
    <div class="h-100 w-100 row">
        <div :key="`${key}_radio`" class="col-4 col-md-6 col-lg-4" v-for="(template, key) in availableTemplates">
            <CardRadioInput
              :value="key"
              name="template"
              v-model="selectedTemplate"
              class="mb-4">
              <div class="media align-items-center text-nowrap text-truncate">
                <i class="material-icons-outlined md-24 mr-4">
                  {{template.icon}}
                </i>
                <div class="media-body">
                  <h6 class="m-0">
                    {{template.displayName}}
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

export default {
  name: 'NewBPMNModal',
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
      this.$emit('templateSelect', this.availableTemplates[this.selectedTemplate]);
      this.selectedTemplate = 'newTemplate';
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
