import React from "react";
import { EXICUTE_QUERY } from "../config";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { updateMessage } from "../redux/slices/chatSlices";
import { useFetch } from "../hook/useFetch";

interface SqlUpdateProps {
  query: string;
  chatId: number;
  setLoadingUi: React.Dispatch<React.SetStateAction<boolean>>;
}

const SqlUpdate: React.FC<SqlUpdateProps> = ({
  query,
  chatId,
  setLoadingUi,
}) => {
  if (!chatId) return;

  const dispatch = useDispatch<AppDispatch>();
  const fetchData = useFetch();
  const [sqlQuery, setSqlQuery] = React.useState<string>(query);

  const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingUi(true);
    const formData = new FormData(e.currentTarget);
    const getQuery = formData.get("query");
    if (getQuery) {
      setSqlQuery(getQuery.toString());
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      sql_query: getQuery,
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    fetchData(EXICUTE_QUERY, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setLoadingUi(false);
        dispatch(
          updateMessage({
            chatId,
            result: { result: result.result, query: result.query },
          })
        );
      })
      .catch((error) => {
        console.error(error);
        setLoadingUi(false);
      });
  };

  return (
    <div>
      <form
        onSubmit={(e) => onsubmitHandler(e)}
        style={{ gridColumn: "span 4", marginBottom: "20px" }}
      >
        <div className="Input-Container">
          <input
            className="Input-Field"
            type="text"
            placeholder="How can I help you today?"
            id="query"
            name="query"
            defaultValue={sqlQuery}
          />
          <button className="Send-Button" type="submit">
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAddJREFUaAXtmOFtwjAQRhmhI+RnFO47ZYSO0BEYgREYgQ3aTdoN2g3oBozQ9ipOOqwkOPjsGClIyHYI8Xtnn+Nks1k/awTWCFxFgIieAZwB/AB4bdu2uTqh9gaA0wVeBPT7OCIm+gpvy/pFiOhgIm/hbb1ekUsOWNipep0iAN4jRsGK1SWy3W73MwVUpg6Rvu+fbiSzAo+Vy4vcMY2GZJYTmZnMQ/D22DIiidPICmi9rEjkPUHh5pRlRJyn0ZBgfhGnZB6Ct8fyiSTcEyxgbN1f5HJPiAXwOs9XRHKBmfdEdATwwcz6vOAFPHYdXxH7LCMjU1Asn4iVknpOMcnHsL9ibSexczHgsKOmaf6nnERRcomIZMs+K5eY+RRe173tATq0lRd4yTk34FygIbyAA9glgYt5ytCHUDFtF3CxlvdCMR16neMGrkPWdd3OC27qOu7gKkBEn1Mdp/6WDTz39MkKrtEH8JYa4fD/RcCNwNB70rGN1+TxouAiAOAljN497eLgJvpJ00e23Mx8kD2QXrNYmbL2LwquEbpn7a8CXAXmrP1VgYtA7PSpDlyjf2vtrxZcBcamT/XgKhC+yHoYcBXouq7/u4l9MfP3Yuu4wqzlGoE1Ajcj8AvY+lHSUC3vMgAAAABJRU5ErkJggg=="
              alt="Send"
              className="Send-Icon"
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SqlUpdate;
