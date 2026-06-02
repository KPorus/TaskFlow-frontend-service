import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DashboardState } from "../../types";
import { ApiService } from "@/services/apiService";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchAll",
  async () => {
    const [stats, summaries, workload, upcomingDeadlines, highPriorityTasks, charts, activities] =
      await Promise.all([
        ApiService.dashboard.stats(),
        ApiService.dashboard.projectSummaries(),
        ApiService.dashboard.workload(),
        ApiService.dashboard.upcomingDeadlines(),
        ApiService.dashboard.highPriority(),
        ApiService.dashboard.charts(),
        ApiService.activity.recent(10),
      ]);
    return {
      stats,
      summaries,
      workload,
      upcomingDeadlines,
      highPriorityTasks,
      charts,
      activities,
    };
  }
);

const initialState: DashboardState = {
  stats: null,
  summaries: [],
  workload: [],
  upcomingDeadlines: [],
  highPriorityTasks: [],
  activities: [],
  charts: null,
  loading: false,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.summaries = action.payload.summaries;
        state.workload = action.payload.workload;
        state.upcomingDeadlines = action.payload.upcomingDeadlines;
        state.highPriorityTasks = action.payload.highPriorityTasks;
        state.charts = action.payload.charts;
        state.activities = action.payload.activities;
      })
      .addCase(fetchDashboard.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default dashboardSlice.reducer;
