/* eslint-disable */
// Automatically generated by declarative-routing, do NOT edit
import { z } from "zod";
import { makeRoute } from "./makeRoute";

const defaultInfo = {
  search: z.object({})
};

import * as HomeRoute from "@/app/[lng]/page.info";
import * as VaultPageRoute from "@/app/[lng]/[vault]/page.info";
import * as RewardsRoute from "@/app/[lng]/rewards/page.info";
import * as SettingsRoute from "@/app/[lng]/settings/page.info";
import * as WelcomeRoute from "@/app/[lng]/welcome/page.info";

export const Home = makeRoute(
  "/[lng]",
  {
    ...defaultInfo,
    ...HomeRoute.Route
  }
);
export const VaultPage = makeRoute(
  "/[lng]/[vault]",
  {
    ...defaultInfo,
    ...VaultPageRoute.Route
  }
);
export const Rewards = makeRoute(
  "/[lng]/rewards",
  {
    ...defaultInfo,
    ...RewardsRoute.Route
  }
);
export const Settings = makeRoute(
  "/[lng]/settings",
  {
    ...defaultInfo,
    ...SettingsRoute.Route
  }
);
export const Welcome = makeRoute(
  "/[lng]/welcome",
  {
    ...defaultInfo,
    ...WelcomeRoute.Route
  }
);

