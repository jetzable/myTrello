<template>
  <v-app>
    <v-toolbar app></v-toolbar>

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
export default {
  name: "App"
};
</script>
