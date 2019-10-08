<template>
  <div class="minutes">
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

Vue.use(VueFuse);
Vue.use(VuePaginate);

import states from "../assets/meeting_minutes.json";

const endpoint = "https://dpd72vpwebapp01.city.phila.local:6453/api/v1/document-request/filtered-document-list/";
const docEndpoint = "https://dpd72vpwebapp01.city.phila.local:6453/api/v1/document-request/get-document/";
const requestedCategory = {
  "id": 7,
  "name": "HISTORICAL_COMM-MEETING_MINUTES",
  "displayName": "Meeting Minutes",
  "attributes": [
    {
      "fieldNumber": 1,
      "name": "DOCUMENT NAME",
      "filterValue1": null,
      "filterValue2": null,
      "type": {
        "name": "TEXT",
        "filterTypes": [
          {
            "name": "EQUALS",
          },
          {
            "name": "STARTS_WITH",
          },
          {
            "name": "ENDS_WITH",
          },
          {
            "name": "CONTAINS",
          },
        ],
      },
      "selectedFilterType": null,
    },
    {
      "fieldNumber": 2,
      "name": "DOCUMENT DATE",
      "filterValue1": null,
      "filterValue2": null,
      "type": {
        "name": "DATE",
        "filterTypes": [
          {
            "name": "EQUALS",
          },
          {
            "name": "AFTER",
          },
          {
            "name": "BEFORE",
          },
          {
            "name": "BETWEEN",
          },
        ],
      },
      "selectedFilterType": null,
    },
    {
      "fieldNumber": 3,
      "name": "DOCUMENT TYPE",
      "filterValue1": null,
      "filterValue2": null,
      "type": {
        "name": "TEXT",
        "filterTypes": [
          {
            "name": "EQUALS",
          },
          {
            "name": "STARTS_WITH",
          },
          {
            "name": "ENDS_WITH",
          },
          {
            "name": "CONTAINS",
          },
        ],
      },
      "selectedFilterType": null,
    },
    {
      "fieldNumber": 4,
      "name": "MEETING NUMBER",
      "filterValue1": null,
      "filterValue2": null,
      "type": {
        "name": "NUMERIC",
        "filterTypes": [
          {
            "name": "EQUALS",
          },
          {
            "name": "GREATER_THAN",
          },
          {
            "name": "LESS_THAN",
          },
          {
            "name": "BETWEEN",
          },
        ],
      },
      "selectedFilterType": null,
    },
    {
      "fieldNumber": 5,
      "name": "BODY",
      "filterValue1": null,
      "filterValue2": null,
      "type": {
        "name": "TEXT",
        "filterTypes": [
          {
            "name": "EQUALS",
          },
          {
            "name": "STARTS_WITH",
          },
          {
            "name": "ENDS_WITH",
          },
          {
            "name": "CONTAINS",
          },
        ],
      },
      "selectedFilterType": null,
    },
    {
      "fieldNumber": 6,
      "name": "COMMENT",
      "filterValue1": null,
      "filterValue2": null,
      "type": {
        "name": "TEXT",
        "filterTypes": [
          {
            "name": "EQUALS",
          },
          {
            "name": "STARTS_WITH",
          },
          {
            "name": "ENDS_WITH",
          },
          {
            "name": "CONTAINS",
          },
        ],
      },
      "selectedFilterType": null,
    },
    {
      "fieldNumber": 7,
      "name": "ARCHIVE DATE",
      "filterValue1": null,
      "filterValue2": null,
      "type": {
        "name": "DATE",
        "filterTypes": [
          {
            "name": "EQUALS",
          },
          {
            "name": "AFTER",
          },
          {
            "name": "BEFORE",
          },
          {
            "name": "BETWEEN",
          },
        ],
      },
      "selectedFilterType": null,
    },
    {
      "fieldNumber": 8,
      "name": "FULL_TEXT",
      "filterValue1": null,
      "filterValue2": null,
      "type": {
        "name": "FULL_TEXT",
        "filterTypes": [
          {
            "name": "FULL_TEXT",
          },
        ],
      },
      "selectedFilterType": null,
    },
  ],
  "notPublicFieldName": "NOT PUBLIC",
  "entityId": 1,
};

export default {
  name: "DocumentsTable",
  components: {},
  filters: {},
  data: function() {
    return {
      documentsList: state.entries,
      paginate: [ "documentsList" ],
      entity: "Historical_Commission",
      category: "HISTORICAL_COMM-MEETING_MINUTES",
      requestedDocument: "",
    };
  },
  computed: {},

  watch: {},

  mounted: function() {
    this.requestDocumentsList();
  },

  methods: {
    requestFile: function(fileID) {
      console.log(docEndpoint + this.entity + "/" + this.category + '/' + fileID);
      
      axios
        .get(docEndpoint + this.entity + "/" + this.category + '/' + fileID , {
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
        .post(endpoint, requestedCategory)
        .then(response => {
          this.documentsList = response.data;
          console.log(endpoint, requestedCategory)
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
.minutes {
  padding-bottom: 30px;
  table {
    width: 85%;
    margin: 0 auto;
  }
  .paginate-links {
    margin: 0 auto;
    max-width: 50%;
  }
}
</style>