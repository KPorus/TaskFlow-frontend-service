// BoardHeader.tsx
import React from "react";
import { Menu, Settings } from "lucide-react";
import { Team, User } from "../../types";
import { TeamMembersAvatarGroup } from "./TeamMembersAvatarGroup";

interface Props {
  team?: Team;
  isOwner: boolean;
  onOpenSidebar: () => void;
  onOpenTeamSettings: () => void;
}

export const BoardHeader: React.FC<Props> = ({
  team,
  isOwner,
  onOpenSidebar,
  onOpenTeamSettings,
}) => {
  const members: User[] =
    team?.members
      .filter((m) => typeof m.user === "object")
      .map((m) => m.user as User) || [];

  return (
    <header id="board-view-header--ts" className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 flex-shrink-0 z-10">
      <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          <Menu size={24} />
        </button>

        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
            {team ? team.name : "Loading..."}
          </h2>
          <p className="text-xs text-gray-500 hidden sm:block">Board View</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <TeamMembersAvatarGroup members={members} />
        {isOwner && (
          <button
            onClick={onOpenTeamSettings}
            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
          >
            <Settings size={20} />
          </button>
        )}
      </div>
    </header>
  );
};
