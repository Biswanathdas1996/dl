import React from "react";
import WelcomeChatComp from "../components/WelcomeChatComp";
import UserChat from "../components/UserChat";
import LlmReply from "../components/LlmReply";
import { QUERY, CALL_GPT } from "../config";
import Loader from "../components/Loader";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { addMessage } from "../redux/slices/chatSlices";
import { useFetch } from "../hook/useFetch";
const Chat: React.FC = () => {
  const chatHistory = useSelector((state: RootState) => state.chat.value);
  const fetchData = useFetch();
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = React.useState<boolean>(false);

  const onsubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query");

    dispatch(
      addMessage({
        id: new Date().getTime(),
        type: "user",
        message: query as string,
        time: new Date().toLocaleTimeString(),
      })
    );

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      question: query,
      working_table_description: localStorage.getItem("dbJson"),
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    fetchData(QUERY, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        dispatch(
          addMessage({
            id: new Date().getTime(),
            type: "llm",
            message: result,
            time: new Date().toLocaleTimeString(),
          })
        );

        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
    (e.target as HTMLFormElement).query.value = "";
  };

  //   React.useEffect(() => {
  //     const chatScrollHolder = document.querySelector(".chat-scrollhldr");
  //     if (chatScrollHolder) {
  //       chatScrollHolder.scrollTop = chatScrollHolder.scrollHeight;
  //     }
  //   }, [chatHistory]);
  const startNewProcess = () => {
    localStorage.removeItem("chatData");
    window.location.reload();
  };
  return (
    <>
      <h2>Chat</h2>
      <div className="chat-hldr">
        <div className="chat-scrollhldr">
          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "right",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <button
                className="newConversationButton"
                style={{ width: "100px", height: 20 }}
                onClick={() => startNewProcess()}
              >
                Start new
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAqBJREFUWAm1WLuRAjEMpQRKuAYogIyIAiiAuRgSIghhhgIoAGaOkOwIyKEDLoQcYlk0sHdvx1qMd621ObgZj9a29PQsyR+u0Uj4I6ImEY2Y+csYc2RmYubMNsKYMeabiD6J6CMBOk6ViDrGmL3jVJyr0pLqxHlRtLCqZwj4hC2h5yJkU+CGXl2977yiT8BU1l2e+gOZVgD9l4jYT8seK0beTCKOjE2HKKvyfD5n4/H4oV2vV9XGjXIwTShMbzuqoIfDIWu1Wlm3283a7Xb+jTHXWc03aqZcwKjsGsMHJ0IE0v1OwbjdbvuH6sA5kQIAXde5+52KA98FGSLaagCn0ynz2263K9IhRDabTUkPdhp2ERVbG0FlAKEWQg0khEhIp44Mro4G7gWNsRDBDsGK/YZ57BZ/HH3YgFwEkRGI1KYFYADWCFfNwSaGCC7RBjPjFg06kYhMJpPKVVdFQsZgE0nkCCLqfSJEAPhsizjoCESC0ZA52SHL5TIvTClQTUIXxGNTGkVEQCNWVixKIglbWZAma1MD4/l8nh/jAoQIDYfDkoPBYJBhTvRw9MNW+orMU6MWK4z7/X7eBGixWOR3jPRF+qmAXa/XiyFyxPZdC1BI+iuLJeJHMoTPzFsQwWM4yBp1gZXCOfKOBge4daUvEnqr1aoYhw3GMK/5wKEKIk1Nqe74hqO6BgzNR/EcwMUTUkREUIBySD0jL5eLRmTr3r7Jz4AQ8dTxh2cAGGlRSQVP0L9HQ8JinwPqcZ/gQEuFzFU/FUGobge9mIj+G4eZZy92KBFw5Uwyoco3k4kjIQxtml5ZM8DS0yHOfWkLWH3BxaTRGHMoDi3fSUrf/txIJmQJ3H8upDjVdLEq+9jeGmN+vNcd/lGDsTXSmr/MNTBv7hffBPEsHKEseQAAAABJRU5ErkJggg=="
                  alt="Clear Chat"
                />
              </button>
              <p style={{ fontSize: 10, marginTop: 0 }}>
                * Old data will be cleared on starting new
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                width: "100%",
              }}
            >
              <button
                className="newConversationButton"
                style={{ width: "150px", height: 20 }}
                onClick={() => (window.location.href = "#/db-config")}
              >
                Database settings
                <img
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAqBJREFUWAm1WLuRAjEMpQRKuAYogIyIAiiAuRgSIghhhgIoAGaOkOwIyKEDLoQcYlk0sHdvx1qMd621ObgZj9a29PQsyR+u0Uj4I6ImEY2Y+csYc2RmYubMNsKYMeabiD6J6CMBOk6ViDrGmL3jVJyr0pLqxHlRtLCqZwj4hC2h5yJkU+CGXl2977yiT8BU1l2e+gOZVgD9l4jYT8seK0beTCKOjE2HKKvyfD5n4/H4oV2vV9XGjXIwTShMbzuqoIfDIWu1Wlm3283a7Xb+jTHXWc03aqZcwKjsGsMHJ0IE0v1OwbjdbvuH6sA5kQIAXde5+52KA98FGSLaagCn0ynz2263K9IhRDabTUkPdhp2ERVbG0FlAKEWQg0khEhIp44Mro4G7gWNsRDBDsGK/YZ57BZ/HH3YgFwEkRGI1KYFYADWCFfNwSaGCC7RBjPjFg06kYhMJpPKVVdFQsZgE0nkCCLqfSJEAPhsizjoCESC0ZA52SHL5TIvTClQTUIXxGNTGkVEQCNWVixKIglbWZAma1MD4/l8nh/jAoQIDYfDkoPBYJBhTvRw9MNW+orMU6MWK4z7/X7eBGixWOR3jPRF+qmAXa/XiyFyxPZdC1BI+iuLJeJHMoTPzFsQwWM4yBp1gZXCOfKOBge4daUvEnqr1aoYhw3GMK/5wKEKIk1Nqe74hqO6BgzNR/EcwMUTUkREUIBySD0jL5eLRmTr3r7Jz4AQ8dTxh2cAGGlRSQVP0L9HQ8JinwPqcZ/gQEuFzFU/FUGobge9mIj+G4eZZy92KBFw5Uwyoco3k4kjIQxtml5ZM8DS0yHOfWkLWH3BxaTRGHMoDi3fSUrf/txIJmQJ3H8upDjVdLEq+9jeGmN+vNcd/lGDsTXSmr/MNTBv7hffBPEsHKEseQAAAABJRU5ErkJggg=="
                  alt="Clear Chat"
                />
              </button>

              <p style={{ fontSize: 10 }}>
                * generated data will be base on selected collection only
              </p>
            </div>
          </div>
          <WelcomeChatComp />
          <div className="chat-msg">
            {chatHistory.map((chat: any, index) => {
              return chat.type === "user" ? (
                <UserChat chat={chat} key={chat.id} />
              ) : (
                <LlmReply
                  chat={chat}
                  loading={loading}
                  key={chat.id}
                  userQuestion={chatHistory[index - 1]}
                />
              );
            })}
            {loading && <Loader />}
          </div>
        </div>

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

      <button className="newConversationButton">
        Clear Chat
        <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAqBJREFUWAm1WLuRAjEMpQRKuAYogIyIAiiAuRgSIghhhgIoAGaOkOwIyKEDLoQcYlk0sHdvx1qMd621ObgZj9a29PQsyR+u0Uj4I6ImEY2Y+csYc2RmYubMNsKYMeabiD6J6CMBOk6ViDrGmL3jVJyr0pLqxHlRtLCqZwj4hC2h5yJkU+CGXl2977yiT8BU1l2e+gOZVgD9l4jYT8seK0beTCKOjE2HKKvyfD5n4/H4oV2vV9XGjXIwTShMbzuqoIfDIWu1Wlm3283a7Xb+jTHXWc03aqZcwKjsGsMHJ0IE0v1OwbjdbvuH6sA5kQIAXde5+52KA98FGSLaagCn0ynz2263K9IhRDabTUkPdhp2ERVbG0FlAKEWQg0khEhIp44Mro4G7gWNsRDBDsGK/YZ57BZ/HH3YgFwEkRGI1KYFYADWCFfNwSaGCC7RBjPjFg06kYhMJpPKVVdFQsZgE0nkCCLqfSJEAPhsizjoCESC0ZA52SHL5TIvTClQTUIXxGNTGkVEQCNWVixKIglbWZAma1MD4/l8nh/jAoQIDYfDkoPBYJBhTvRw9MNW+orMU6MWK4z7/X7eBGixWOR3jPRF+qmAXa/XiyFyxPZdC1BI+iuLJeJHMoTPzFsQwWM4yBp1gZXCOfKOBge4daUvEnqr1aoYhw3GMK/5wKEKIk1Nqe74hqO6BgzNR/EcwMUTUkREUIBySD0jL5eLRmTr3r7Jz4AQ8dTxh2cAGGlRSQVP0L9HQ8JinwPqcZ/gQEuFzFU/FUGobge9mIj+G4eZZy92KBFw5Uwyoco3k4kjIQxtml5ZM8DS0yHOfWkLWH3BxaTRGHMoDi3fSUrf/txIJmQJ3H8upDjVdLEq+9jeGmN+vNcd/lGDsTXSmr/MNTBv7hffBPEsHKEseQAAAABJRU5ErkJggg=="
          alt="Clear Chat"
        />
      </button>
    </>
  );
};

export default Chat;
