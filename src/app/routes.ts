import { createBrowserRouter } from "react-router";
import { Layout } from "./Layout";
import { Dashboard } from "./views/Dashboard";
import { WaterWorkouts } from "./views/WaterWorkouts";
import { LandWorkouts } from "./views/LandWorkouts";
import { DietPlan } from "./views/DietPlan";
import { Login } from "./views/Login";
import { Signup } from "./views/Signup";
import { Profile } from "./views/Profile";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "water", Component: WaterWorkouts },
      { path: "land", Component: LandWorkouts },
      { path: "diet", Component: DietPlan },
      { path: "profile", Component: Profile }
    ],
  },
]);