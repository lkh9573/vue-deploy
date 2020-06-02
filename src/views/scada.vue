<template>
  <v-card elevation="12">
    <v-toolbar flat color="white">
      <v-toolbar-title>SCADA</v-toolbar-title>
      <v-divider class="mx-4" inset vertical></v-divider>
      <v-spacer></v-spacer>
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
      <template v-slot:item.enable="{ item }">
        <v-simple-checkbox v-model="item.enable"></v-simple-checkbox>
      </template>
      <template v-slot:item.name="{ item }">
        <v-text-field
          class="ma-2"
          hide-details="auto"
          solo
          v-model="item.name"
        ></v-text-field>
      </template>
      <template v-slot:item.ip="{ item }">
        <v-text-field
          class="ma-2"
          hide-details="auto"
          solo
          v-model="item.ip"
        ></v-text-field>
      </template>
      <template v-slot:item.tcpPort="{ item }">
        <v-text-field
          hide-details="auto"
          solo
          v-model="item.tcpPort"
        ></v-text-field>
      </template>
      <template v-slot:item.dnpMaster="{ item }">
        <v-text-field
          hide-details="auto"
          solo
          v-model="item.dnpMaster"
        ></v-text-field>
      </template>
      <template v-slot:item.dnpSlave="{ item }">
        <v-text-field
          hide-details="auto"
          solo
          v-model="item.dnpSlave"
        ></v-text-field>
      </template>
      <template v-slot:item.button="{ item }">
        <v-btn class="mr-1" color="primary">save</v-btn>
        <v-btn
          class="ml-1"
          dark
          color="light-blue"
          @click.stop="OpenScadaDialog(item.id)"
          >point</v-btn
        >
      </template>
    </v-data-table>
    <v-dialog scrollable v-model="$store.state.scadaDialog" max-width="800">
      <Scada-Dialog v-if="$store.state.scadaDialog"></Scada-Dialog>
    </v-dialog>
  </v-card>
</template>
<script>
import axios from "axios";
import _ from "lodash";
import ScadaDialog from "../components/scadaDialog.vue";
export default {
  components: {
    ScadaDialog
  },
  data() {
    return {
      files: [],
      jsons: [],
      uploadFiles: [],
      search: "",
      headers: [
        { text: "ID", align: "start", value: "id" },
        { text: "Enable", value: "enable", align: "center", sortable: false },
        { text: "Name", value: "name" },
        { text: "IP", value: "ip" },
        { text: "tcpPort", value: "tcpPort" },
        { text: "dnpMaster", value: "dnpMaster" },
        { text: "dnpSlave", value: "dnpSlave" },
        { text: "", value: "button", width: "200px" }
      ],
      datas: []
    };
  },
  computed: {},
  created() {
    axios
      .get("/api/scada-hosts")
      .then(res => {
        this.datas = res.data;
      })
      .catch(function(err) {
        console.log(err);
      });
  },
  methods: {
    OpenScadaDialog(id) {
      this.$store.state.scadaDialog = true;
      this.$store.state.hostId = id;
    },
    selectFile() {
      const files = this.$refs.files.files;
      this.uploadFiles = [...this.uploadFiles, ...files];
      this.files = [...this.files, ...files];

      const formData = new FormData();
      _.forEach(this.uploadFiles, file => {
        formData.append("files", file);
        console.log(file);
      });
      try {
        axios.post("/node", formData);
        if (this.files.length === 0) {
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
  color: #999;
  font-size: inherit;
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
