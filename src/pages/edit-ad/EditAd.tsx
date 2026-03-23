import { useParams } from "react-router";

import { Form } from "./components/Form";

export const EditAd = () => {
  const params = useParams();
  const itemId = Number(params.id);

  return (
    <div className="p-8">
      <p className="mb-4.5 text-3xl font-medium opacity-85">
        Редактирование объявления
      </p>
      <Form id={itemId} />
    </div>
  );
};
