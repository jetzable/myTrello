<template>
  <v-container fluid>
    <v-layout>
      <v-flex md10>
        <v-layout
          row
          wrap
        >
          <v-flex xs12>
            <v-alert
              v-if="boardsError"
              :value="boardsError"
              type="error"
              transition='scale-transition'
            >
              {{boardsError.message}} </v-alert>
          </v-flex>
          <v-progress-circular
            v-if="loadingBoard || loadingLists"
            :size="70"
            :width="7"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <v-flex xs10 v-if="!boardsError">
            <v-layout
              row
              wrap
            >
              <v-flex xs12>
                <h2 v-if="board">{{board.name}}</h2>
              </v-flex>
              <v-flex
                sm4
                xs12
                v-if="!loadingLists"
                v-for="list in lists"
                :key="list._id"
                pa-2
              >
                <v-card
                  @dragover="setDroppingList($event, list)"
                  :class="{ cyan: droppingList == list}"
                >
                  <v-card-title primary-title>
                    <v-layout column>
                      <v-flex>
                        <div class="headline">{{list.name}}</div>
                      </v-flex>

                      <v-flex
                      xs10
                        v-if="cardsByListId[list._id]"
                        v-for="card in cardsByListId[list._id]"
                        :key="card._id"
                        class="pa-1"
                      >
                        <v-card
                          color="purple"
                          class="white--text"
                          draggable="true"
                          @dragstart="startDraggingCard(card)"
                          @dragend="dropCard()"
                        >
                          <v-layout>
                            <v-flex xs6>
                              <v-card-title primary-title>
                                <div>
                                  <div class="headline">{{card.title}}</div>
                                </div>
                              </v-card-title>
                            </v-flex>
                          </v-layout>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-card-title>
                  <v-card-actions>
                    <create-card
                      :listId="list._id"
                      :boardId="$route.params.id"
                    ></create-card>
                  </v-card-actions>
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
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex md2>
        <v-layout column>
         <v-flex xs12>
            <v-card>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">Activities</h3>
                  <div>{{activities}}</div>
                </div>
              </v-card-title>
            </v-card>
      </v-flex>
      </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import CreateCard from "./CreateCard";

export default {
  name: "board",
  components: {
    CreateCard
  },
  data: () => ({
    droppingList: null,
    draggingCard: null,
    validList: false,
    board: {},
    list: {
      name: "",
      order: 0,
      archived: false
    },
    notEmptyRules: [value => !!value || "This Field is required"]
  }),
  mounted() {
    this.getBoard(this.$route.params.id).then(response => {
      this.board = response.data || response;
    });
    this.findLists({
      query: {
        boardId: this.$route.params.id
      }
    }).then(response => {
      const lists = response.data || response;
    });
    this.findCards({
      query: {
        boardId: this.$route.params.id
      }
    }).then(response => {
      const cards = response.data || response;
    });
    this.findActivities({
      query: {
        boardId: this.$route.params.id
      }
    }).then(response => {
      const activities = response.data || response;
    });
  },
  methods: {
    ...mapActions("boards", { getBoard: "get" }),
    ...mapActions("lists", { findLists: "find" }),
    ...mapActions("cards", { findCards: "find" }),
    ...mapActions("activities", { findActivities: "find" }),

    async createList() {
      if (this.validList) {
        const { List, Activity } = this.$FeathersVuex;
        this.list.boardId = this.$route.params.id;
        const list = new List(this.list);
        await list.save();
        this.list = {
          name: "",
          order: 0,
          archived: false
        };
        const activity = new Activity();
        activity.text = `*${this.user.user.displayName}* created List _${
          list.name
        }_`;
        activity.boardId = this.$route.params.id;
        activity.save();
      }
    },
    startDraggingCard(card) {
      this.draggingCard = card;
    },
    setDroppingList(event, list) {
      this.droppingList = list;
      event.preventDefault();
    },
    dropCard() {
      if (this.droppingList) {
        this.draggingCard.listId = this.droppingList._id;
        this.draggingCard.save();
      }
      this.droppingList = null;
      this.draggingCard = null;
    }
  },
  computed: {
    ...mapState("auth", { user: "payload" }),
    ...mapState("boards", {
      loadingBoard: "isGetPending",
      boardsError: "errorOnGet"
    }),
    ...mapState("lists", {
      loadingLists: "isFindPending",
      creatingList: "isCreatePending",
      listsError: "errorOnFind"
    }),
    ...mapState("cards", {
      cardsError: "errorOnFind"
    }),
    ...mapGetters("lists", { findListsInStore: "find" }),
    ...mapGetters("cards", { findCardsInStore: "find" }),
    ...mapGetters("activities", { findAcitivitiesInStore: "find" }),

    lists() {
      return this.findListsInStore({
        query: {
          boardId: this.$route.params.id
        }
      }).data;
    },
    activities() {
      return this.findAcitivitiesInStore({
        query: {
          boardId: this.$route.params.id
        }
      }).data;
    },
    cards() {
      return this.findCardsInStore({
        query: {
          boardId: this.$route.params.id
        }
      }).data;
    },
    cardsByListId() {
      return this.cards.reduce((byId, card) => {
        byId[card.listId] = byId[card.listId] || [];
        byId[card.listId].push(card);
        return byId;
      }, {});
    }
  }
};
</script>
