import { useGetWorksQuery } from "../../slices/workApiSlice";
import Loader from "../../components/Loader/Loader";
import WorkCard from "../../components/WorkCard/WorkCard";
import Pagination from "../../components/Pagination/Pagination";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import SearchBar from "../../components/SeachBar/SearchBar";

const WorkerWorksScreen = () => {
  const [works, setWorks] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("asd");
  const initialRender = useRef(false);

  const searchQuery = (search) => {
    setQuery(search);
  };

  const getWorksViaPagination = (value) => {
    const {
      data: result,
      isFetching,
      isLoading,
      error,
    } = useGetWorksQuery({
      page: value,
      query,
    });
    if (result !== null && result !== undefined) {
      setWorks(result.works);
      setPage(result.page);
      setPages(result.pages);
    }
    if (error) toast.error(error);
  };

  const {
    data: initialResult,
    isFetching,
    isLoading,
    error,
  } = useGetWorksQuery(
    {
      page: 1,
      query,
    },
    { skip: initialRender.current ? true : false }
  );

  useEffect(() => {
    if (initialResult !== null && initialResult !== undefined) {
      initialRender.current = true;
      setWorks(initialResult.works);
      setPage(initialResult.page);
      setPages(initialResult.pages);
    }
    if (error) toast.error(error);
  }, [initialResult]);

  return !works ? (
    <Loader />
  ) : (
    <div className="position-relative">
      <div className="w-100 my-4">
        <SearchBar placeholder={"Search works.."} method={searchQuery} />
      </div>
      {works &&
        works.map((work, key) => {
          return <WorkCard workDetails={work.work[0]} key={key} />;
        })}

      <Pagination pages={pages} page={page} method={getWorksViaPagination} />
    </div>
  );
};

export default WorkerWorksScreen;
