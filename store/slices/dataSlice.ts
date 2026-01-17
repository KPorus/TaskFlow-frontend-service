import { createSlice } from "@reduxjs/toolkit";
import { DataState } from "../../types";
import { applyTeamUpdated, setActiveTeam } from "./helper/teamReducers";
import { socketReducers } from "./helper/socketReducers";
import {
  addTeamMember,
  createTask,
  createTeam,
  deleteTask,
  deleteTeam,
  fetchAllUsers,
  fetchTasks,
  fetchTeams,
  removeTeamMember,
  updateTask,
} from "./helper/dataThunks";
import {
  applySocketTaskCreated,
  applyTaskDeleted,
  applyTaskUpdated,
} from "./helper/taskReducers";

const initialState: DataState = {
  teams: [],
  tasks: [],
  users: [],
  activeTeamId: null,
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setActiveTeam,
    ...socketReducers,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.teams = action.payload;
        if (!state.activeTeamId && action.payload.length > 0) {
          state.activeTeamId = action.payload[0].id;
        }
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.teams.push(action.payload);
        state.activeTeamId = action.payload.id;
        state.tasks = [];
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.teams = state.teams.filter((t) => t.id !== action.payload);
        if (state.activeTeamId === action.payload) {
          state.activeTeamId =
            state.teams.length > 0 ? state.teams[0].id : null;
        }
      })
      .addCase(addTeamMember.fulfilled, (state, action) => {
        applyTeamUpdated(state, action);
      })
      .addCase(removeTeamMember.fulfilled, (state, action) => {
        applyTeamUpdated(state, action);
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.tasks = []; 
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        applySocketTaskCreated(state, action);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        applyTaskUpdated(state, action);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        applyTaskDeleted(state, action);
      });
  },
});

export const {
  setActiveTeam: setActiveTeamAction,
  socketTaskCreated,
  socketTaskUpdated,
  socketTaskDeleted,
  socketTeamUpdated,
} = dataSlice.actions;

export default dataSlice.reducer;
