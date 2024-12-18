import React from "react";
import { Route, Routes } from "react-router-dom";

// import Home from "./pages/Home";
import Chat from "./pages/Chat";
import ChatWithUnstructure from "./pages/ChatWithUnstructure";
import Queries from "./pages/Queries";
import DBConfig from "./pages/DBConfig";
import Layout from "./layout/index";
import SimpleAlert from "./components/Alert";
// -------------user stoty use case---------------
import Upload from "./pages/Upload";
import Config from "./pages/Config";

function App() {
  return (
    <Layout>
      <SimpleAlert />
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<></>} />
        <Route path="/sql-chat" element={<Chat />} />
        <Route path="/data-chat" element={<ChatWithUnstructure />} />
        <Route path="/query" element={<Queries />} />

        <Route path="/upload" element={<Upload />} />

        <Route path="/config" element={<Config />} />
        <Route path="/db-config" element={<DBConfig />} />
      </Routes>
    </Layout>
  );
}

export default App;
