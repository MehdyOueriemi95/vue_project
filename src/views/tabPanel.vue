<!--
  ! Vue pour les informations des employés avec DxTabPanel
-->

<template>
  <div>
    <!-- ✅ Choix de l'employé (affiche juste le nom de famille) -->
    <DxSelectBox
      :data-source="employees"
      display-expr="Last_Name"
      value-expr="ID"
      :value="selectedEmployeeId"
      @value-changed="onEmployeeChanged"
      placeholder="Choisir un employé..."
    />

    <DxTabPanel
      :loop="true"
      :animation-enabled="true"
      :swipe-enabled="true"
      v-model:selected-index="selectedTabIndex"
    >
      <DxItem class ="tabPanel-item" title="Employee" icon="floppy">
        <template #default>
          <!-- ✅ form-data = 1 employé (objet). Fallback {} si null -->
          <DxForm id="form" :form-data="selectedEmployee || {}">
            <DxSimpleItem data-field="First_Name" />
            <DxSimpleItem data-field="Last_Name" />
            <DxSimpleItem data-field="Title" />sqcd
            <DxSimpleItem data-field="Department" />
            <DxSimpleItem data-field="Email" />
            <DxSimpleItem data-field="Mobile_Phone" />
            <DxSimpleItem data-field="City" />
            <DxSimpleItem data-field="State" />
            <DxSimpleItem data-field="Birth_Date" />
            <DxSimpleItem data-field="Hire_Date" />
            <DxSimpleItem data-field="Status" />
          </DxForm>
        </template>
      </DxItem>

      <DxItem class ="tabPanel-item" title="Notes" icon="comment">
        <template #default>
          <div style="padding: 12px">
            Pas de champ <code>Notes</code> dans ton interface <code>Employee</code>.
          </div>
        </template>
      </DxItem>

      <DxItem class ="tabPanel-item" title="Role" icon="isnotblank" badge="new">
        <template #default>
          <div style="padding: 12px; font-size: 16px">
            <strong>Rôle :</strong> {{ selectedEmployee?.Title }}
          </div>
        </template>
      </DxItem>
    </DxTabPanel>

    <DxRadioGroup
      :items="tabNames"
      :value="tabNames[selectedTabIndex] || tabNames[0]"
      layout="horizontal"
      @value-changed="onTabChanged"
    />
  </div>
</template>

<script lang="ts">
import "devextreme/dist/css/dx.light.css";

import DxTabPanel, { DxItem } from "devextreme-vue/tab-panel";
import DxForm, { DxSimpleItem } from "devextreme-vue/form";
import DxRadioGroup from "devextreme-vue/radio-group";
import DxSelectBox from "devextreme-vue/select-box";

import { employees } from "@/data"; // adapte le chemin si besoin
import type { Employee } from "@/data";

export default {
  components: {
    DxTabPanel,
    DxItem,
    DxForm,
    DxSimpleItem,
    DxRadioGroup,
    DxSelectBox,
  },

  data() {
    const tabNames = ["Employee", "Notes", "Role"];

    return {
      employees,
      tabNames,
      selectedTabIndex: 0,
      selectedEmployeeId: employees[0]?.ID ?? null,
    };
  },

  computed: {
    selectedEmployee(): Employee | null {
      return this.employees.find((e: Employee) => e.ID === this.selectedEmployeeId) || null;
    },
  },

  methods: {
    onTabChanged(e: any) {
      const index = this.tabNames.indexOf(e.value);
      if (index !== -1) this.selectedTabIndex = index;
    },

    onEmployeeChanged(e: any) {
      this.selectedEmployeeId = e.value;
    },
  },
};
</script>

<style>
.tabPanel-item {
  color: black;
}
</style>
