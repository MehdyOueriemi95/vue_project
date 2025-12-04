<template>
  <div>
    <div class="title-block">
      <h2>Users</h2>
    </div>

    <dx-data-grid
      class="dx-card content-block"
      :data-source="dataSourceConfig"
      :focused-row-index="0"
      :show-borders="false"
      :focused-row-enabled="true"
      :column-auto-width="true"
      :column-hiding-enabled="true"
      :remote-operations="true"
      :height="700"
    >
      <dx-paging :page-size="10" />
      <dx-pager :show-page-size-selector="true" :show-info="true" />
      <dx-filter-row :visible="true" />
      <dx-group-panel :visible="true" />
      <dx-editing
        :__mode="modeEditing"
        mode="inline"
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
      />
      <dx-scrolling
        mode="virtual"
        row-rendering-mode="virtual"
      />

      <dx-column data-field="IDUTILISATEUR" caption="ID" :allow-editing="false" />
      <dx-column data-field="NOM" caption="Nom" :allow-editing="true" />
      <dx-column data-field="PRENOM" caption="Prénom" :allow-editing="true" />
      <dx-column data-field="LOGIN" caption="Login" :allow-editing="true" />
      <dx-column data-field="ACTIF" caption="Actif" editor-type="dxCheckBox" :allow-editing="true" />
      <dx-column data-field="ATELIER" caption="Atelier" :allow-editing="true" />
      <dx-column data-field="MOUTIL_VERSION" caption="Moutil" :allow-editing="true" />

    </dx-data-grid>
  </div>
</template>

<script lang="ts">
import { getUsers, getUserById, updateUser, insertUser, deleteUser } from '@sdk';
import "devextreme-vue/common/data";
import { CustomStore } from 'devextreme/common/data';
import { ref } from 'vue';
import { DxSelectBox } from 'devextreme-vue/select-box';
import DxDataGrid, {
  DxColumn,
  DxFilterRow,
  DxGroupPanel,
  DxScrolling,
  // DxLookup,
  DxEditing,
  DxPager,
  DxPaging,
  // type DxDataGridTypes,
  type GridsEditMode,
} from "devextreme-vue/data-grid";

const priorities = [
  { name: "High", value: 4 },
  { name: "Urgent", value: 3 },
  { name: "Normal", value: 2 },
  { name: "Low", value: 1 }
];

const editModes: GridsEditMode[] = [{ name: 'Form', value: 'form' }, { name: 'Inline', value: 'inline' }, { name: 'Popup', value: 'popup' }];
const modeEditing = ref<GridsEditMode>(editModes[0]);

const queryParams = ref<any>({});

const onModeEditingChanged = (e: any) => {
  modeEditing = e.value as GridsEditMode;
};

export default {
  setup() {
    const dataSourceConfig = {
      store: new CustomStore({
        key: "IDUTILISATEUR",
        load: async (loadOptions: any) => {
          queryParams.value = loadOptions;
          console.log('Load options:', loadOptions);
          console.log('Query params:', queryParams.value);
          try {
          const result = await getUsers(loadOptions);
          return result.data;
          } catch (error) {
            console.error('Error loading data:', error);
            throw error;
          }
        },
        byKey: async (key: string | number) => {
          console.log('Get by key:', key);
          const result = await getUserById(key.toString());
          return result.data;
        },
        update: async (key: string | number, values: any) => {
          console.log('Update:', key, values);
          const result = await updateUser(key.toString(), values);
          return result.data;
        },
        insert: async (values: any) => {
          console.log('Insert:', values);
          const result = await insertUser(values);
          return result.data;
        },
        remove: async (key: any) => {
          console.log('Remove:', key);
          const result = await deleteUser(key.toString());
          return result.data;
        }
      })
    };

    return {
      dataSourceConfig,
      priorities,
      editModes,
      modeEditing,
      onModeEditingChanged
    };
  },
  components: {
    DxDataGrid,
    DxColumn,
    DxFilterRow,
    DxScrolling,
    // DxLookup,
    DxGroupPanel,
    DxSelectBox,
    DxEditing,
    DxPager,
    DxPaging
  }
};
</script>
<style lang="scss">
.dx-datagrid-filter-row {
  background-color: transparent;
}

.title-block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
