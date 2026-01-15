import { RootState } from "@/store/store";
import React from "react";
import { useSelector, } from "react-redux";
import {Navigate } from "react-router-dom";




export const DashboardHome: React.FC = () => {
  const { teams } = useSelector((state: RootState) => state.data);

  if (teams.length > 0) {
    return <Navigate to={`/dashboard/${teams[0].id}`} replace />;
  }

  return (
    <div id="daskboard-component-ts" className="flex-1 flex flex-col items-center justify-center text-gray-400 p-4 text-center">
      <p>Select a team from the sidebar or create a new one to get started.</p>
    </div>
  );
};
