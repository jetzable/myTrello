<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout
        column
        align-center
      >
        <v-form
          v-if="!loading"
          v-model="valid"
          @submit.prevent="login"
        >
          <v-text-field
            v-model="user.username"
            :rules="notEmptyRules"
            label="Username"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :rules="notEmptyRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-btn
            type="submit"
            :disabled="!valid"
          >Login</v-btn>
        </v-form>
        <v-progress-circular
          v-if="loading"
          :size="70"
          :width="7"
          color="primary"
          indeterminate
        ></v-progress-circular>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template> 

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "login",
  data: vm => ({
    valid: false,
    user: {
      username: "",
      password: ""
    },
    notEmptyRules: [value => !!value || "This Field is required"]
  }),
  computed: {
    ...mapState("auth", { loading: "isAuthenticatePending" })
  },
  methods: {
    ...mapActions("auth", ["authenticate", "logout"]),
    async login() {
      if (this.valid) {
        this.authenticate({
          strategy: "local",
          ...this.user
        })
          .then(async () => {
            this.$router.push("/boards");
          })
          .catch(e => {
            console.error("Authentication error", e);
          });
      }
    }
  }
};
</script>
