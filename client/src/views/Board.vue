<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout
        row
        align-center
        wrap
      >
        <v-progress-circular
          v-if="loading"
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <h2 v-if="board">{{board.name}}</h2>
        <!-- <v-flex
          sm3
          v-if="!loading"
          v-for="list in lists"
          :key="list._id"
          pa-2
        >
          <v-card>
            <v-card-title primary-title>
              <div class="headline">{{list.name}}</div>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex
          sm3
          pa-2
        >
          <v-card>
            <v-card-title>
              <div>
                <div class="headline">Create List</div>
                <div>
                  <v-form
                    v-if="!creatingList"
                    v-model="validList"
                    @submit.prevent="createList"
                  >
                    <v-text-field
                      v-model="list.name"
                      :rules="notEmptyRules"
                      label="Name"
                      required
                    ></v-text-field>
                    <v-card-actions>
                      <v-btn
                        flat
                        color="secondary"
                        type="submit"
                        :disabled="!validList"
                      >Create List</v-btn>
                    </v-card-actions>
                  </v-form>
                  <v-progress-circular
                    v-if="creatingList"
                    :size="70"
                    :width="7"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex> -->
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "board",
  data: () => ({
    validList: false,
    board: {},
    list: {
      name: ""
    },
    notEmptyRules: [value => !!value || "This Field is required"]
  }),
  mounted() {
    this.getBoard(this.$route.params.id).then(response => {
      this.board = response.data || response;
    });
  },
  methods: {
    ...mapActions("boards", { getBoard: "get" }),
    createList() {
      if (this.validList) {
        const { List } = this.$FeathersVuex;
        const list = new List(this.list);
        list.save();
        this.list = {
          name: ""
        };
      }
    }
  },
  computed: {
    ...mapState("boards", {
      loading: "isGetPending",
      creating: "isCreatingPending"
    })
  }
};
</script>
