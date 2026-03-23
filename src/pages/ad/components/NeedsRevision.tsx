interface NeedsRevisionProps {
  needableParams: string[];
}

export const NeedsRevision = (props: NeedsRevisionProps) => {
  return (
    <div className="min-w-lg flex gap-4 items-start rounded-lg bg-[#F9F1E6] px-4 py-3 shadow-[0px_3px_6px_-4px_rgba(0,0,0,0.12),0px_6px_16px_rgba(0,0,0,0.08),0px_9px_28px_8px_rgba(0,0,0,0.05)]">
      <img src="/info-icon.svg" alt="" className="w-4 h-4" />
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-base leading-6">Требуются доработки</p>
        <div className="opacity-85 text-[14px]">
          <p>У объявления не заполнены поля:</p>
          <ul>
            {props.needableParams.map((item) => (
              <li className="flex items-center gap-2">
                <span className="size-0.75 rounded-full bg-black/85 ml-2.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
