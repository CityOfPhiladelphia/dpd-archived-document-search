<template>
  <div class="minutes">
    <table>
      <thead>
        <th>
          document name
        </th>
        <th>
          entity
        </th>
        <th>
          document date
        </th>
        <th>
          meeting number
        </th>
        <th>
          page count
        </th>
        <th>
          format
        </th>
      </thead>
     
      <paginate
        v-if="minutesList.length"
        ref="paginator"
        name="minutesList"
        :list="minutesList"
        class="paginate-list"
        tag="tbody"
        :per="15"
      >
        <tr
          v-for="minutes in paginated('minutesList')"
          :key="minutes.id"
        >
          <td
            v-if="minutes.indexValues"
          >
            {{ minutes.indexValues["DOCUMENT NAME"] }}
          </td>
          <td
            v-if="minutes.indexValues"
          >
            {{ minutes.indexValues["BODY"] }}
          </td>
          <td
            v-if="minutes.indexValues"
          >
            {{ minutes.indexValues["DOCUMENT DATE"] }}
          </td>
          <td
            v-if="minutes.indexValues"
          >
            {{ minutes.indexValues["MEETING NUMBER"] }}
          </td>
          <td>
            {{ minutes.pageCount }}
          </td>
          <td>
            <a href="#" @click="downloadFile(minutes.id)">
            {{ minutes.id }}
            </a>
          </td>
        </tr>
      </paginate>
    </table>
    <div>
      <paginate-links
        class="app-pages"
        for="minutesList"
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

export default {
  name: "MinutesTable",
  components: { 
    
  },
  filters: {
  
  },
  data: function() {
    return {
      minutesList: states.entries,
      paginate: [ "minutesList" ],
    };
  },
  computed: { 
    
  },

  watch: {
    

  },

  mounted: function() {
    //make ajax call for the meeting minutes
  },

  methods: {
    downloadFile: function(fileID) {
      console.log( fileID);
      //make request for the file
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