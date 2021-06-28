<template>
  <div class="accordion-wrap">
    <div
      v-show="true"
      :class="{open : showContent}"
      class="accordion-title bg-ghost-gray"
      tabindex="0"
      role="region"
      aria-label="Show advanced filters"
      :aria-expanded="showContent"
      @click="toggle"
      @keyup.enter="toggle"
    >
      <slot name="title">Advanced Search</slot>
    </div>
    <div v-show="showContent" class="acc-content">
      <div class="advanced-filters">
        <div class="full-search filter-category">
          Search contents of documents
          <div class="search">
            <input
              v-model="advancedSearch"
              aria-label="Search the content inside of the documents"
              type="text"
              class="search-field"
              placeholder="Enter a keyword or phrase (ex. “City Hall”)"
            />
          </div>
          <div class="entity-dropdown">
            Filter by entity
            <label for="search-dropdown" aria-label="Search Dropdown">
              <select
                id="search-dropdown"
                v-model="selectedEntity"
                tabindex="0"
                placeholder="Select an Entity"
                aria-label="Select an Entity"
              >
                <option :key="''" :value="''">Show all entities</option>
                <option
                  v-for="entity in entitiesList"
                  :key="`${entity }`"
                  :value="entity"
                >{{ entity | entityName }}</option>
              </select>
            </label>
          </div>
        </div>
        <div class="date-search filter-category">
          <span id="show-results-text">Show results from</span>
          <div class="date-filter">
            <div class="date-container">
              <datepicker
                v-model="start"
                name="start"
                placeholder="Start date"
                format="MMM. dd, yyyy"
              />
            </div>
            <div id="to-text">
              <span>to</span>
            </div>
            <div class="date-container">
              <datepicker v-model="end" name="end" placeholder="End date" format="MMM. dd, yyyy" />
            </div>
          </div>
          <div class="clear-button-wrap">
            <button
              class="clear-button"
              aria-label="Clear all filters"
              @click="clearAllFilters"
            >Clear all filters</button>
            <button
              class="button filter-button"
              aria-label="Apply advanced filters"
              :disabled="applyDisabled"
              @click="filter()"
            >Apply Search</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>