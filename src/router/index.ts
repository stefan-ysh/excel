import { createRouter, createWebHistory } from "vue-router";
import Excel from "@/views/ExcelMain.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "excel",
      component: Excel,
    },
  ],
});

export default router;
