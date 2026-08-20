import React from "react";

export default function OrgChartPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50/30 p-10 select-none">
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-xl font-bold text-slate-800">
          Sơ đồ tổ chức công ty
        </h1>
        <p className="text-xs text-slate-500">Chế độ xem tĩnh (Chỉ hiển thị)</p>
      </div>

      {/* Vùng chứa cho phép cuộn ngang nếu chart quá to */}
      <div className="w-full overflow-x-auto pb-10 custom-scrollbar">
        <div className="inline-block min-w-full p-4 align-middle">
          <OrgTree node={orgData} />
        </div>
      </div>
    </div>
  );
}

export function OrgTree({ node }) {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Render Node hiện tại */}
      <OrgCard node={node} />

      {hasChildren && (
        <>
          {/* Đường thẳng đi xuống từ Node cha */}
          <div className="w-px h-8 bg-slate-300" />

          {/* Khung chứa các node con */}
          <div className="flex gap-x-8 relative">
            {node.children!.map((child, index) => {
              const isFirst = index === 0;
              const isLast = index === node.children!.length - 1;

              return (
                <div
                  key={child.id}
                  className="relative flex flex-col items-center"
                >
                  {/* Thanh ngang kết nối */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px bg-slate-300"
                    style={{
                      left: isFirst ? "50%" : "0",
                      right: isLast ? "50%" : "0",
                      transform: !isFirst && !isLast ? "scaleX(150%)" : "none",
                    }}
                  />
                  {/* Đường dọc đi xuống từng Node con */}
                  <div className="w-px h-6 bg-slate-300" />

                  {/* Đệ quy gọi lại chính nó */}
                  <OrgTree node={child} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

// Giả lập màu sắc theo theme giống trong ảnh
const themeStyles = {
  red: {
    border: "border-red-200 bg-red-50/10",
    badge: "bg-blue-50 text-blue-600 border-blue-200",
    avatar: "bg-red-400 text-white",
  },
  blue: {
    border: "border-sky-200 bg-sky-50/10",
    badge: "bg-sky-50 text-sky-600 border-sky-200",
    avatar: "bg-sky-400 text-white",
  },
  yellow: {
    border: "border-amber-200 bg-amber-50/10",
    badge: "bg-amber-50 text-amber-600 border-amber-200",
    avatar: "bg-amber-400 text-white",
  },
  gray: {
    border: "border-slate-200 border-dashed bg-slate-50/50",
    badge: "bg-slate-100 text-slate-600",
    avatar: "bg-slate-300 text-slate-700",
  },
};

export function OrgCard({ node }) {
  const styles = themeStyles[node.theme || "blue"];

  return (
    <div className="flex flex-col items-center min-w-[240px] max-w-[280px]">
      {/* Node chính */}
      <div
        className={`relative w-full p-4 rounded-2xl border bg-white shadow-sm text-left ${styles.border}`}
      >
        {node.count !== undefined && (
          <span
            className={`absolute -top-2.5 right-4 px-2 py-0.5 text-[10px] font-semibold rounded-full border ${styles.badge}`}
          >
            {node.count} người
          </span>
        )}

        <div className="flex items-center gap-3">
          {node.initials ? (
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${styles.avatar}`}
            >
              {node.initials}
            </div>
          ) : (
            <div className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 bg-slate-50">
              🏢
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-slate-800 truncate">
              {node.name}
            </h4>
            {node.role && (
              <p className="text-xs text-slate-500 truncate">{node.role}</p>
            )}
          </div>
        </div>

        {(node.dept || node.email) && (
          <div className="mt-3 pt-2 border-t border-dashed border-slate-100 text-[11px] text-slate-400">
            {node.dept && <div className="truncate">{node.dept}</div>}
            {node.email && (
              <div className="text-slate-500 truncate">{node.email}</div>
            )}
          </div>
        )}
      </div>

      {/* Đường nối xuống danh sách Sub-team nếu có */}
      {node.subTeams && node.subTeams.length > 0 && (
        <div className="w-px h-4 border-l border-dashed border-slate-300" />
      )}

      {/* Danh sách Sub-teams (Sales Team 1, 2, 3...) */}
      {node.subTeams && node.subTeams.length > 0 && (
        <div className="w-full flex flex-col gap-1.5 p-2 bg-slate-50/50 rounded-xl border border-slate-100">
          {node.subTeams.map((team, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm text-xs"
            >
              <span className="text-slate-600 truncate mr-2">
                📁 {team.name}
              </span>
              <span className="text-slate-400 text-[10px] shrink-0">
                {team.count} người
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export const orgData = {
  id: "1",
  name: "Sang-hoon Lee",
  role: "CEO",
  dept: "CEO Office",
  email: "ceo@betek.com",
  initials: "SA",
  count: 18,
  theme: "red",
  children: [
    {
      id: "2",
      name: "Chul-soo Park",
      role: "Division Head",
      dept: "Sales Division",
      email: "cs.park@betek.com",
      initials: "CH",
      count: 4,
      theme: "blue",
      subTeams: [
        { name: "Sales Team 1", count: 2 },
        { name: "Sales Team 2", count: 1 },
        { name: "Sales Team 3", count: 0 },
      ],
    },
    {
      id: "2",
      name: "Chul-soo Park",
      role: "Division Head",
      dept: "Sales Division",
      email: "cs.park@betek.com",
      initials: "CH",
      count: 4,
      theme: "blue",
      subTeams: [
        { name: "Sales Team 1", count: 2 },
        { name: "Sales Team 2", count: 1 },
        { name: "Sales Team 3", count: 0 },
      ],
    },
    {
      id: "2",
      name: "Chul-soo Park",
      role: "Division Head",
      dept: "Sales Division",
      email: "cs.park@betek.com",
      initials: "CH",
      count: 4,
      theme: "blue",
      subTeams: [
        { name: "Sales Team 1", count: 2 },
        { name: "Sales Team 2", count: 1 },
        { name: "Sales Team 3", count: 0 },
      ],
    },
    {
      id: "3",
      name: "Dong-kyu Sh...",
      role: "IT Manager",
      dept: "IT Department",
      email: "dk.shin@betek.com",
      initials: "DO",
      count: 3,
      theme: "blue",
      children: [
        {
          id: "3-1",
          name: "System Admin",
          role: "System Administra...",
          email: "admin@betek.com",
          initials: "SY",
          theme: "yellow",
          subTeams: [
            { name: "Development Tea...", count: 1 },
            { name: "Infrastructure Te...", count: 0 },
            { name: "QA Team", count: 0 },
          ],
        },
      ],
    },
    {
      id: "4",
      name: "Finance Team",
      role: "",
      initials: "",
      count: 2,
      theme: "gray",
      children: [
        {
          id: "4-1",
          name: "Ji-woo Han",
          role: "재무담당 / Finance ...",
          email: "jw.han@betek.com",
          initials: "JI",
          theme: "yellow",
          subTeams: [
            { name: "Accounting Team", count: 1 },
            { name: "Budget Team", count: 0 },
          ],
        },
      ],
    },
    {
      id: "5",
      name: "Finance Team",
      role: "",
      initials: "",
      count: 2,
      theme: "gray",
      children: [
        {
          id: "4-1",
          name: "Ji-woo Han",
          role: "재무담당 / Finance ...",
          email: "jw.han@betek.com",
          initials: "JI",
          theme: "yellow",
          subTeams: [
            { name: "Accounting Team", count: 1 },
            { name: "Budget Team", count: 0 },
          ],
        },
      ],
    },
    {
      id: "5",
      name: "Finance Team",
      role: "",
      initials: "",
      count: 2,
      theme: "gray",
      children: [
        {
          id: "4-1",
          name: "Ji-woo Han",
          role: "재무담당 / Finance ...",
          email: "jw.han@betek.com",
          initials: "JI",
          theme: "yellow",
          subTeams: [
            { name: "Accounting Team", count: 1 },
            { name: "Budget Team", count: 0 },
          ],
        },
      ],
    },
    {
      id: "5",
      name: "Finance Team",
      role: "",
      initials: "",
      count: 2,
      theme: "gray",
      children: [
        {
          id: "4-1",
          name: "Ji-woo Han",
          role: "재무담당 / Finance ...",
          email: "jw.han@betek.com",
          initials: "JI",
          theme: "yellow",
          subTeams: [
            { name: "Accounting Team", count: 1 },
            { name: "Budget Team", count: 0 },
          ],
        },
      ],
    },
    {
      id: "5",
      name: "Finance Team",
      role: "",
      initials: "",
      count: 2,
      theme: "gray",
      children: [
        {
          id: "4-1",
          name: "Ji-woo Han",
          role: "재무담당 / Finance ...",
          email: "jw.han@betek.com",
          initials: "JI",
          theme: "yellow",
          subTeams: [
            { name: "Accounting Team", count: 1 },
            { name: "Budget Team", count: 0 },
          ],
        },
      ],
    },
  ],
};
