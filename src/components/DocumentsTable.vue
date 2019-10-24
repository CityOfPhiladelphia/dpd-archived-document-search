<template>
  <div class="documents-container">
    <div class="page-title">
      <h1> {{ categoryName | removeUnderscore }} </h1>
      <p>
        At their public meetings, the Philadelphia Historical Commission and its committees review building permit applications and matters relating to historic designation. The minutes outline the projects and nominations under review. They also summarize the discussion and report any decisions and recommendations. 
      </p>
    </div>
    <Search />
    <table>
      <thead>
        <th><h5> Document Name </h5></th>
        <th><h5> Entity</h5></th>
        <th><h5> Document date</h5></th>
        <th><h5> Meeting number</h5></th>
        <th><h5> Page count</h5></th>
        <th><h5> Format</h5></th>
      </thead>

      <paginate
        v-if="documentsList.length"
        ref="paginator"
        name="documentsList"
        :list="documentsList"
        class="paginate-list"
        tag="tbody"
        :per="15"
      >
        <tr
          v-for="minutes in paginated('documentsList')"
          :key="minutes.id"
        >
          <td v-if="minutes.indexValues">
            {{ minutes.indexValues["DOCUMENT NAME"] }}
          </td>
          <td v-if="minutes.indexValues">
            {{ minutes.indexValues["BODY"] }}
          </td>
          <td v-if="minutes.indexValues">
            {{ minutes.indexValues["DOCUMENT DATE"] }}
          </td>
          <td v-if="minutes.indexValues">
            {{ minutes.indexValues["MEETING NUMBER"] }}
          </td>
          <td>{{ minutes.pageCount }}</td>
          <td>
            <a
              href="#"
              @click="requestFile(minutes.id)"
            >{{ minutes.indexValues["DOCUMENT NAME"] | documentType }} <i class="fas fa-download" /> </a>
          </td>
        </tr>
      </paginate>
    </table>
    <div>
      <paginate-links
        class="app-pages"
        for="documentsList"
        :async="true"
        :limit="3"
        :show-step-links="true"
        :hide-single-page="true"
        :step-links="{
          next: 'Next',
          prev: 'Previous'
        }"
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import VueFuse from "vue-fuse";
import VuePaginate from "vue-paginate";
import Search from "./Search";

Vue.use(VueFuse);
Vue.use(VuePaginate);

const endpoint = "https://dpd72vpwebapp01.city.phila.local:6453/api/v1/document-request/filtered-document-list/";
const docEndpoint = "https://dpd72vpwebapp01.city.phila.local:6453/api/v1/document-request/get-document/";

export default {
  name: "DocumentsTable",
  components: {
    Search,
  },
  filters: {
    'documentType': function(val) {
      if (val) {
        return val.split('.').slice(-1).pop();
      }
    },

    'removeUnderscore': function(val) {
      return val.replace(/_/g, ' ');
    },
  
  },
  props: {
    entityName: String,
    categoryName: String,
    categoryObject: Object,
  },
  data: function() {
    return {
      documentsList:[],
      paginate: [ "documentsList" ],
      category: "HISTORICAL_COMM-MEETING_MINUTES",
      requestedDocument: "",
    };
  },
  computed: {
  

  },

  watch: {

  },

  mounted: function() {
    this.requestDocumentsList();
  },

  methods: {
    requestFile: function(fileID) {
      console.log(docEndpoint + this.entityName + "/" + this.categoryObject.name + '/' + fileID);
      
      axios
        .get(docEndpoint + this.entityName + "/" + this.categoryObject.name + '/' + fileID , {
          headers: {
            'Accept': 'application/pdf',
          }, responseType : "blob",
        })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([ response.data ]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', fileID + ".pdf");
          document.body.appendChild(link);
          link.click();
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {
          
        });
    },

    requestDocumentsList: function() {
      axios
        .post(endpoint, this.categoryObject)
        .then(response => {
          this.documentsList = response.data.entries;
          // console.log(response.data.entries);
        })
        .catch(e => {
          console.log(e);
        })
        .finally(() => {});
    },
  },
};
</script>

<style lang="scss" >
.documents-container {
  padding: 30px;
  width: 85%;
  margin: 0 auto;

  
  table {
    // width: 85%;
    margin: 0 auto;
    h5 {
      margin: 0;
    }
  }
  .paginate-links {
    margin: 0 auto;
    max-width: 50%;
  }
}
</style>

