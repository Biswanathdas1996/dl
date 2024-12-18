import React from "react";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import { GENERATE_ERD_FROM_DB, GET_ERD_IMG } from "../config";
import Button from "@mui/material/Button";
import BRD from "../components/BRD";
import ImageListItem from "@mui/material/ImageListItem";
import ReactJson from "react-json-view";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Loader from "../components/Loader";
// Helper function to render each node recursively
interface Column {
  column_name: string;
  data_type: string;
}

interface Relationship {
  source_column: string;
  target_table: string;
  target_column: string;
}

interface Table {
  columns: Column[];
  relationships: Relationship[];
}

interface DatabaseSchema {
  [key: string]: Table;
}

const renderTree = (data: any): JSX.Element => {
  if (Array.isArray(data)) {
    return (
      <ul>
        {data.map((item, index) => (
          <li key={index}>{renderTree(item)}</li>
        ))}
      </ul>
    );
  } else if (typeof data === "object") {
    return (
      <ul>
        {Object.keys(data).map((key) => (
          <li key={key}>
            <strong>{key}:</strong>
            {renderTree(data[key])}
          </li>
        ))}
      </ul>
    );
  } else {
    return <span>{data}</span>;
  }
};

// Functional component to render the entire JSON data
interface JsonTreeViewProps {
  data: any;
}

const JsonTreeView: React.FC<JsonTreeViewProps> = ({ data }) => {
  return <div>{renderTree(data)}</div>;
};

const DBConfig: React.FC = () => {
  const [img, setImg] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [dbJson, setDbJson] = React.useState(null);
  const [value, setValue] = React.useState("one");

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const [dbConfig, setDbConfig] = React.useState({
    dbname: "",
    user: "",
    password: "",
    host: "",
    port: "",
  });

  React.useEffect(() => {
    const storedDbConfig = localStorage.getItem("dbConfig");
    if (storedDbConfig) {
      setDbConfig(JSON.parse(storedDbConfig));
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDbConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const handleFileUpload = () => {
    localStorage.setItem("dbConfig", JSON.stringify(dbConfig));
    setLoading(true);
    localStorage.removeItem("dbJson");
    const formdata = new FormData();
    formdata.append("dbname", dbConfig.dbname);
    formdata.append("user", dbConfig.user);
    formdata.append("password", dbConfig.password);
    formdata.append("host", dbConfig.host);
    formdata.append("port", dbConfig.port);
    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow" as RequestRedirect,
    };

    fetch(GENERATE_ERD_FROM_DB, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        setDbJson(result);
        localStorage.setItem("dbJson", JSON.stringify(result));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  React.useEffect(() => {
    const storedDbJson = localStorage.getItem("dbJson");
    if (storedDbJson) {
      setDbJson(JSON.parse(storedDbJson));
    }
  }, []);

  React.useEffect(() => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      redirect: "follow" as RequestRedirect,
    };

    fetch(GET_ERD_IMG, requestOptions)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setImg(url);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);
  return (
    <div>
      <h2>Database Configuration</h2>
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={value}
          onChange={handleChangeTab}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="one" label="Connection Details" />
          <Tab value="two" label="ERD" />
          <Tab value="three" label="Schema " />
        </Tabs>
      </Box>
      {!loading && (
        <>
          {value === "one" && (
            <Card
              style={{
                padding: "3rem",
                margin: "10rem",
                marginTop: "3rem",
              }}
            >
              <TextField
                label="Database Name"
                name="dbname"
                value={dbConfig.dbname}
                onChange={(e) => handleChange(e)}
                fullWidth
                margin="normal"
                size="small"
              />
              <TextField
                label="User"
                name="user"
                value={dbConfig.user}
                onChange={(e) => handleChange(e)}
                fullWidth
                margin="normal"
                size="small"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={dbConfig.password}
                onChange={(e) => handleChange(e)}
                fullWidth
                margin="normal"
                size="small"
              />
              <TextField
                label="Host"
                name="host"
                value={dbConfig.host}
                onChange={(e) => handleChange(e)}
                fullWidth
                margin="normal"
                size="small"
              />
              <TextField
                label="Port"
                name="port"
                value={dbConfig.port}
                onChange={(e) => handleChange(e)}
                fullWidth
                margin="normal"
                size="small"
              />

              <Button
                variant="contained"
                color="warning"
                onClick={handleFileUpload}
                style={{ marginTop: "1rem" }}
              >
                Connect
              </Button>
            </Card>
          )}
          {value === "two" && (
            <>
              <ImageListItem key={img}>
                <img
                  srcSet={`${img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={img}
                  alt={"ERD"}
                  loading="lazy"
                  height={"50vh"}
                  width={"90vw"}
                />
              </ImageListItem>
              {/* {dbJson && <BRD input={dbJson} />} */}
            </>
          )}
          {value === "three" && dbJson && (
            <ReactJson src={dbJson} theme="monokai" />
          )}
        </>
      )}
      <div style={{ margin: "10rem" }}>
        {loading && <Loader showIcon={false} />}
      </div>
    </div>
  );
};

export default DBConfig;
