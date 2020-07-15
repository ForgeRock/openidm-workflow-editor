<template>
  <div class="w-100 flex-fill d-flex">
    <div
      class="flex-fill"
      id="workFlowModeler" />
  </div>
</template>

<script>
import { debounce } from 'lodash';
import BpmnModeler from 'bpmn-js/dist/bpmn-modeler.production.min';

export default {
  name: 'Modeler',
  props: {
    bpmn: {
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
      skipReload: false,
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

    this.bpmnViewer.importXML(this.bpmn).then((err) => {
      if (err.warnings.length === 0) {
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

    this.bpmnViewer.on('commandStack.changed', () => {
      this.modelerChangeEvent();
    });
  },
  watch: {
    bpmn() {
      if (!this.skipNextLoad) {
        this.bpmnViewer.importXML(this.bpmn).then(() => {
          this.bpmnViewer.get('canvas').zoom('fit-viewport', true);
        },
        (err) => {
          if (err.message === 'no diagram to display') {
            // In the case where the BPMN file does not contain a diagram element we will append an empty
            // XML DOM element to allow for modeler usage.
            // Parse string -> XML -> string
            const parser = new DOMParser();
            const xml = parser.parseFromString(this.bpmn, 'text/xml');

            const diagramId = xml.getElementsByTagName('process')[0].getAttribute('id') || 'Process_1';
            const emptyDiagram = '<bpmndi:BPMNDiagram xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" id="BPMNDiagram_1">'
                + `<bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${diagramId}">`
                + '</bpmndi:BPMNPlane>'
                + '</bpmndi:BPMNDiagram>';

            let emptyXml = parser.parseFromString(emptyDiagram, 'text/xml');

            emptyXml = xml.importNode(emptyXml.getElementsByTagName('bpmndi:BPMNDiagram')[0], true);
            const serializer = new XMLSerializer();
            xml.getElementsByTagName('definitions')[0].append(emptyXml);

            // Return back to string
            this.$emit('modelerChange', serializer.serializeToString(xml));

            this.$bvToast.toast(this.$t('editor.notifications.workflowNoDiagram'), {
              title: this.$t('editor.notifications.workflowMessageTitle'),
              toaster: 'b-toaster-top-center',
              variant: 'info',
              solid: true,
            });
          } else {
            this.$bvToast.toast(err.message, {
              title: this.$t('editor.notifications.workflowErrorTitle'),
              toaster: 'b-toaster-top-center',
              variant: 'danger',
              solid: true,
            });
          }
        }, () => {
          this.$bvToast.toast('Failed to load BPMN', {
            title: 'BPMN Editor Message',
            variant: 'danger',
            solid: true,
          });
        });
      } else {
        this.skipNextLoad = false;
      }
    },
    zoomLevel(zoom) {
      this.bpmnViewer.get('canvas').zoom(zoom);
    },
  },
  methods: {
    modelerChangeEvent: debounce(function () {
      this.saveXML().then((saveResult) => {
        this.skipNextLoad = true;
        this.$emit('modelerChange', saveResult.xml);
      });
    }, 500),
    saveSVG() {
      return this.bpmnViewer.saveSVG({ format: true });
    },
    saveXML() {
      return this.bpmnViewer.saveXML({ format: true });
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
