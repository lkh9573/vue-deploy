<template>
  <v-card class="ma-4" elevation="12">
    <scada class="mb-4"></scada>
    <v-toolbar flat color="white">
      <v-toolbar-title>iec61850</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
      <div class="filebox">
        <label for="ex_file">Import SCL</label>
        <input
          multiple
          type="file"
          id="ex_file"
          ref="files"
          @change="selectFile()"
        />
      </div>
      <div class="filebox">
        <label for="ex_file">Import IET</label>
        <input multiple type="file" id="ex_file" @change="selectFile()" />
      </div>
      <div class="filebox">
        <label>Remove All</label>
      </div>
      <div class="filebox">
        <label>Reload</label>
      </div>
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

    <v-data-table
      :headers="headers"
      :items="datas"
      :search="search"
      :sort-by="['id']"
    >
      <template v-slot:item.button="{ item }">
        <v-btn dark @click.stop="OpenIecDialog(item.id)">data</v-btn>
      </template>
    </v-data-table>
    <v-dialog scrollable v-model="$store.state.iecDialog" max-width="800">
      <iec-dialog v-if="$store.state.iecDialog"></iec-dialog>
    </v-dialog>
  </v-card>
</template>
<script>
import axios from "axios";
import _ from "lodash";
import scada from "./scada";
import IecDialog from "../components/iecDialog.vue";
export default {
  components: {
    scada,
    IecDialog
  },
  data() {
    return {
      files: [],
      jsons: [],
      uploadFiles: [],
      search: "",
      headers: [
        { text: "ID", align: "start", filterable: false, value: "id" },
        { text: "Name", value: "name" },
        { text: "IP", value: "ip" },
        { text: "", value: "button" }
      ],
      datas: []
    };
  },
  mounted() {},
  computed: {},
  created() {
    axios
      .get("/api/iec61850-servers")
      .then(res => {
        this.datas = res.data;
      })
      .catch(function(err) {
        console.log(err);
      });
  },
  methods: {
    OpenIecDialog(id) {
      this.$store.state.iecDialog = true;
      this.$store.state.serverId = id;
      console.log(this.$store.state.serverId, "data button click");
    },
    selectFile() {
      const files = this.$refs.files.files;
      console.log(files);
      this.uploadFiles = [...this.uploadFiles, ...files];
      this.files = [...this.files, ...files];
      console.log(this.uploadFiles);

      var formData = new FormData();
      _.forEach(this.uploadFiles, file => {
        formData.append("files", file);
        console.log(file);
        console.log(formData);
      });
      try {
        axios.post("/node", formData);
        if (this.uploadFiles.length === 0) {
          console.log("업로드할 파일 없음");
        } else {
          console.log("파일 업로드");
        }
        this.files = [];
        this.uploadFiles = [];
      } catch (err) {
        console.log("실패");
      }
    }
    //서버로 부터 모든 파일을 불러와서 json형태로 table에 뿌려주기, 진입시 1번만 해주면되지않을까?..
    // read: function(){

    //   this.files = this.$refs.files.files
    //   let jsons = this.jsons
    //   const self = this

    //   for(let i = 0; i < this.files.length; i++){
    //     let reader = new FileReader()
    //     reader.readAsBinaryString(this.files[i])
    //     reader.onload = function(){
    //     let data = reader.result
    //     let workBook = XLSX.read(data,{type: 'binary'})
    //     let sheets = workBook.SheetNames
    //     let firstSheetName = sheets[0]
    //     let rows = XLSX.utils.sheet_to_json(workBook.Sheets[firstSheetName])
    //     console.log(rows)
    //       self.datas = [...self.datas, ...rows]
    //     }
    //   }
    // }
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
  color: rgb(32, 32, 32);
  font-size: inherit;
  margin-right: 2px;
  line-height: normal;
  vertical-align: middle;
  background-color: rgb(245, 245, 245);
  cursor: pointer;
  border: 1px solid #ebebeb;
  border-bottom-color: #e2e2e2;
  border-radius: 4px;
  font-weight: 500;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
}
* {
  text-transform: none !important;
}
</style>
