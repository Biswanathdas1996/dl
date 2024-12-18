import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useFetchCollection } from "../hook/useFetchCollection";

const filter = createFilterOptions<FilmOptionType>();

const AutoCompleteInput: React.FC = () => {
  const [collectionsData, setCollectionsData] = React.useState<any>([]);
  const [error, setError] = React.useState<any>(null);
  const { collections } = useFetchCollection();

  React.useEffect(() => {
    setCollectionsData(collections?.collections);
  }, [collections]);

  const [value, setValue] = React.useState<any>(null);
  const convertCollections = (collectionsData: any): FilmOptionType[] => {
    if (!Array.isArray(collectionsData)) {
      return [];
    }
    return collectionsData.map((collection) => {
      return {
        title: collection,
      };
    });
  };

  const result_data = convertCollections(collectionsData);

  React.useEffect(() => {
    if (localStorage.getItem("selected_collection")) {
      setValue({
        title: localStorage.getItem("selected_collection"),
      });
    }
  }, []);

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (typeof newValue === "string") {
          setValue({
            title: newValue,
          });
          localStorage.setItem("selected_collection", newValue);
        } else if (newValue && newValue.inputValue) {
          // Create a new value from the user input
          setValue({
            title: newValue.inputValue,
          });
          localStorage.setItem("selected_collection", newValue.inputValue);
        } else {
          setValue(newValue);
          localStorage.setItem("selected_collection", newValue?.title);
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        const { inputValue } = params;
        // Suggest the creation of a new value
        const isExisting = options.some(
          (option) => inputValue === option.title
        );
        if (inputValue !== "" && !isExisting) {
          filtered.push({
            inputValue,
            title: `Add "${inputValue}"`,
          });
        }

        return filtered;
      }}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id="free-solo-with-text-demo"
      options={result_data}
      getOptionLabel={(option) => {
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.title;
      }}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        return (
          <li key={key} {...optionProps}>
            {option.title}
          </li>
        );
      }}
      sx={{ width: 300 }}
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          size="small"
          label="Select or add a collection"
          style={{
            width: 190,
            padding: 0,
            float: "right",
          }}
        />
      )}
    />
  );
};

interface FilmOptionType {
  inputValue?: string;
  title: string;
}

export default AutoCompleteInput;
