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
          @submit.prevent="signUp"
        >
          <v-text-field
            v-model="user.username"
            :rules="notEmptyRules"
            label="Username"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.displayName"
            :rules="notEmptyRules"
            label="Display Name"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :rules="notEmptyRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.confirmPassword"
            :rules="confirmPasswordRules"
            label="Confirm Password"
            type="password"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.imageUrl"
            :rules="notEmptyRules"
            label="Image Url"
            required
          ></v-text-field>
          <v-btn
            type="submit"
            :disabled="!valid"
          >SignUp</v-btn>
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
import { mapState } from "vuex";

export default {
  name: "signup",
  data: vm => ({
    valid: false,
    user: {
      username: "",
      password: "",
      confirmPassword: "",
      displayName: "",
      imageUrl: ""
    },
    notEmptyRules: [value => !!value || "This Field is required"],
    confirmPasswordRules: [
      confirmPassword =>
        confirmPassword === vm.user.password || "Password Must Match"
    ]
  }),
  methods: {
    signUp() {
      if (this.valid) {
        console.log("ya");
      }
    }
  }
};
</script>


