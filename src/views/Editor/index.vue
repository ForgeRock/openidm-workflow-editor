<!--
Copyright (c) 2020 ForgeRock. All rights reserved.

This software may be modified and distributed under the terms
of the MIT license. See the LICENSE file for details.
-->

<template>
  <div class="flex-column d-flex h-100 w-100">
    <BNavbar
      class="display-bar"
      size="sm"
      type="light"
      variant="light">
      <BFormInput
        class="bpmn-name-input"
        v-model="bpmnName" />
    </BNavbar>
    <BNavbar
      class="action-bar py-0"
      size="sm"
      type="light"
      variant="light">
      <BNavbarNav :small="true">
        <BDropdown
          v-b-tooltip.hover
          :disabled="!idmSessionCheck"
          :title="$t('editor.tooltips.systemActions')"
          :squared="true"
          variant="light">
          <template v-slot:button-content>
            <BImg
              style="margin-bottom: 3px;"
              height="20"
              :src="require('@/assets/fr-logo-mark.svg')" />
          </template>
          <BDropdownItem v-b-modal="'openRemoteBpmn'">
            {{ $t('editor.dropdowns.openRemote') }}
          </BDropdownItem>
          <BDropdownItem
            v-b-modal="'saveRemoteBpmn'"
            href="#">
            {{ $t('editor.dropdowns.saveBpmnRemote') }}
          </BDropdownItem>
          <BDropdownItem
            v-b-modal="'scriptManager'"
            href="#">
            {{ $t('editor.dropdowns.manageScriptsRemote') }}
          </BDropdownItem>
          <BDropdownDivider />
          <BDropdownItem
            v-b-modal="'deployRemoteBpmn'"
            href="#">
            {{ $t('editor.dropdowns.deployBpmnRemote') }}
          </BDropdownItem>
          <BDropdownItem
            v-b-modal="'deleteRemoteBpmn'"
            href="#">
            {{ $t('editor.dropdowns.deleteBpmnRemote') }}
          </BDropdownItem>
        </BDropdown>
        <BButtonGroup>
          <BButton
            v-b-tooltip.hover
            :title="$t('editor.tooltips.newBpmn')"
            v-b-modal="'newBpmnModel'"
            size="sm"
            :squared="true"
            variant="light">
            <i class="material-icons-outlined mt-2">note_add</i>
          </BButton>
          <BButton
            v-b-tooltip.hover
            :title="$t('editor.tooltips.openBpmn')"
            @click="loadLocalBpmn"
            size="sm"
            :squared="true"
            variant="light">
            <i class="material-icons-outlined mt-2">folder</i>
            <BFormFile
              ref="fileUploader"
              v-model="uploadedFile"
              class="d-none"
              plain
            />
          </BButton>
          <BButton
            v-b-tooltip.hover
            :title="$t('editor.tooltips.saveImage')"
            @click="saveSVG"
            size="sm"
            :squared="true"
            variant="light">
            <i class="material-icons-outlined mt-2">image</i>
          </BButton>
          <BButton
            v-b-tooltip.hover
            title="Edit BPMN XML"
            v-b-modal="'editBpmnModel'"
            size="sm"
            :squared="true"
            variant="light">
            <i class="material-icons-outlined mt-2">code</i>
          </BButton>
        </BButtonGroup>
        <BButtonGroup>
          <BButton
            v-b-tooltip.hover
            :title="$t('editor.tooltips.zoomIn')"
            :disabled="zoomLevel === 4"
            @click="zoomIn"
            size="sm"
            :squared="true"
            variant="light">
            <i class="material-icons-outlined mt-2">zoom_in</i>
          </BButton>
          <BButton
            v-b-tooltip.hover
            :title="$t('editor.tooltips.zoomReset')"
            :disabled="zoomLevel === 1"
            @click="zoomReset"
            size="sm"
            :squared="true"
            variant="light">
            <i class="material-icons-outlined mt-2">center_focus_weak</i>
          </BButton>
          <BButton
            v-b-tooltip.hover
            :title="$t('editor.tooltips.zoomOut')"
            :disabled="zoomLevel === 0.2"
            @click="zoomOut"
            size="sm"
            :squared="true"
            variant="light">
            <i class="material-icons-outlined mt-2">zoom_out</i>
          </BButton>
        </BButtonGroup>
      </BNavbarNav>
    </BNavbar>
    <Modeler
      ref="bpmnEditor"
      :zoom-level="zoomLevel"
      @canvasZoom="zoomHandler"
      @modelerChange="updateBpmnByModeler"
      :bpmn="xmlTemplate" />
    <saveRemoteBpmnModal
      @saveRemoteBpmn="saveRemoteBpmn"
      :remote-details="remoteDetails"
      :bpmn="xmlTemplate"
      :name="bpmnName"
      :scripts="scripts" />
    <deleteRemoteBpmnModal />
    <openRemoteBpmnModal @loadRemoteBpmn="loadRemoteBpmn" />
    <deployRemoteBpmnModal />
    <resourceManagerModal
      @updateScripts="updateScripts"
      :scripts="scripts" />
    <newBpmnModal
      template-default="newTemplate"
      @selectedBpmn="updateBpmnByTemplate"
      :available-templates="availableTemplates" />
    <editBpmnModal
      :template="xmlTemplate"
      @updateBpmn="updateBpmnByCode" />
    <BOverlay
      :show="loading"
      no-wrap
      rounded="lg"
      opacity="0.6">
      <template v-slot:overlay>
        <div class="d-flex align-items-center h-100 w-100">
          <BSpinner
            class="ml-4 mb-2"
            variant="primary" />
        </div>
        <h5 class="text-muted">
          Loading...
        </h5>
      </template>
    </BOverlay>
  </div>
</template>

<script>
import {
  BButton,
  BButtonGroup,
  BDropdown,
  BDropdownItem,
  BDropdownDivider,
  BFormFile,
  BFormInput,
  BNavbar,
  BNavbarNav,
  BImg,
  BOverlay,
  BSpinner,
} from 'bootstrap-vue';
import Modeler from '@/components/Modeler/';
import newBpmnModal from '../EditorModals/newBpmn';
import openRemoteBpmnModal from '../EditorModals/openRemoteBpmn';
import saveRemoteBpmnModal from '../EditorModals/saveRemoteBpmn';
import deployRemoteBpmnModal from '../EditorModals/deployRemoteBpmn';
import deleteRemoteBpmnModal from '../EditorModals/deleteRemoteBpmn';
import editBpmnModal from '../EditorModals/editBpmn';
import resourceManagerModal from '../EditorModals/resourceManager';
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
    BDropdownDivider,
    BFormFile,
    BFormInput,
    Modeler,
    newBpmnModal,
    saveRemoteBpmnModal,
    openRemoteBpmnModal,
    deleteRemoteBpmnModal,
    deployRemoteBpmnModal,
    editBpmnModal,
    resourceManagerModal,
    BOverlay,
    BSpinner,
  },
  data() {
    return {
      xmlTemplate: newTemplate,
      svgName: 'idmWorkflowImage.svg',
      svgFile: '',
      bpmnName: 'New Workflow',
      scripts: {},
      isRemote: false,
      loading: false,
      uploadedFile: null,
      idmSessionCheck: true,
      remoteDetails: null,
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
  created() {
    this.idmInstance = this.getRequestService();

    this.idmInstance.post('/authentication?_action=login').then(() => {
      this.idmSessionCheck = true;
    })
      .catch(() => {
        this.idmSessionCheck = false;
      });
  },
  methods: {
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
      this.$root.$emit('bv::hide::tooltip');
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
    saveSVG() {
      this.$refs.bpmnEditor.saveSVG().then((saveResult) => {
        this.generateFile(saveResult.svg, 'IDMImageSave.svg');
      });
    },
    // Remote events
    updateScripts(scripts) {
      this.scripts = scripts;
    },
    // Load template
    updateBpmnByTemplate(template) {
      this.xmlTemplate = template.value;
      this.bpmnName = 'New Workflow';
      this.scripts = {};
      this.remoteDetails = null;
    },
    // Update BPMN manually
    updateBpmnByCode(template) {
      this.xmlTemplate = template;
    },
    // Update BPMN from modeler changes
    updateBpmnByModeler(xml) {
      this.xmlTemplate = xml;
    },
    // Save remote BPMN workflow
    saveRemoteBpmn(workflowDetails) {
      this.remoteDetails = workflowDetails;
    },
    // Open local BPMN
    loadLocalBpmn() {
      this.$refs.fileUploader.$el.click();
    },
    // Load remote BPMN
    loadRemoteBpmn(bpmn) {
      this.loading = true;
      this.idmInstance.get(`/workflow/model/${bpmn._id}`).then((loadedBpmn) => {
        this.xmlTemplate = loadedBpmn.data.bpmnXML;
        this.bpmnName = loadedBpmn.data.name;
        this.scripts = loadedBpmn.data.resourceMap;
        this.loading = false;
        this.remoteDetails = loadedBpmn.data;
      })
        .catch(() => {
          this.loading = false;
          this.$bvToast.toast('Failed to load remote BPMN', {
            title: 'Workflow Error',
            toaster: 'b-toaster-top-center',
            variant: 'danger',
            solid: true,
          });
        });
    },
  },
  watch: {
    uploadedFile(file) {
      const reader = new FileReader();
      // Check to ensure a file is selected
      if (file !== null) {
        reader.onload = () => {
          this.xmlTemplate = reader.result;
          this.bpmnName = file.name;
          this.scripts = {};
        };

        reader.readAsText(file);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
  .bpmn-name-input {
    background-color: transparent;
    width: 200px;
    border-color: transparent;
  }
  .display-bar {
    height: 40px;
  }

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
