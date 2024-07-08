import { Fragment, useState, useEffect } from "react";
import axios from 'axios';
import uuid from "react-uuid";
import Nestable from "react-nestable";
// Material UI Components
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
// Icons
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import SaveIcon from '@material-ui/icons/Save';
// Form Elements
import {
  TextFieldInput,
  TextArea,
  NumberInput,
  RadioInput,
  DateInput,
  TimeInput,
} from "./elements";
import Layout from './elements/layout'
import { formEl } from "./constants.js";
// Components
import Header from "./Header";
import { useParams } from 'react-router-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';
// Custom hook to use local storage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};

const FormBuilder = () => {
  const initVal = formEl[0]?.value;
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const [title, setTitle] = useLocalStorage("formTitle", "Untitled Form");
  const [description, setDescription] = useLocalStorage("formDescription", "");
  const [data, setData] = useLocalStorage("formData", []);
  const [formData, setFormData] = useLocalStorage("formElementType", "text");
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (id && !isFetched) {
      const fetchForm = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/getForm/${id}`);
          const form = response.data;
          setTitle(form.title || "Untitled Form");
          setDescription(form.description || "");
          setData(form.data || []);
          setIsFetched(true); // Set the flag to true after fetching data
        } catch (error) {
          console.error('Error fetching form:', error);
        }
      };
      fetchForm();
    }
  }, [id, isFetched, setTitle, setDescription, setData]);

  const items = data;

  // Function to add new element
  const addElement = () => {
    const newElement = {
      id: uuid(),
      value: null,
      type: formData,
      required: false,
    };
    setData((prevState) => [...prevState, newElement]);
    setFormData(initVal);
  };

  // Function to delete element
  const deleteEl = (id) => {
    setData((prevState) => prevState.filter((val) => val.id !== id));
  };

  // Function to add element at specific pos and return arr
  const addAfter = (elArray, index, newEl) => {
    return [...elArray.slice(0, index + 1), newEl, ...elArray.slice(index + 1)];
  };

  // Function to duplicate element
  const duplicateElement = (elId, elType) => {
    let elIdx = data.findIndex((el) => el.id === elId);
    let newEl = {
      id: uuid(),
      value: null,
      type: elType,
      required: false,
    };
    let newArr = addAfter(data, elIdx, newEl);
    setData(newArr);
  };

  // Function to handle sorting of elements
  const handleOnChangeSort = ({ items }) => {
    setData(items);
  };

  // Function to Handle Input Values
  const handleValue = (id, e) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        return { ...el, value: e.target.value };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  // Function to Handle Required
  const handleRequired = (id) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        return { ...el, required: !el.required };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  // Function to Handle Element Type
  const handleElType = (id, type) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        return { ...el, type: type };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  // Function to Handle Options
  const addOption = (id, newOption) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        const objVal = "options" in el ? el.options : [];
        return { ...el, options: [...objVal, newOption] };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  // Function to Handle Date
  const handleDate = (id, dateVal) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        return { ...el, date: dateVal };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  // Function to Handle Time
  const handleTime = (id, dateVal) => {
    let newArr = data.map((el) => {
      if (el.id === id) {
        return { ...el, time: dateVal };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  // Function to Change Option Values
  const handleOptionValues = (elId, optionId, optionVal) => {
    let newArr = data.map((el) => {
      if (el.id === elId) {
        el?.options &&
          el.options.map((opt) => {
            if (opt.id === optionId) {
              opt.value = optionVal;
            }
          });
        return el;
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  // Function to Delete Option
  const deleteOption = (elId, optionId) => {
    let newArr = data.map((el) => {
      if (el.id === elId) {
        let newOptions =
          el?.options && el.options.filter((opt) => opt.id !== optionId);
        return { ...el, options: newOptions };
      } else {
        return el;
      }
    });
    setData(newArr);
  };

  // Function to Save Form
  const saveForm = async () => {
    try {
      const response = await axios.post('http://localhost:5000/saveForm', {
        id,
        title,
        description,
        data
      });
      console.log('Form saved successfully:', response.data);
      enqueueSnackbar('Form saved successfully!', { variant: 'success' }); // Show success toast message
    } catch (error) {
      console.error('Error saving form:', error);
      enqueueSnackbar('Error saving form!', { variant: 'error' }); // Show error toast message
    }
  };

  // Render items
  const renderElements = ({ item }) => {
    switch (item.type) {
      case "text":
        return (
          <TextFieldInput
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            duplicateElement={duplicateElement}
          />
        );
      case "textarea":
        return (
          <TextArea
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            duplicateElement={duplicateElement}
          />
        );
      case "number":
        return (
          <NumberInput
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            duplicateElement={duplicateElement}
          />
        );
      case "radio":
        return (
          <RadioInput
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            addOption={addOption}
            handleOptionValues={handleOptionValues}
            deleteOption={deleteOption}
            duplicateElement={duplicateElement}
          />
        );
      case "date":
        return (
          <DateInput
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            handleDate={handleDate}
            duplicateElement={duplicateElement}
          />
        );
      case "time":
        return (
          <TimeInput
            item={item}
            handleValue={handleValue}
            deleteEl={deleteEl}
            handleRequired={handleRequired}
            handleElType={handleElType}
            handleTime={handleTime}
            duplicateElement={duplicateElement}
          />
        );
      default:
        return <Fragment></Fragment>;
    }
  };

  console.log(data);

  return (
    <Fragment>
      <div className="p-[2%]">
        <div className="flex justify-center w-full align-center p-10 pl-10 ml-[-28px]">
          <h1 class="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-500 md:text-5xl lg:text-4xl"><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Susanoox</span> Form-builder.</h1>
        </div>
        <Grid container spacing={1} direction="row" justifyContent="center">
          <Grid item md={6}>
            <Header
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
            />
            <Nestable
              items={items}
              renderItem={renderElements}
              maxDepth={1}
              onChange={handleOnChangeSort}
            />
          </Grid>
          <Grid item md={1}>
            <Box sx={{ display: 'flex', flexDirection: 'column', position: 'sticky', top: 30 }}>
              <Tooltip title="Add Element" aria-label="add-element">
                <IconButton aria-label="add-element" onClick={addElement}>
                  <AddCircleOutlineOutlinedIcon color="secondary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save Form" aria-label="save-form">
                <IconButton aria-label="save-form" onClick={saveForm} sx={{ marginTop: 2 }}>
                  <SaveIcon color="secondary" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </div>
    </Fragment>
  );
};

const App = () => (
  <SnackbarProvider maxSnack={3}>
    <FormBuilder />
  </SnackbarProvider>
);

export default App;
