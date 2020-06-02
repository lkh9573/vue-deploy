<template>
  <v-card elevation="12">
    <v-toolbar flat color="white">
      <v-toolbar-title>SCADA Points</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <v-btn>Import Excel</v-btn>
      <v-btn>Remove All</v-btn>
      <v-btn>Reload</v-btn>
    </v-toolbar>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      >
      </v-text-field>
    </v-card-title>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="datas"
        :search="search"
        :sort-by="['id']"
      >
      </v-data-table>
    </v-card-text>
    <v-btn dark @click.stop="$store.state.iecDialog = false">Close</v-btn>
  </v-card>
</template>
<script>
import axios from "axios";
import _ from "lodash";
export default {
  components: {},
  data() {
    return {
      count: 0,
      files: [],
      jsons: [],
      uploadFiles: [],
      search: "",
      headers: [
        { text: "ID", align: "start", filterable: false, value: "id" },
        { text: "Type", value: "type" },
        { text: "Number", value: "number" },
        { text: "SourceId", value: "sourceid" },
        { text: "SourceType", value: "sourcetype" },
        { text: "Conversion", value: "Conversion" }
      ],
      datas: []
    };
  },
  mounted() {},
  computed: {},
  created() {
    console.log(this.$store.state.hostId, "iecDialog open");
    axios
      .get(`/api/scada-hosts/${this.$store.state.hostId}/scada-points`)
      .then(res => {
        this.datas = res.data;
      })
      .catch(function(err) {
        console.log(err);
      });
  },
  methods: {},
  beforeMount() {
    console.log("before mounted");
  }
};
</script>
<style>
.filebox input[type="file"] {
  display: none;
}
.filebox label {
  display: inline-block;
  padding: 0.5em 0.75em;
  color: black;
  font-size: inherit;
  margin-right: 2px;

  line-height: normal;
  vertical-align: middle;
  background-color: #fdfdfd;
  cursor: pointer;
  border: 1px solid #ebebeb;
  border-bottom-color: #e2e2e2;
  border-radius: 0.25em;
}
* {
  text-transform: none !important;
}
</style>
