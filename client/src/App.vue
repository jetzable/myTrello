<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title>MyTrello</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!user">
        <v-btn
          flat
          :to="{name: 'login'}"
        >Login</v-btn>
        <v-btn
          flat
          :to="{name: 'signup'}"
        >SignUp</v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-if="user">
        <v-layout
          justify-content
          align-center
        >
          <h3>{{user.user.displayName}}</h3>
          <v-avatar
            :size="40"
            color="grey lighten-4"
          >
            <img
              :src="user.user.imageUrl"
              alt="avatar"
            >
          </v-avatar>
        </v-layout>
        <v-btn
          flat
          @click.prevent="logout"
        >Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content>
      <router-view />
    </v-content>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2018 Built with Love by Jetzable</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "App",
  data() {
    return {
      fixed: false
    };
  },
  computed: {
    ...mapState("auth", { user: "payload" })
  },
  methods: {
    ...mapActions("auth", { authLogout: "logout" }),
    logout() {
      this.authLogout().then(() => this.$router.push("/login"));
    }
  }
};
</script>
