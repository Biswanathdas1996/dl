import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import { useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Card from "@mui/material/Card";
// import Bredcumbs from "../components/Bredcumbs";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface Field {
  id: number;
  value: string;
  type: string;
}

interface BasicTextFieldsProps {
  fields: Field[];
  setFields: React.Dispatch<React.SetStateAction<Field[]>>;
  usedFor: string;
}

function BasicTextFields({ fields, setFields, usedFor }: BasicTextFieldsProps) {
  const addField = (type: string) => {
    setFields([...fields, { id: new Date().getTime(), value: "", type }]);
  };

  const onChangeField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: any
  ) => {
    const newFields = fields.map((f) => {
      if (f.id === field.id) {
        return { ...f, value: e.target.value };
      }
      return f;
    });
    setFields(newFields);
  };

  return (
    <Card
      component="form"
      sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
      style={{ padding: 20, backgroundColor: "#f1f1f1" }}
    >
      {fields.map((field) => (
        <div style={{ display: "flex", width: "100%" }}>
          <TextField
            id={`outlined-basic-${field.id}`}
            label={usedFor}
            variant="outlined"
            onChange={(e) => onChangeField(e, field)}
            value={field.value || ""}
            style={{ marginBottom: 10, marginTop: 10, width: 300 }}
          />
          <DeleteForeverIcon
            color="error"
            onClick={() => {
              setFields(fields.filter((f) => f.id !== field.id));
            }}
            style={{ marginLeft: 10, marginTop: 30, cursor: "pointer" }}
          />
        </div>
      ))}

      <Button
        variant="contained"
        color="warning"
        onClick={() => addField(usedFor)}
      >
        <AddIcon /> Add More
      </Button>
    </Card>
  );
}

export default function Config() {
  const [instructionForUserStories, setInstructionForUserStories] = useState<
    Field[]
  >([]);
  const [instructionForTestCases, setInstructionForTestCases] = useState<
    Field[]
  >([]);
  const [instructionForTestData, setInstructionForTestData] = useState<Field[]>(
    []
  );
  const [instructionForCode, setInstructionForCode] = useState<Field[]>([]);

  const [model, setModel] = React.useState("gpt-4o-mini");

  const handleChange = (event: SelectChangeEvent) => {
    setModel(event.target.value as string);
    localStorage.setItem("model", event.target.value as string);
    window.location.reload();
  };

  React.useEffect(() => {
    const savedModel = localStorage.getItem("model");
    if (savedModel) {
      setModel(savedModel);
    }
  }, []);

  React.useEffect(() => {
    const savedConfig = localStorage.getItem("config");
    if (savedConfig) {
      const {
        instructionForUserStories,
        instructionForTestCases,
        instructionForTestData,
        instructionForCode,
      } = JSON.parse(savedConfig);
      setInstructionForUserStories(instructionForUserStories || []);
      setInstructionForTestCases(instructionForTestCases || []);
      setInstructionForTestData(instructionForTestData || []);
      setInstructionForCode(instructionForCode || []);
    }
  }, []);

  React.useEffect(() => {
    if (
      instructionForUserStories.length === 0 &&
      instructionForTestCases.length === 0 &&
      instructionForTestData.length === 0 &&
      instructionForCode.length === 0
    ) {
      return;
    }
    const allInstructions = {
      instructionForUserStories,
      instructionForTestCases,
      instructionForTestData,
      instructionForCode,
    };
    localStorage.setItem("config", JSON.stringify(allInstructions));
  }, [
    instructionForUserStories,
    instructionForTestCases,
    instructionForTestData,
    instructionForCode,
  ]);
  return (
    <div>
      <h2>Configuration</h2>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <>
              <h4>Choose a AI model</h4>
              <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select Model
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={model}
                    label="Age"
                    onChange={handleChange}
                  >
                    <MenuItem value={"gpt-4"}>gpt-4</MenuItem>
                    <MenuItem value={"gpt-4o"}>gpt-4o</MenuItem>
                    <MenuItem value={"gpt-4o-mini"}>gpt-4o-mini</MenuItem>
                    <MenuItem value={"gpt-4-turbo"}>GPT-4-turbo</MenuItem>
                    <MenuItem value={"gpt-3.5-turbo"}>GPT-3.5-turbo</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid size={6}>
            <>
              <h4>Instructions for generating user story</h4>
              <BasicTextFields
                fields={instructionForUserStories}
                setFields={setInstructionForUserStories}
                usedFor="instructionForUserStories"
              />
            </>
          </Grid>
          <Grid size={6}>
            <>
              <h4>Instructions for generating test cases</h4>
              <BasicTextFields
                fields={instructionForTestCases}
                setFields={setInstructionForTestCases}
                usedFor="instructionForTestCases"
              />
            </>
          </Grid>
          <Grid size={6}>
            <>
              <h4>Instructions for generating test data</h4>
              <BasicTextFields
                fields={instructionForTestData}
                setFields={setInstructionForTestData}
                usedFor="instructionForTestData"
              />
            </>
          </Grid>
          <Grid size={6}>
            <>
              <h4>Instructions for generating code</h4>
              <BasicTextFields
                fields={instructionForCode}
                setFields={setInstructionForCode}
                usedFor="instructionForCode"
              />
            </>
          </Grid>
        </Grid>
        <br />
        <br />
        <br />
      </Box>
    </div>
  );
}
