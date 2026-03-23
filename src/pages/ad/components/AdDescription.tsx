interface AdDescriptionProps {
  description?: string;
}

export const AdDescription = (props: AdDescriptionProps) => {
  return props.description ? (
    <div className="flex flex-col gap-4 items-start">
      <p className="text-[22px] leading-7 font-medium">Описание</p>
      <p>{props.description}</p>
    </div>
  ) : (
    <p className="text-[22px] leading-7 font-medium opacity-45">Нет описания</p>
  );
};
