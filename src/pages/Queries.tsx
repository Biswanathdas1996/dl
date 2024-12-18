import React from "react";
import Table from "../components/Table";
import { useFetch } from "../hook/useFetch";
import { QUERY_LIST } from "../config";

const Queries: React.FC = () => {
  const [message, setMessage] = React.useState<any>(null);
  const [id, setId] = React.useState<string>("");
  const fetchData = useFetch();
  React.useEffect(() => {
    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow" as RequestRedirect,
    };

    fetchData(QUERY_LIST, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setMessage(result);
        setId(result.id || "");
      })
      .catch((error) => console.error(error));
  }, []);
  return (
    <div>
      <h2>Saved Queries</h2>

      <Table
        data={Array.isArray(message) ? message : []}
        loadingUi={false}
        chatId={id as unknown as number}
      />
    </div>
  );
};

export default Queries;
