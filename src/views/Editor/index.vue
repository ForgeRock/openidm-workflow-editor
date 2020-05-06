<!-- Copyright 2020 ForgeRock AS. All Rights Reserved

Use of this code requires a commercial software license with ForgeRock AS.
or with one of its affiliates. All use shall be exclusively subject
to such license between the licensee and ForgeRock AS. -->
<template>
  <div class="flex-column d-flex h-100 w-100">
    <BNavbar class="action-bar py-0" size="sm" type="light" variant="light">
      <BNavbarNav :small="true">
        <BDropdown v-b-tooltip.hover :title="$t('editor.tooltips.systemActions')" :squared="true" variant="light">
          <template v-slot:button-content>
            <BImg style="margin-bottom: 3px;" height="20" :src="require('@/assets/fr-logo-mark.svg')"/>
          </template>
          <BDropdownItem href="#">{{$t('editor.dropdowns.importIdm')}}</BDropdownItem>
          <BDropdownItem href="#">{{$t('editor.dropdowns.saveBpmnIdm')}}</BDropdownItem>
          <BDropdownItem href="#">{{$t('editor.dropdowns.manageScriptsIdm')}}</BDropdownItem>
        </BDropdown>
        <BButtonGroup>
          <BButton v-b-tooltip.hover :title="$t('editor.tooltips.newBpmn')" v-b-modal="'newBpmnModel'" size="sm" :squared="true" variant="light">
            <i class="material-icons-outlined mt-2">note_add</i>
          </BButton>
          <BButton v-b-tooltip.hover :title="$t('editor.tooltips.openBpmn')" @click="openBPMN" size="sm" :squared="true" variant="light">
            <i class="material-icons-outlined mt-2">folder</i>
                <BFormFile
                  ref="fileUploader"
                  v-model="uploadedFile"
                  class="d-none"
                  plain
                ></BFormFile>
          </BButton>
          <BButton v-b-tooltip.hover :title="$t('editor.tooltips.saveImage')" @click="saveSVG" size="sm" :squared="true" variant="light">
            <i class="material-icons-outlined mt-2">image</i>
          </BButton>
          <BButton v-b-tooltip.hover :title="$t('editor.tooltips.saveBpmn')" @click="saveBPMN" size="sm" :squared="true" variant="light">
            <i class="material-icons-outlined mt-2">save_alt</i>
          </BButton>
        </BButtonGroup>
        <BButtonGroup>
          <BButton v-b-tooltip.hover :title="$t('editor.tooltips.zoomIn')" :disabled="zoomLevel === 4" @click="zoomIn" size="sm" :squared="true" variant="light">
            <i class="material-icons-outlined mt-2">zoom_in</i>
          </BButton>
          <BButton v-b-tooltip.hover :title="$t('editor.tooltips.zoomReset')" :disabled="zoomLevel === 1"  @click="zoomReset" size="sm" :squared="true" variant="light">
            <i class="material-icons-outlined mt-2">center_focus_weak</i>
          </BButton>
          <BButton v-b-tooltip.hover :title="$t('editor.tooltips.zoomOut')" :disabled="zoomLevel === 0.2" @click="zoomOut" size="sm" :squared="true" variant="light">
            <i class="material-icons-outlined mt-2">zoom_out</i>
          </BButton>
        </BButtonGroup>
      </BNavbarNav>
    </BNavbar>
    <Modeler ref="bpmnEditor" :zoomLevel="zoomLevel" @canvasZoom="zoomHandler" :bpmnTemplate="xmlTemplate"/>
    <newBPMNModal
    templateDefault="newTemplate"
    @templateSelect="loadTemplate"
    :availableTemplates="availableTemplates"></newBPMNModal>
  </div>
</template>

<script>
import {
  BButton,
  BButtonGroup,
  BDropdown,
  BDropdownItem,
  BFormFile,
  BNavbar,
  BNavbarNav,
  BImg,
} from 'bootstrap-vue';
import Modeler from '@/components/Modeler/';
import newBPMNModal from '../EditorModals/newBpmn';
import newTemplate from './examples/newbpmn.bpmn';
import basicProvisionTemplate from './examples/basicProvision.bpmn';
import basicTemplate from './examples/basic.bpmn';

export default {
  name: 'Editor',
  components: {
    BButton,
    BButtonGroup,
    BNavbar,
    BNavbarNav,
    BImg,
    BDropdown,
    BDropdownItem,
    BFormFile,
    Modeler,
    newBPMNModal,
  },
  data() {
    return {
      xmlTemplate: newTemplate,
      svgName: 'idmWorkflowImage.svg',
      svgFile: '',
      bpmnFile: '',
      bpmnName: 'idmWorkflowBPMN.bpmn',
      uploadedFile: null,
      zoomLevel: 1,
      availableTemplates: {
        newTemplate: {
          displayName: this.$t('editor.templates.blank'),
          icon: 'note_add',
          value: newTemplate,
        },
        basicProvisionTemplate: {
          displayName: this.$t('editor.templates.basicProvision'),
          icon: 'compare_arrows',
          value: basicProvisionTemplate,
        },
        basicTemplate: {
          displayName: this.$t('editor.templates.basicStarter'),
          icon: 'flight_takeoff',
          value: basicTemplate,
        },
      },
    };
  },
  methods: {
    updateEditorByTemplate(selectedValue) {
      this.xmlTemplate = this.availableTemplates[selectedValue].value;
    },
    zoomHandler(zoomLevel) {
      if (zoomLevel !== this.zoomLevel) {
        this.zoomLevel = zoomLevel;
      }
    },
    zoomIn() {
      let zoomCheck = this.zoomLevel + 0.3;

      if (zoomCheck > 4) {
        zoomCheck = 4;
      }

      this.zoomLevel = zoomCheck;
    },
    zoomOut() {
      let zoomCheck = this.zoomLevel - 0.3;

      if (zoomCheck < 0.2) {
        zoomCheck = 0.2;
      }

      this.zoomLevel = zoomCheck;
    },
    zoomReset() {
      this.zoomLevel = 1;
    },
    saveSVG() {
      this.$refs.bpmnEditor.saveSVG().then((svg) => {
        this.generateFile(svg, 'IDMImageSave.svg');
      });
    },
    saveBPMN() {
      this.$refs.bpmnEditor.saveXML().then((xml) => {
        this.generateFile(xml, 'IDMBpmnSave.bpmn');
      });
    },
    openBPMN() {
      this.$refs.fileUploader.$el.click();
    },
    loadTemplate(template) {
      this.xmlTemplate = template.value;
    },
    generateFile(data, name) {
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(new Blob([data], { type: 'data:application/bpmn20-xml;charset=UTF-8' }), name);
      } else {
        const blob = new Blob([data], { type: 'data:application/bpmn20-xml;charset=UTF-8' });
        const e = document.createEvent('MouseEvents');
        const a = document.createElement('a');

        a.download = name;
        a.href = window.URL.createObjectURL(blob);
        a.dataset.downloadurl = ['data:application/bpmn20-xml;charset=UTF-8', a.download, a.href].join(':');
        e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        a.dispatchEvent(e);
      }
    },
  },
  watch: {
    uploadedFile(file) {
      const reader = new FileReader();

      reader.onload = () => {
        this.xmlTemplate = reader.result;
      };

      reader.readAsText(file);
    },
  },
};
</script>
<style lang="scss" scoped>
  .action-bar {
    border-top:1px solid $gray-200;
    border-bottom:1px solid $gray-200;

    /deep/ {
      .b-dropdown .btn {
        border-radius: 0;
      }

      .btn-group {
        border-left: 1px solid $gray-200;
      }

      .btn.disabled {
        opacity: .2;
      }
    }
  }
</style>
