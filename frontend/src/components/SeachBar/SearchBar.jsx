import { useState } from "react";
import { Form } from "react-bootstrap";
import "./SearchBox.scss";

const SearchBar = ({ placeholder, method }) => {
  const [search, setSearch] = useState("");

  return (
    <Form
      className="searchbox"
      onSubmit={(e) => {
        e.preventDefault();
        method(search);
      }}
    >
      <div className="d-flex">
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => setSearch(e.target.value)}
          className="me-1 form-control shadow-sm"
        />
        <button
          type="submit"
          className="button button-search d-flex justify-content-center align-items-center shadow-sm"
        >
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
    </Form>
  );
};

export default SearchBar;
