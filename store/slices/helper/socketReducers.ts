import { DataState, Project } from "../../../types";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  applySocketTaskCreated,
  applyTaskUpdated,
  applyTaskDeleted,
} from "./taskReducers";
import {
  applyProjectUpdated,
  applyDeleteProject,
} from "./projectReducers";

export const socketReducers = {
  socketTaskCreated: applySocketTaskCreated,
  socketTaskUpdated: applyTaskUpdated,
  socketTaskDeleted: applyTaskDeleted,
  socketProjectUpdated: applyProjectUpdated as (
    state: DataState,
    action: PayloadAction<Project>
  ) => void,
  socketProjectDelete: applyDeleteProject as (
    state: DataState,
    action: PayloadAction<string>
  ) => void,
};
