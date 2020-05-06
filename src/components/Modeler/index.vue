<!-- Copyright 2020 ForgeRock AS. All Rights Reserved

Use of this code requires a commercial software license with ForgeRock AS.
or with one of its affiliates. All use shall be exclusively subject
to such license between the licensee and ForgeRock AS. -->
<template>
  <div class="w-100 flex-fill d-flex">
    <div
      class="flex-fill"
      id="workFlowModeler" />
  </div>
</template>

<script>
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min';

export default {
  name: 'Modeler',
  props: {
    bpmnTemplate: {
      type: String,
      default: '',
    },
    zoomLevel: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      bpmnViewer: null,
    };
  },
  mounted() {
    this.bpmnViewer = new BpmnModeler({
      container: '#workFlowModeler',
      bpmnRenderer: {
        defaultFillColor: '#f6f8fa',
        defaultStrokeColor: '#109cf1',
      },
      textRenderer: {
        defaultStyle: {
          fontFamily: '"Roboto"',
        },
      },
    });

    this.bpmnViewer.importXML(this.bpmnTemplate, (err) => {
      if (!err) {
        this.bpmnViewer.get('canvas').zoom('fit-viewport', true);
      } else {
        this.$bvToast.toast('Failed to load BPMN', {
          title: 'BPMN Editor Message',
          variant: 'danger',
          solid: true,
        });
      }
    });

    this.bpmnViewer.on('canvas.viewbox.changed', (event) => {
      this.$emit('canvasZoom', event.viewbox.scale);
    });
  },
  watch: {
    bpmnTemplate() {
      this.bpmnViewer.importXML(this.bpmnTemplate, (err) => {
        if (!err) {
          this.bpmnViewer.get('canvas').zoom('fit-viewport', true);
        } else {
          this.$bvToast.toast('Failed to load BPMN', {
            title: 'BPMN Editor Message',
            variant: 'danger',
            solid: true,
          });
        }
      });
    },
    zoomLevel(zoom) {
      this.bpmnViewer.get('canvas').zoom(zoom);
    },
  },
  methods: {
    saveSVG() {
      const savePromise = new Promise((resolve, reject) => {
        this.bpmnViewer.saveSVG({ format: true }, (err, svg) => {
          if (err) {
            reject(err);
          } else {
            resolve((svg));
          }
        });
      });

      return savePromise;
    },
    saveXML() {
      const savePromise = new Promise((resolve, reject) => {
        this.bpmnViewer.saveXML({ format: true }, (err, xml) => {
          if (err) {
            reject(err);
          } else {
            resolve((xml));
          }
        });
      });

      return savePromise;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '~bpmn-js/dist/assets/diagram-js.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

/deep/ {
  .djs-palette {
    background-color: $gray-100;
    border-color: $gray-300;

    .entry:hover {
      background-color: $fr-toolbar-hover;
      cursor: pointer;
      color: inherit;
    }
  }
}
</style>
