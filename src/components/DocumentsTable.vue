<template>
  <div class="documents-container">
    <Search />
    <table>
      <thead>
        <th>document name</th>
        <th>entity</th>
        <th>document date</th>
        <th>meeting number</th>
        <th>page count</th>
        <th>format</th>
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
            >{{ minutes.id }}</a>
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
  filters: {},
  props: {
    entityName: String,
    categoryName: String,
    categoryObject: Object,
  },
  data: function() {
    return {
      documentsList:[],
      paginate: [ "documentsList" ],
      // entity: "Historical_Commission",
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
  }
  .paginate-links {
    margin: 0 auto;
    max-width: 50%;
  }
}
</style>

