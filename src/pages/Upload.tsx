import React, { useState, useEffect } from "react";
import { UPLOAD_DOC, COLLECTIONS } from "../config";
import { Button, TextField } from "@mui/material";
import AutoCompleteInput from "../components/SelectCollection";
import ListView from "../components/ListView";
import { useFetchCollection } from "../hook/useFetchCollection";
import { useFetch } from "../hook/useFetch";

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [value, setValue] = React.useState<any>(null);
  const fetchData = useFetch();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formdata = new FormData();
    formdata.append("files", file);
    formdata.append("collection_name", value?.title);

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow" as RequestRedirect,
    };

    fetchData(UPLOAD_DOC, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  };
  console.log(value?.title);
  return (
    <>
      <h2>Upload Documents</h2>
      <div className="bot-details-card">
        <h2>Upload Your Documents</h2>
        <p>
          Please select a file to upload. Ensure it is in the correct format.
        </p>
        <br />
        <br />
        <div className="chat-menuHldr">
          <div className="mrl">
            <div></div>
            <div>
              <div>
                <AutoCompleteInput />
                <TextField
                  type="file"
                  onChange={handleFileChange}
                  variant="outlined"
                />
                <br />
                <br />
                <Button
                  variant="contained"
                  color="warning"
                  onClick={handleUpload}
                  style={{ padding: "15px 20px", marginLeft: "10px" }}
                >
                  Upload
                </Button>
              </div>
              <div></div>
            </div>
            <div></div>
          </div>
          <br />
          <br />
          {/* {collections && <ListView collections={collections?.collections} />} */}
        </div>
      </div>
    </>
  );
};

export default Upload;
