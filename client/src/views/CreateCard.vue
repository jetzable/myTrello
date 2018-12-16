<template>
  <v-flex
    sm12
    pa-2
  >
    <v-card>
      <v-card-title>
        <div>
          <div class="headline">Create Card</div>
          <div>
            <v-form
              v-if="!creatingCard"
              v-model="validCard"
              @submit.prevent="createCard"
            >
              <v-text-field
                v-model="card.title"
                :rules="notEmptyRules"
                label="Title"
                required
              ></v-text-field>
              <v-card-actions>
                <v-btn
                  flat
                  color="secondary"
                  type="submit"
                  :disabled="!validCard"
                >Create Card</v-btn>
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
</template>


<script>
import { mapState } from "vuex";

export default {
  name: "create-card",
  props: ["listId", "boardId"],
  data: () => ({
    creatingCard: false,
    validCard: false,
    card: {
      title: "",
      members: []
    },
    notEmptyRules: [value => !!value || "This Field is required"]
  }),
  methods: {
    async createCard() {
      if (this.validCard) {
        const { Card } = this.$FeathersVuex;
        this.card.boardId = this.boardId;
        this.card.listId = this.listId;
        const card = new Card(this.card);
        this.creatingCard = true;
        await card.save();
        this.creatingCard = false;
        this.card = {
          title: "",
          members: []
        };
      }
    }
  }
};
</script>
