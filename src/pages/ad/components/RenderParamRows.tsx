type ParamRow = {
  label: string;
  value?: string | number;
};

export const RenderParamRows = (rows: ParamRow[]) => (
  <div className="flex flex-col gap-1.5 min-w-57.5">
    {rows.map(({ label, value }) => {
      if (value === undefined || value === null || value === "") {
        return null;
      }

      return (
        <div key={label} className="flex items-center justify-between gap-4">
          <span className="font-semibold opacity-45">{label}</span>
          <span>{value}</span>
        </div>
      );
    })}
  </div>
);
