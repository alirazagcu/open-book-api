import React from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import DefaultImage from "../assets/01.jpeg";
import Spinner from "./Spinner/Spinner";

function SearchBar() {
  const [inputValue, setInputValue] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [allData, setAllData] = React.useState([]);
  const onChangeHandler = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setInputValue(value);
  };

  const onSubmitHandler = async () => {
    const titleWithSpaces = inputValue.split(" ");
    const titleWithPlust = titleWithSpaces.join("+");
    const data = [];
    setIsLoading(true)
    const response = await axios.get(
      `http://openlibrary.org/search.json?q=${titleWithPlust}`
    );
    if (response.status === 200 && response.data.docs) {
      response.data.docs.map((book) => {
        const title = book.title;
        const bookCover = book.cover_i ? `http://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg` : "";
        const author = book.author_name;
        const publishDate = book.publish_date;
        data.push({
          title: title,
          bookCover: bookCover,
          author: author && author[0],
          publishDate: publishDate && publishDate[0],
        });
      });
      setAllData(data);
      setIsLoading(false)
    } else {
      setAllData([]);
      setIsLoading(false)
    }
  };

  const handleKeypress = e => {
    //it triggers by pressing the enter key
  if (e.code === "Enter") {
    onSubmitHandler();
  }
}
  const columns = [
    {
      name: "Book Cover",
      selector: "bookCover",
      cell: (row) => <img width="75px" height="125px" src={row.bookCover || DefaultImage} />,
    },
    {
      name: "Title",
      selector: "title",
      sortable: true,
    },
    {
      name: "Author",
      selector: "author",
      sortable: true,
    },
    {
      name: "Publish Date",
      selector: "publishDate",
      sortable: true,
    },
  ];
  return (
    <div style={{ width: "80%", marginLeft: "10%", marginTop: "10%" }}>
      <div
        style={{
          display: "flex",
        }}
      >
        <input
          style={{ width: "100%", padding: "15px" }}
          type="text"
          placeholder="Please Enter a Book Title to search"
          onKeyPress={handleKeypress}
          onChange={onChangeHandler}
        />
        <button
          style={{
            padding: "5px 30px",
            backgroundColor: "green",
            color: "black",
          }}
          onClick={onSubmitHandler}
        >
          Search
        </button>
      </div>
      {isLoading && <Spinner color="secondary" />}
      {allData && allData.length>0 && <DataTable
        data={allData}
        columns={columns}
        pagination
        noHeader
      />}
      {allData && allData.length<=0 && 
      <>
      <p>There is no data to display.</p>
      </>}
    </div>
  );
}

export default SearchBar;
