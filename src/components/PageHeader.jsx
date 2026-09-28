import React from "react";

const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
    <div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-secondary">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1.5 text-secondary/60 text-sm max-w-xl">{subtitle}</p>
      )}
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export default PageHeader;
